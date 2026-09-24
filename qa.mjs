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
    "Battlecry I / Challenge I",
    "Pressure I / Provoke I",
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
    "Poison Sac / Hemorrhage II",
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
    "Sun Aura / Moon Aura",
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

const allFormIds = new Set();
const allInvestmentIds = new Set();
for (const [className, data] of Object.entries(DATA)) {
  assert(data.nodes.length === 20, `${className}: forms must not count as investments`);
  assert(data.core.length === 3, `${className}: core slot count changed`);
  for (const parent of [...data.core, ...data.nodes]) {
    assert(Array.isArray(parent.forms) && parent.forms.length > 0, `${className}/${parent.id}: forms[] required`);
    if (parent.investmentId) {
      assert(!allInvestmentIds.has(parent.investmentId), `duplicate investmentId ${parent.investmentId}`);
      allInvestmentIds.add(parent.investmentId);
    }
    for (const form of parent.forms) {
      assert(!allFormIds.has(form.id), `duplicate FormId ${form.id}`);
      allFormIds.add(form.id);
      const stableParentId = parent.investmentId || parent.grantedSlotId;
      assert(stableParentId && form.id.startsWith(stableParentId + "."), `${form.id}: FormId must use its stable parent identity`);
      assert(form.name && form.context?.selector && form.context?.value && form.context?.capture, `${form.id}: explicit name/context required`);
      assert(form.description && !forbiddenPlayerCopy.test(form.description), `${form.id}: player-facing copy missing or contains runtime wording`);
      assert(form.fields && typeof form.fields === "object", `${form.id}: fields required`);
      for (const field of ["Activation Type", "Target Type", "Target Relation", "Travel Type", "Movement Type", "Effect Type", "Resource Cost"]) {
        assert(Object.hasOwn(form.fields, field), `${form.id}: missing execution field ${field}`);
      }
      assert(Array.isArray(form.effects) && form.effects.length > 0, `${form.id}: ordered effects required`);
      assert(Array.isArray(form.keywords), `${form.id}: keywords required`);
      assert(!("cost" in form) && !("spCost" in form), `${form.id}: form must not own SP cost`);
      assert(!("requires" in form) && !("exclusiveWith" in form), `${form.id}: form must not own progression prerequisites/exclusivity`);
      assert(form.presentation && Object.hasOwn(form.presentation, "vfxKey") && Object.hasOwn(form.presentation, "animationKey") && Object.hasOwn(form.presentation, "audioKey"), `${form.id}: presentation key slots required`);
      for (const key of ["vfxKey", "animationKey", "audioKey"]) assert(form.presentation[key] === null || typeof form.presentation[key] === "string", `${form.id}: invalid ${key}`);
    }
  }
}
assert(allInvestmentIds.size === 80, `expected 80 stable investment identities, found ${allInvestmentIds.size}`);
assert(Object.values(DATA).reduce((sum, data) => sum + data.core.length, 0) === 12, "Granted/Core slots must remain outside the 80 investments");
const formOf = (className, parentId, suffix) => {
  const parent = DATA[className].core.concat(DATA[className].nodes).find((x) => x.id === parentId);
  assert(parent, `${className}: missing parent ${parentId}`);
  const form = parent.forms.find((x) => x.name.endsWith(suffix));
  assert(form, `${className}/${parentId}: missing form ${suffix}`);
  return form;
};
assert(DATA.Scout.universalActions.length === 1, "Scout: Basic Attack remains a Universal Action");
assert(DATA.Scout.universalActions[0].forms.length === 2, "Scout Basic Attack requires Poison/Bleed forms");
assert(DATA.Scout.universalActions[0].spCost === null, "Universal Action cannot cost Skill Points");
for (const form of DATA.Scout.universalActions[0].forms) {
  assert(!allFormIds.has(form.id), `duplicate FormId ${form.id}`);
  allFormIds.add(form.id);
  assert(form.context?.selector === "scout-stance-at-admission", `${form.id}: Basic Attack must snapshot stance at attack admission`);
  assert(Array.isArray(form.effects) && form.effects.length > 0 && Array.isArray(form.keywords), `${form.id}: action form contract incomplete`);
  assert(form.presentation && Object.hasOwn(form.presentation, "vfxKey") && Object.hasOwn(form.presentation, "animationKey") && Object.hasOwn(form.presentation, "audioKey"), `${form.id}: action presentation keys missing`);
  for (const field of ["Activation Type", "Target Type", "Target Relation", "Travel Type", "Movement Type", "Effect Type", "Resource Cost"]) assert(Object.hasOwn(form.fields, field), `${form.id}: missing execution field ${field}`);
}
assert(DATA.Scout.nodes.filter((x) => x.name === "Poison Sac / Hemorrhage II").length === 1, "Sickness deepening must retain one investment identity");
assert(DATA.Scout.nodes.find((x) => x.id === "sickness").legacyName === "Sickness", "Sickness must remain legacy metadata only");
const backstab = DATA.Scout.nodes.find((x) => x.id === "ambush");
assert(backstab.name === "Backstab II" && !backstab.keywords.includes("Interrupt") && backstab.keywords.includes("Stun"), "Backstab II keyword reconciliation failed");
assert(backstab.forms[0].effects.some((x) => /Stun instead of Interrupting/i.test(x)), "Backstab II rear hit must Stun instead of Interrupt");
assert(DATA.Scout.core.find((x) => x.id === "core-poison-bleed-stance").forms.map((f) => f.context.value).join("/") === "Poison/Bleed", "Scout stance forms missing");
assert(DATA.Scout.core.find((x) => x.id === "core-poison-sac-hemorrhage").forms.length === 2, "Poison Sac/Hemorrhage core forms missing");
for (const id of ["volley","narrowing-volley"]) assert(DATA.Scout.nodes.find((x) => x.id === id).forms.map((f) => f.context.value).join("/") === "Poison/Bleed", `Scout/${id}: Poison/Bleed forms missing`);
for (const form of DATA.Scout.nodes.find((x) => x.id === "sickness").forms) assert(/atomically/i.test(form.effects.join(" ")) && /without ordinary Pop downgrade/i.test(form.effects.join(" ")), `${form.id}: dual-Max atomic consume/failure rule missing`);
const storm = DATA.Mage.nodes.find((x) => x.id === "mana-storm");
assert(!/overlapping Mana Storm areas do not combine/i.test(storm.description), "Mana Storm must not claim an overlap stacking rule");
assert(/overlapping Mana Storm areas are not a supported/i.test(storm.forms[0].technicalNotes), "Mana Storm unsupported overlap note missing");
assert(formOf("Fighter", "blade-rush-shield-rush", "Warrior").keywords.includes("Haste"), "Shoulder Rush II Warrior Haste missing");
assert(formOf("Fighter", "blade-rush-shield-rush", "Tank").keywords.includes("Fortified"), "Shoulder Rush II Tank Fortified missing");
for (const suffix of ["Warrior", "Tank"]) assert(formOf("Fighter", "breaching-strike-warrior-tank", suffix).effects.some((x) => /Slow before hit resolution/.test(x)), `Piercing Strike II ${suffix}: pre-hit Slow condition missing`);
for (const suffix of ["Warrior", "Tank"]) assert(formOf("Fighter", "bloodlust-inspiration", suffix), `Rally II ${suffix} missing`);
assert(/Max Momentum at admission/.test(formOf("Fighter", "bloodlust-inspiration", "Warrior").technicalNotes), "Rally II admission gate missing");
for (const id of ["fire-bolt","fire-ball","combust","combust-combo","frost-lance","permafrost","glacial-spike","glacial-spike-combo","static-bolt","conductive-lightning","thunderstrike","thunderstrike-combo"]) {
  const parent = DATA.Mage.nodes.find((x) => x.id === id);
  assert(parent && parent.forms.length === 2 && parent.forms.some((f) => /Manifest/.test(f.name)) && parent.forms.some((f) => /Weave/.test(f.name)), `Mage/${id}: Manifest/Weave forms required`);
}
const syntheses = DATA.Mage.core.find((x) => x.id === "core-arcane-burst");
assert(syntheses.forms.length === 7, "Arcane Burst slot must contain Arcane Burst and six Synthesis forms");
assert(syntheses.forms.slice(1).map((f) => f.name).join("|") === "Vortex — Fire + Fire|Iceberg — Ice + Ice|Coil — Lightning + Lightning|Mist — Fire + Ice|Laser — Fire + Lightning|Tempest — Ice + Lightning", "Arcane Burst Synthesis inventory mismatch");
assert(syntheses.forms.filter((f) => f.fields.Cooldown === "Independent per Synthesis").length === 6, "Synthesis cooldown relations must stay independent");
assert(syntheses.forms.slice(1).every((f) => /^Two Element Memory entries: /.test(f.fields["Resource Cost"])), "Synthesis forms must consume their own Element Memory pair");
assert(formOf("Mystic", "ether", "Ally").fields["Target Relation"] === "Ally" && formOf("Mystic", "ether", "Enemy").fields["Target Relation"] === "Enemy", "Ether I relation forms incorrect");
assert(DATA.Mystic.core.find((x) => x.id === "core-bright-star-full-moon").forms.every((f) => f.context.capture === "admission"), "Bright Star/Full Moon form and resource selection must be admission-time");
assert(DATA.Mystic.nodes.find((x) => x.id === "tick-tack").forms.length === 2, "Ether II requires Ally/Enemy forms");
for (const id of ["spirit-of-the-orbit","spirit-of-the-star","spirit-of-the-comet"]) {
  const spirit = DATA.Mystic.nodes.find((x) => x.id === id);
  assert(spirit.forms.length === 2 && spirit.forms.every((f) => f.context.capture === "cast"), `Mystic/${id}: Sun/Moon cast-captured forms required`);
}
assert(DATA.Mystic.nodes.find((x) => x.id === "connection").forms.length === 2 && DATA.Mystic.nodes.find((x) => x.id === "ritual").forms.length === 2, "Connection I/II require Ally/Enemy forms");
assert(DATA.Mystic.nodes.find((x) => x.id === "connection").forms.every((f) => f.context.selector === "target-relation"), "Connection I selection must use target relation");
assert(DATA.Mystic.nodes.find((x) => x.id === "astral-aura").forms.map((x) => x.name).join("/") === "Sun Aura/Moon Aura", "Aura forms/player-facing names incorrect");
assert(DATA.Mystic.nodes.find((x) => x.id === "astral-aura").forms.every((f) => f.context.capture === "aura-pulse" && f.fields["Resource Cost"] === "OPEN"), "Aura must follow stance at pulse; resource tuning remains open");
for (const id of ["spirit-of-the-orbit","spirit-of-the-star","spirit-of-the-comet"]) assert(/host slot/.test(DATA.Mystic.nodes.find((x) => x.id === id).forms[0].technicalNotes), `Mystic/${id}: lifecycle/host-slot notes missing`);
for (const id of ["connection","ritual"]) assert(/initial main-target (Bliss|Curse) application succeeds/.test(DATA.Mystic.nodes.find((x) => x.id === id).forms[0].technicalNotes), `Mystic/${id}: successful initial-result gate missing`);
assert(!DATA.Mystic.nodes.find((x) => x.id === "serenity").forms.some((x) => /Ally|Enemy/.test(x.name)), "Serenity must remain one compound execution");
assert(!DATA.Mystic.nodes.find((x) => x.id === "eclipse").forms.some((x) => /Ally|Enemy/.test(x.name)), "Eclipse must remain one hybrid execution");
console.log(`FORMS PASS: ${allFormIds.size} stable unique FormIds; 80 investments unchanged; contextual cases validated.`);
