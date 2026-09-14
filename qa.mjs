import fs from "node:fs";
import vm from "node:vm";

const context = { window: { SKILL_TREE_DATA: {} } };
vm.createContext(context);
for (const file of ["fighter", "scout", "mage", "mystic"]) {
  vm.runInContext(fs.readFileSync(`data/${file}.js`, "utf8"), context, {
    filename: `data/${file}.js`,
  });
}

const DATA = context.window.SKILL_TREE_DATA;
const expectedClasses = ["Fighter", "Scout", "Mage", "Mystic"];
const fail = (message) => {
  throw new Error(message);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

for (const name of expectedClasses) {
  const data = DATA[name];
  assert(data, `${name}: missing class data`);
  assert(
    data.nodes.length === 20,
    `${name}: expected 20 investments, found ${data.nodes.length}`,
  );
  assert(data.maxSp === 13, `${name}: maxSp must be 13`);
  assert(
    JSON.stringify(data.thresholds) ===
      JSON.stringify({ 1: 0, 2: 5, 3: 9, 4: 11 }),
    `${name}: incorrect tier thresholds`,
  );
  const counts = [1, 2, 3, 4].map(
    (tier) => data.nodes.filter((node) => node.tier === tier).length,
  );
  assert(
    JSON.stringify(counts) === JSON.stringify([7, 6, 4, 3]),
    `${name}: tier distribution must be 7/6/4/3, got ${counts.join("/")}`,
  );

  const ids = new Set(data.nodes.map((node) => node.id));
  assert(ids.size === data.nodes.length, `${name}: duplicate node ids`);
  for (const node of data.nodes) {
    for (const requirement of node.requires || []) {
      assert(
        ids.has(requirement),
        `${name}: ${node.id} requires missing node ${requirement}`,
      );
    }
    for (const excluded of node.exclusiveWith || []) {
      assert(
        ids.has(excluded),
        `${name}: ${node.id} excludes missing node ${excluded}`,
      );
      const other = data.nodes.find((candidate) => candidate.id === excluded);
      assert(
        (other.exclusiveWith || []).includes(node.id),
        `${name}: exclusivity ${node.id} ↔ ${excluded} is not reciprocal`,
      );
    }
  }

  const selected = new Set();
  const threshold = (tier) => data.thresholds[String(tier)];
  const available = (node) => {
    if (selected.has(node.id) || selected.size >= data.maxSp) return false;
    if (selected.size < threshold(node.tier)) return false;
    if ((node.requires || []).some((id) => !selected.has(id))) return false;
    if ((node.exclusiveWith || []).some((id) => selected.has(id))) return false;
    return true;
  };

  while (selected.size < data.maxSp) {
    const next = data.nodes.find(available);
    assert(
      next,
      `${name}: could not construct a valid 13-SP build; stalled at ${selected.size}`,
    );
    selected.add(next.id);
  }
  assert(selected.size === 13, `${name}: valid build did not reach 13 SP`);
  assert(
    !data.nodes.some(available),
    `${name}: nodes remained purchasable after reaching 13 SP cap`,
  );
}

const requireEdge = (className, childId, parentId) => {
  const node = DATA[className].nodes.find((item) => item.id === childId);
  assert(node, `${className}: missing expected node ${childId}`);
  assert(
    (node.requires || []).includes(parentId),
    `${className}: expected ${parentId} → ${childId}`,
  );
};

requireEdge("Fighter", "severing-strike-stage-ii", "severing-strike");
requireEdge("Fighter", "severing-strike-stage-iii", "severing-strike-stage-ii");
requireEdge("Fighter", "breaching-strike-warrior-tank", "piercing-strike");
requireEdge("Fighter", "blade-rush-shield-rush", "shoulder-rush");
requireEdge("Fighter", "crushing-blow-combo", "crushing-blow");
requireEdge("Fighter", "battlerage-chain-challenge", "battlecry-challenge");
requireEdge("Fighter", "chain-pull", "chains");
requireEdge("Fighter", "bloodlust-inspiration", "rally");

requireEdge("Mage", "fire-ball", "fire-bolt");
requireEdge("Mage", "combust-combo", "combust");
requireEdge("Mage", "permafrost", "frost-lance");
requireEdge("Mage", "glacial-spike-combo", "glacial-spike");
requireEdge("Mage", "conductive-lightning", "static-bolt");
requireEdge("Mage", "thunderstrike-combo", "thunderstrike");
requireEdge("Mage", "overcharge", "mana-barrier");
requireEdge("Mage", "arcane-master", "arcane-weaving");
requireEdge("Mage", "elemental-master", "elemental-weaver");

requireEdge("Mystic", "spirit-of-the-star", "spirit-of-the-orbit");
requireEdge("Mystic", "spirit-of-the-comet", "spirit-of-the-star");
requireEdge("Mystic", "ritual", "connection");
requireEdge("Mystic", "white-hole", "black-hole");

const arcane = DATA.Mage.nodes.find((node) => node.id === "arcane-weaving");
const elemental = DATA.Mage.nodes.find(
  (node) => node.id === "elemental-weaver",
);
assert(
  arcane.exclusiveWith.includes("elemental-weaver"),
  "Mage: Arcane Weaving must exclude Elemental Weaver",
);
assert(
  elemental.exclusiveWith.includes("arcane-weaving"),
  "Mage: Elemental Weaver must exclude Arcane Weaving",
);

console.log(
  "QA PASS: 4 classes, 80 investments, tier rules, references, exclusivity and required Fighter/Mage chains validated.",
);

const expectedNames = {
  Fighter: [
    "Severing Strike I",
    "Piercing Strike I",
    "Shoulder Rush I",
    "Crushing Blow I",
    "Battlecry / Challenge I",
    "Pressure / Provoke",
    "Second Wind",
    "Severing Strike II",
    "Shoulder Rush II",
    "Crushing Blow II",
    "Chains I",
    "War Leap",
    "Rally I",
    "Severing Strike III",
    "Chains II",
    "Piercing Strike II",
    "Defiant Presence",
    "Battlecry / Challenge II",
    "Momentum Mastery",
    "Rally II",
  ],
  Scout: [
    "Exploit Weakness I",
    "Quickstep I",
    "Rapid Attack",
    "Backstab I",
    "Torpor",
    "Blinding Dart",
    "Volley I",
    "Exploit Weakness II",
    "Quickstep II",
    "Long Jump",
    "Evasion",
    "Sand Shot",
    "Vine Field I",
    "Backstab II",
    "Smoke Bomb I",
    "Vine Field II",
    "Volley II",
    "Sickness",
    "Exploit Weakness III",
    "Smoke Bomb II",
  ],
  Mage: [
    "Fire Bolt I",
    "Combust I",
    "Frost Lance I",
    "Glacial Spike I",
    "Static Bolt I",
    "Thunderstrike I",
    "Blink",
    "Fire Bolt II",
    "Combust II",
    "Frost Lance II",
    "Glacial Spike II",
    "Thunderstrike II",
    "Mana Barrier I",
    "Static Bolt II",
    "Mana Barrier II",
    "Arcane Weaving I",
    "Elemental Weaver I",
    "Arcane Weaving II",
    "Elemental Weaver II",
    "Mana Storm",
  ],
  Mystic: [
    "Ether I",
    "Spirit of the Orbit",
    "Cosmic Ray I",
    "Connection I",
    "Lullaby I",
    "Astral Aura",
    "Astral Step",
    "Ether II",
    "Resurrect",
    "Spirit of the Star",
    "Cosmic Ray II",
    "Serenity",
    "Black Hole I",
    "Spirit of the Comet",
    "Lullaby II",
    "Connection II",
    "Black Hole II",
    "Eclipse",
    "Astral Pull",
    "Astral Veil",
  ],
};
const forbiddenPlayerCopy =
  /authoritative|Skill\s?Execution|ResolveAt|MaxStacks|pre-existing|qualifying|admitted|admission|concrete Root|internal EffectType/i;
for (const [name, data] of Object.entries(DATA)) {
  assert(
    data.core.length === 3,
    `${name}: expected exactly 3 Granted/Core slots`,
  );
  assert(
    JSON.stringify(
      [...data.nodes]
        .sort((a, b) => a.tier - b.tier || a.order - b.order)
        .map((node) => node.name),
    ) === JSON.stringify(expectedNames[name]),
    `${name}: node names or canonical tier order differ from simulator reference`,
  );
  for (const tier of [1, 2, 3, 4]) {
    const orders = data.nodes
      .filter((node) => node.tier === tier)
      .map((node) => node.order)
      .sort((a, b) => a - b);
    assert(
      JSON.stringify(orders) ===
        JSON.stringify(
          Array.from({ length: orders.length }, (_, index) => index + 1),
        ),
      `${name}: Tier ${tier} order is incorrect`,
    );
  }
  for (const node of data.nodes) {
    assert(
      node.description && !node.short && !node.tooltip,
      `${name}/${node.name}: description layers are not normalized`,
    );
    assert(
      Array.isArray(node.keywords),
      `${name}/${node.name}: explicit semantic keyword metadata missing`,
    );
    assert(
      !forbiddenPlayerCopy.test(node.description),
      `${name}/${node.name}: runtime wording leaked into player copy`,
    );
    assert(
      !/(heavy|powerful|burst|negligible|normal) damage/i.test(
        node.description,
      ),
      `${name}/${node.name}: qualitative damage wording is forbidden`,
    );
  }
}
console.log(
  "SIMULATOR REFERENCE PASS: names, order, descriptions, core slots and explicit semantic tags validated.",
);
