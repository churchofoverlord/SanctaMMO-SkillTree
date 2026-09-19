const DATA = window.SKILL_TREE_DATA;

const SKILL_ICON_ORDER = [
  "fighter/Battlecry","fighter/Bulwark","fighter/Chain_pull","fighter/Chains","fighter/Challenge","fighter/Cleanse","fighter/Crushing_blow","fighter/Defiant_presence","fighter/Piercing_strike","fighter/Pressure","fighter/Provoke","fighter/Rage","fighter/Rally","fighter/Rally_Tank","fighter/Rally_Warrior","fighter/Second_wind","fighter/Severing_strike","fighter/Shoulder_rush","fighter/Shoulder_rush_tank","fighter/Shoulder_rush_warrior","fighter/Tank_stance","fighter/War_leap","fighter/Warrior_stance",
  "mage/Arcane_burst","mage/Arcane_weaving","mage/Blink","mage/Cleanse","mage/Coil","mage/Combust","mage/Elemental_weaver","mage/Fire_bolt","mage/Frost_lance","mage/Glacial_spike","mage/Iceberg","mage/Laser","mage/Mana_barrier","mage/Mana_storm","mage/Mist","mage/Overcharge","mage/Static_bolt","mage/Tempest","mage/Thunderstrike","mage/Vortex",
  "mystic/Astral_pull","mystic/Astral_step","mystic/Astral_veil","mystic/Black_hole","mystic/Bright_star","mystic/Cleanse","mystic/Connection_ally","mystic/Connection_enemy","mystic/Cosmic_ray","mystic/Eclipse","mystic/Ether_ally","mystic/Ether_enemy","mystic/Full_moon","mystic/Lullaby","mystic/Moon_aura","mystic/Moon_stance","mystic/Nightmare","mystic/Resurrect","mystic/Serenity","mystic/Spirit_of_the_comet","mystic/Spirit_of_the_orbit","mystic/Spirit_of_the_star","mystic/Sun_Stance","mystic/Sun_aura",
  "scout/Backstab","scout/Bleed_stance","scout/Blinding_dart","scout/Cleanse","scout/Evasion","scout/Exploit_weakness","scout/Hemorrhage","scout/Long_jump","scout/Poison_sac","scout/Poison_stance","scout/Quickstep","scout/Rapid_attack","scout/Sand_shot","scout/Sickness","scout/Smoke_bomb","scout/Torpor","scout/Vine_field","scout/Volley"
];
const SKILL_ICON_INDEX = new Map(SKILL_ICON_ORDER.map((key, index) => [key.toLowerCase(), index]));
const SKILL_ICON_COLS = 10;
const SKILL_ICON_ROWS = 9;
const SKILL_ICON_SPRITE = "assets/skill-icons.webp?v=icons-hq-1";
const CLASS_ICON_SOURCES = {
  Fighter: "assets/class-fighter.webp?v=class-emblems-1",
  Mage: "assets/class-mage.webp?v=class-emblems-1",
  Mystic: "assets/class-mystic.webp?v=class-emblems-1",
  Scout: "assets/class-scout.webp?v=class-emblems-1",
};
const DUAL_FORM_LABELS = {
  Fighter: {
    "core-warrior-tank-stance": ["Warrior Stance", "Tank Stance"],
    "core-rage-bulwark": ["Rage", "Bulwark"],
    "blade-rush-shield-rush": ["Warrior form", "Tank form"],
    "battlecry-challenge": ["Warrior form", "Tank form"],
    "battlerage-chain-challenge": ["Warrior form", "Tank form"],
    "pressure-provoke": ["Warrior form", "Tank form"],
    "bloodlust-inspiration": ["Warrior form", "Tank form"],
    "momentum-mastery": ["Rage", "Bulwark"],
  },
  Mystic: {
    "core-sun-moon-stance": ["Sun Stance", "Moon Stance"],
    "core-bright-star-full-moon": ["Bright Star", "Full Moon"],
    "ether": ["Ally", "Enemy"],
    "tick-tack": ["Ally", "Enemy"],
    "connection": ["Ally", "Enemy"],
    "ritual": ["Ally", "Enemy"],
    "astral-aura": ["Sun Aura", "Moon Aura"],
  },
  Scout: {
    "core-poison-bleed-stance": ["Poison Stance", "Bleed Stance"],
    "core-poison-sac-hemorrhage": ["Poison Sac", "Hemorrhage"],
  },
};
const SKILL_ICON_OVERRIDES = {
  Fighter: {
    "core-warrior-tank-stance": ["fighter/Warrior_stance", "fighter/Tank_stance"],
    "core-rage-bulwark": ["fighter/Rage", "fighter/Bulwark"],
    "blade-rush-shield-rush": ["fighter/Shoulder_rush_warrior", "fighter/Shoulder_rush_tank"],
    "battlecry-challenge": ["fighter/Battlecry", "fighter/Challenge"],
    "battlerage-chain-challenge": ["fighter/Battlecry", "fighter/Challenge"],
    "pressure-provoke": ["fighter/Pressure", "fighter/Provoke"],
    "chain-pull": ["fighter/Chain_pull"],
    "bloodlust-inspiration": ["fighter/Rally_Warrior", "fighter/Rally_Tank"],
    "momentum-mastery": ["fighter/Rage", "fighter/Bulwark"]
  },
  Mage: {
    "core-manifest-weave": ["mage/Overcharge"]
  },
  Mystic: {
    "core-sun-moon-stance": ["mystic/Sun_Stance", "mystic/Moon_stance"],
    "core-bright-star-full-moon": ["mystic/Bright_star", "mystic/Full_moon"],
    "ether": ["mystic/Ether_ally", "mystic/Ether_enemy"],
    "tick-tack": ["mystic/Ether_ally", "mystic/Ether_enemy"],
    "connection": ["mystic/Connection_ally", "mystic/Connection_enemy"],
    "ritual": ["mystic/Connection_ally", "mystic/Connection_enemy"],
    "astral-aura": ["mystic/Sun_aura", "mystic/Moon_aura"],
    "nightmare": ["mystic/Nightmare"],
    "black-hole": ["mystic/Black_hole"],
    "white-hole": ["mystic/Black_hole"]
  },
  Scout: {
    "core-poison-bleed-stance": ["scout/Poison_stance", "scout/Bleed_stance"],
    "core-poison-sac-hemorrhage": ["scout/Poison_sac", "scout/Hemorrhage"]
  }
};
function normalizeSkillIconName(value) {
  return String(value)
    .toLowerCase()
    .replace(/\s+[ivx]+$/i, "")
    .replace(/\s+—.*$/, "")
    .replace(/[^a-z0-9]+/g, "");
}
const NORMALIZED_SKILL_ICONS = new Map(
  SKILL_ICON_ORDER.map((key) => {
    const slash = key.indexOf("/");
    return [
      key.slice(0, slash) + "/" + normalizeSkillIconName(key.slice(slash + 1)),
      key
    ];
  }),
);
function skillIconKeys(item) {
  const override = SKILL_ICON_OVERRIDES[currentClass]?.[item.id];
  if (override) return override.filter((key) => SKILL_ICON_INDEX.has(key.toLowerCase()));
  const classKey = currentClass.toLowerCase();
  const baseName = String(item.name)
    .replace(/\s+[IVX]+$/i, "")
    .replace(/\s+—.*$/, "")
    .trim();
  const keys = baseName
    .split(/\s*\/\s*/)
    .map((part) => NORMALIZED_SKILL_ICONS.get(classKey + "/" + normalizeSkillIconName(part)))
    .filter(Boolean);
  return [...new Set(keys)].slice(0, 2);
}
function skillIconStyle(key) {
  const index = SKILL_ICON_INDEX.get(String(key).toLowerCase());
  if (index == null || !SKILL_ICON_SPRITE) return "";
  const col = index % SKILL_ICON_COLS;
  const row = Math.floor(index / SKILL_ICON_COLS);
  const x = (col / (SKILL_ICON_COLS - 1)) * 100;
  const y = (row / (SKILL_ICON_ROWS - 1)) * 100;
  return "background-image:url('" + SKILL_ICON_SPRITE + "');" +
    "background-size:" + (SKILL_ICON_COLS * 100) + "% " + (SKILL_ICON_ROWS * 100) + "%;" +
    "background-position:" + x + "% " + y + "%;";
}
function skillIconFrame(item, className, mark) {
  const keys = skillIconKeys(item);
  const art = keys.length
    ? '<span class="skill-art' + (keys.length > 1 ? " multi" : "") + '" aria-hidden="true">' +
      keys.map((key) => '<i style="' + skillIconStyle(key) + '"></i>').join("") +
      "</span>"
    : "";
  const fallback = art
    ? ""
    : '<i class="fallback-sigil' + (className === "node-icon" ? " icon-sigil" : "") + '" aria-hidden="true"></i><b>' +
      initials(item.name) + "</b>";
  const stateMark = mark
    ? '<i class="state-mark" aria-hidden="true">' + mark + "</i>"
    : "";
  return '<span class="' + className + (art ? " has-skill-art" : "") + '">' +
    art + fallback + stateMark + "</span>";
}
function dualFormLabels(item) {
  const explicit = DUAL_FORM_LABELS[currentClass]?.[item.id];
  if (explicit?.length) return explicit;
  const parts = String(item.name || "")
    .replace(/\s+[IVX]+$/i, "")
    .split(/\s*\/\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length >= 2 ? parts.slice(0, 2) : [];
}
function formVariantBadge(label, key) {
  return '<span class="form-variant"><i class="form-skill-icon" aria-hidden="true" style="' +
    skillIconStyle(key) + '"></i><b>' + label + "</b></span>";
}
function formatDescriptionWithFormIcons(item) {
  const keys = skillIconKeys(item);
  let html = formatDescription(item.description, item.keywords);
  if (keys.length < 2) return html;

  let iconIndex = 0;
  html = html.replace(/<span class="form-label">/g, () => {
    if (iconIndex >= keys.length) return '<span class="form-label">';
    const key = keys[iconIndex++];
    return '<span class="form-label"><i class="form-skill-icon" aria-hidden="true" style="' +
      skillIconStyle(key) + '"></i>';
  });

  if (iconIndex < keys.length) {
    const labels = dualFormLabels(item);
    const remaining = keys
      .slice(iconIndex)
      .map((key, index) => formVariantBadge(labels[iconIndex + index] || "Variant " + (iconIndex + index + 1), key))
      .join("");
    if (remaining) html = '<div class="dual-form-legend">' + remaining + "</div>" + html;
  }
  return html;
}

const STORAGE_KEY = "sanctammo-skill-tree-v2";
const MAX_SP = 13;
const requestedClass = new URLSearchParams(location.search).get("class");
let currentClass = Object.hasOwn(DATA, requestedClass)
  ? requestedClass
  : "Fighter";
let state = loadState();
let inspected = null;

function emptyState() {
  return Object.fromEntries(Object.keys(DATA).map((name) => [name, []]));
}
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const clean = emptyState();
    for (const name of Object.keys(DATA)) {
      const data = DATA[name],
        valid = new Set(data.nodes.map((n) => n.id)),
        chosen = new Set();
      for (const id of Array.isArray(saved?.[name]) ? saved[name] : []) {
        const node = data.nodes.find((n) => n.id === id);
        if (!valid.has(id) || chosen.size >= data.maxSp) continue;
        if ((node.requires || []).some((req) => !chosen.has(req))) continue;
        if ((node.exclusiveWith || []).some((other) => chosen.has(other)))
          continue;
        if (chosen.size < (data.thresholds[String(node.tier)] || 0)) continue;
        chosen.add(id);
      }
      clean[name] = [...chosen];
    }
    return clean;
  } catch {
    return emptyState();
  }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function classData() {
  return DATA[currentClass];
}
function learnedSet() {
  return new Set(state[currentClass]);
}
function learnedCount() {
  return state[currentClass].length;
}
function maxSp() {
  return classData().maxSp || MAX_SP;
}
function threshold(tier) {
  return classData().thresholds[String(tier)] || 0;
}
function byId(id) {
  return classData().nodes.find((node) => node.id === id);
}
function tierUnlocked(tier) {
  return learnedCount() >= threshold(tier);
}
function toRoman(n) {
  return ["", "I", "II", "III", "IV"][n] || n;
}
function initials(name) {
  return String(name)
    .split("/")[0]
    .replace(/\s+[IV]+$/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
}
function iconHue(name) {
  return (
    [...String(name)].reduce((total, char) => total + char.charCodeAt(0), 0) %
    360
  );
}

function nodeState(node, set = learnedSet()) {
  if (set.has(node.id))
    return { code: "learned", label: "Learned", reason: "Learned" };
  if (!tierUnlocked(node.tier)) {
    const more = threshold(node.tier) - learnedCount();
    return {
      code: "locked",
      label: "Locked",
      reason: `Locked — Spend ${more} more SP to unlock Tier ${toRoman(node.tier)}`,
    };
  }
  const missing = (node.requires || []).filter((id) => !set.has(id));
  if (missing.length)
    return {
      code: "locked",
      label: "Locked",
      reason: `Locked — Requires ${missing.map((id) => byId(id)?.name || id).join(" + ")}`,
    };
  const excluded = (node.exclusiveWith || []).filter((id) => set.has(id));
  if (excluded.length)
    return {
      code: "locked",
      label: "Locked",
      reason: `Locked — Cannot be learned with ${excluded.map((id) => byId(id)?.name || id).join(", ")}`,
    };
  if (learnedCount() >= maxSp())
    return {
      code: "locked",
      label: "Locked",
      reason: `Locked — Maximum ${maxSp()} Skill Points reached`,
    };
  return {
    code: "available",
    label: "Available",
    reason: "Available to learn",
  };
}
function showNotice(text, type = "") {
  const n = document.getElementById("notice");
  n.textContent = text;
  n.className = `notice ${type}`.trim();
}

function showConfirm({ title, message, confirmLabel, onConfirm }) {
  const dialog = document.getElementById("confirmDialog");
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmMessage").textContent = message;
  const confirm = document.getElementById("confirmAccept");
  confirm.textContent = confirmLabel;
  confirm.onclick = () => {
    dialog.close();
    onConfirm();
  };
  document.getElementById("confirmCancel").onclick = () => dialog.close();
  dialog.showModal();
}
function commitLearn(node) {
  const status = nodeState(node);
  if (status.code !== "available") {
    showNotice(status.reason, "error");
    return;
  }
  state[currentClass] = [...state[currentClass], node.id];
  saveState();
  inspected = { type: "node", id: node.id };
  showNotice(`Learned ${node.name}.`, "good");
  renderAll();
}
function learnNode(node) {
  if ((node.exclusiveWith || []).length) {
    const alternative = (node.exclusiveWith || [])
      .map((id) => byId(id)?.name || id)
      .join(", ");
    showConfirm({
      title: `Learn ${node.name}?`,
      message: `This choice locks ${alternative} until you reset the entire Skill Tree.`,
      confirmLabel: "Confirm choice",
      onConfirm: () => commitLearn(node),
    });
  } else commitLearn(node);
}
function resetTree() {
  showConfirm({
    title: `Reset ${currentClass} Skill Tree?`,
    message:
      "All learned nodes will be cleared and all 13 Primary Skill Points will be returned.",
    confirmLabel: "Reset Skill Tree",
    onConfirm: () => {
      state[currentClass] = [];
      saveState();
      inspected = null;
      showNotice(`${currentClass} Skill Tree reset.`, "good");
      renderAll();
    },
  });
}

function renderTabs() {
  const root = document.getElementById("classTabs");
  root.innerHTML = "";
  for (const name of Object.keys(DATA)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `class-tab${name === currentClass ? " active" : ""}`;
    button.innerHTML =
      '<img class="class-tab-icon" src="' + CLASS_ICON_SOURCES[name] + '" alt="" aria-hidden="true"><span>' +
      name +
      "</span>";
    button.setAttribute("aria-pressed", String(name === currentClass));
    button.onclick = () => {
      currentClass = name;
      inspected = null;
      showNotice("");
      renderAll();
    };
    root.append(button);
  }
}
function renderBuildStatus() {
  const count = learnedCount();
  document.body.dataset.class = currentClass.toLowerCase();
  document.getElementById("currentClass").textContent = currentClass;
  document.getElementById("role").textContent = classData().role;
  document.getElementById("spent").textContent = count;
  document.getElementById("remaining").textContent =
    `${maxSp() - count} SP remaining`;
  document.getElementById("progressFill").style.width =
    `${(count / maxSp()) * 100}%`;
  const milestones = [1, 2, 3, 4]
    .map((tier) => ({ value: threshold(tier), label: `Tier ${toRoman(tier)}` }))
    .concat({ value: maxSp(), label: "Cap" });
  document.getElementById("milestones").innerHTML = milestones
    .map(
      (x) =>
        `<span class="milestone ${count >= x.value ? "reached" : ""}" style="left:${(x.value / maxSp()) * 100}%"><i></i><em>${x.label}</em><b>${x.value}</b></span>`,
    )
    .join("");
}
function renderCore() {
  const root = document.getElementById("grantedGrid");
  root.innerHTML = "";
  for (const core of classData().core) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `core-card${inspected?.type === "core" && inspected.id === core.id ? " inspected" : ""}`;
    button.setAttribute(
      "aria-label",
      `${core.name}. Granted Core. Open details.`,
    );
    button.style.setProperty("--icon-hue", iconHue(core.name));
    button.innerHTML = `${skillIconFrame(core, "core-icon")}<span><strong>${core.name}</strong><small>Granted Core</small></span>`;
    button.onclick = () => inspect("core", core.id);
    root.append(button);
  }
}
function createNode(node) {
  const status = nodeState(node),
    button = document.createElement("button");
  button.type = "button";
  button.className = `skill-node state-${status.code}${inspected?.type === "node" && inspected.id === node.id ? " inspected" : ""}`;
  button.dataset.id = node.id;
  button.dataset.tier = node.tier;
  button.dataset.order = node.order;
  button.style.setProperty("--icon-hue", iconHue(node.name));
  button.title = status.reason;
  button.setAttribute(
    "aria-label",
    `${node.name}. ${status.reason}. Open details.`,
  );
  const mark =
    status.code === "learned" ? "✓" : status.code === "locked" ? "🔒" : "";
  button.innerHTML = `${skillIconFrame(node, "node-icon", mark)}<strong>${node.name}</strong>`;
  button.onclick = () => inspect("node", node.id);
  button.ondblclick = (event) => {
    event.preventDefault();
    if (nodeState(node).code === "available") learnNode(node);
  };
  return button;
}

function buildFamilyLayout() {
  const nodes = classData().nodes;
  const parent = new Map(nodes.map((node) => [node.id, node.id]));
  const find = (id) => {
    let root = id;
    while (parent.get(root) !== root) root = parent.get(root);
    while (parent.get(id) !== id) {
      const next = parent.get(id);
      parent.set(id, root);
      id = next;
    }
    return root;
  };
  const join = (a, b) => {
    const rootA = find(a),
      rootB = find(b);
    if (rootA !== rootB) parent.set(rootB, rootA);
  };

  for (const node of nodes)
    for (const requirement of node.requires || []) join(node.id, requirement);

  const families = new Map();
  nodes.forEach((node, canonicalIndex) => {
    const root = find(node.id);
    if (!families.has(root)) families.set(root, { nodes: [], canonicalIndex });
    families.get(root).nodes.push(node);
  });

  const orderedFamilies = [...families.values()].sort((a, b) => {
    const firstA = Math.min(
      ...a.nodes.map((node) => node.tier * 100 + node.order),
    );
    const firstB = Math.min(
      ...b.nodes.map((node) => node.tier * 100 + node.order),
    );
    return firstA - firstB || a.canonicalIndex - b.canonicalIndex;
  });
  const columns = new Map();
  let nextColumn = 1;
  orderedFamilies.forEach((family, familyIndex) => {
    const width = Math.max(
      ...[1, 2, 3, 4].map(
        (tier) => family.nodes.filter((node) => node.tier === tier).length,
      ),
    );
    for (let tier = 1; tier <= 4; tier++) {
      family.nodes
        .filter((node) => node.tier === tier)
        .sort((a, b) => a.order - b.order)
        .forEach((node, index) => columns.set(node.id, nextColumn + index));
    }
    const roots = family.nodes
      .filter((node) => !(node.requires || []).length)
      .sort((a, b) => a.tier - b.tier || a.order - b.order);
    family.startColumn = nextColumn;
    family.width = width;
    family.number = familyIndex + 1;
    family.label = roots
      .map((node) => node.name.replace(/\s+[IV]+$/, ""))
      .filter((name, index, list) => list.indexOf(name) === index)
      .join(" / ");
    nextColumn += width;
  });
  return { columns, count: nextColumn - 1, families: orderedFamilies };
}

function renderTree() {
  const root = document.getElementById("tree");
  root.innerHTML = "";
  const board = document.createElement("div");
  board.className = "vertical-tree";
  const familyLayout = buildFamilyLayout();
  board.style.setProperty("--family-columns", familyLayout.count);
  board.style.minWidth = `${Math.max(980, familyLayout.count * 127 + 32)}px`;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("relations");
  svg.setAttribute("aria-hidden", "true");
  board.append(svg);
  const familyHeaders = document.createElement("div");
  familyHeaders.className = "family-headers";
  for (const family of familyLayout.families) {
    const header = document.createElement("span");
    header.style.gridColumn = `${family.startColumn} / span ${family.width}`;
    header.innerHTML = `<b>${family.number}</b><em>${family.label}</em>`;
    familyHeaders.append(header);
  }
  board.append(familyHeaders);
  for (let tier = 1; tier <= 4; tier++) {
    const unlocked = tierUnlocked(tier),
      section = document.createElement("section");
    section.className = `tier-section tier-${tier}${unlocked ? " unlocked" : " locked"}`;
    const need = Math.max(0, threshold(tier) - learnedCount());
    section.innerHTML = `<header><div><span>Tier ${toRoman(tier)}</span>${unlocked ? "" : `<strong>LOCKED</strong>`}</div><small>${unlocked ? "OPEN" : `Spend ${need} more SP to unlock`} · ${classData().tierCounts[String(tier)]} investments</small></header>`;
    const nodes = document.createElement("div");
    nodes.className = "tier-nodes";
    classData()
      .nodes.filter((n) => n.tier === tier)
      .sort((a, b) => a.order - b.order)
      .forEach((n) => {
        const node = createNode(n);
        node.style.gridColumn = familyLayout.columns.get(n.id);
        nodes.append(node);
      });
    section.append(nodes);
    board.append(section);
  }
  root.append(board);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => drawRelations(board)),
  );
}
function drawRelations(board) {
  const svg = board.querySelector(".relations");
  if (!svg) return;
  const box = board.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${board.scrollWidth} ${board.scrollHeight}`);
  svg.setAttribute("width", board.scrollWidth);
  svg.setAttribute("height", board.scrollHeight);
  svg.innerHTML = `<defs>
    <marker id="arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z"></path></marker>
    <marker id="arrow-active" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z"></path></marker>
  </defs>`;
  const point = (el, edge) => {
    const r = el.getBoundingClientRect();
    return [
      r.left - box.left + r.width / 2,
      (edge === "bottom" ? r.bottom : r.top) - box.top,
    ];
  };
  for (const target of classData().nodes)
    for (const sourceId of target.requires || []) {
      const a = board.querySelector(`[data-id="${sourceId}"]`),
        b = board.querySelector(`[data-id="${target.id}"]`);
      if (!a || !b) continue;
      const start = point(a, "bottom"),
        end = point(b, "top"),
        mid = (start[1] + end[1]) / 2,
        route = `M${start[0]} ${start[1]} V${mid} H${end[0]} V${end[1]}`,
        outline = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        ),
        path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      outline.setAttribute("d", route);
      outline.classList.add("relation-outline");
      svg.append(outline);
      path.setAttribute("d", route);
      path.classList.add("relation-path");
      if (learnedSet().has(sourceId)) path.classList.add("active");
      path.setAttribute(
        "marker-end",
        learnedSet().has(sourceId) ? "url(#arrow-active)" : "url(#arrow)",
      );
      svg.append(path);
    }

  const renderedChoices = new Set();
  for (const node of classData().nodes)
    for (const otherId of node.exclusiveWith || []) {
      const pair = [node.id, otherId].sort();
      const key = pair.join("|");
      if (renderedChoices.has(key)) continue;
      renderedChoices.add(key);
      const a = board.querySelector(`[data-id="${pair[0]}"]`),
        b = board.querySelector(`[data-id="${pair[1]}"]`);
      if (!a || !b) continue;
      const aRect = a.getBoundingClientRect(),
        bRect = b.getBoundingClientRect(),
        y = Math.min(aRect.top, bRect.top) - box.top - 13,
        x1 = aRect.left - box.left + aRect.width / 2,
        x2 = bRect.left - box.left + bRect.width / 2,
        middle = (x1 + x2) / 2,
        path = document.createElementNS("http://www.w3.org/2000/svg", "path"),
        label = document.createElementNS("http://www.w3.org/2000/svg", "g"),
        learned = learnedSet(),
        choiceMade = learned.has(pair[0]) || learned.has(pair[1]);
      path.setAttribute("d", `M${x1} ${y + 13} V${y} H${x2} V${y + 13}`);
      path.classList.add("choice-path");
      if (choiceMade) path.classList.add("selected");
      svg.append(path);
      label.classList.add("choice-label");
      label.innerHTML = `<rect x="${middle - 57}" y="${y - 12}" width="114" height="24" rx="12"></rect><text x="${middle}" y="${y + 4}" text-anchor="middle">${choiceMade ? "CHOICE MADE" : "CHOOSE ONE"}</text>`;
      svg.append(label);
    }
}
function inspect(type, id) {
  inspected = { type, id };
  renderCore();
  document
    .querySelectorAll(".skill-node.inspected")
    .forEach((x) => x.classList.remove("inspected"));
  if (type === "node")
    document.querySelector(`[data-id="${id}"]`)?.classList.add("inspected");
  renderInspector();
  document.getElementById("inspector").classList.add("open");
}
function severingProgress(item) {
  const ids = [
    "severing-strike",
    "severing-strike-stage-ii",
    "severing-strike-stage-iii",
  ];
  if (!ids.includes(item.id)) return "";
  const learned = learnedSet();
  return `<div class="severing-progress" aria-label="Severing progression">${ids.map((id, i) => `${i ? "→" : ""}<span class="${learned.has(id) ? "learned" : ""}${item.id === id ? " current" : ""}"><b>${i + 1}/3</b><small>${learned.has(id) ? "Learned" : "Not learned"}</small></span>`).join("")}</div>`;
}
function technicalStrip(item) {
  const allowed = [
      "Cooldown",
      "Cast Time",
      "Range",
      "Resource Cost",
      "Charges",
    ],
    fields = item.fields || {},
    rows = allowed
      .filter((key) => fields[key] && !/^(none|n\/a)$/i.test(fields[key]))
      .map(
        (key) =>
          `<div><dt>${key}</dt><dd>${formatTaggedText(fields[key], item.keywords)}</dd></div>`,
      )
      .join("");
  return rows ? `<dl class="technical-strip">${rows}</dl>` : "";
}
function synthesisPreview(item) {
  if (currentClass !== "Mage" || !item.id?.startsWith("elemental")) return "";
  const forms = classData().appendix || [];
  const visible = item.id === "elemental-weaver" ? forms.slice(0, 3) : forms;
  return `<div class="synthesis-preview"><strong>Synthesis</strong>${visible
    .map((form) => {
      const [result, formula = ""] = form.name
        .split("—")
        .map((part) => part.trim());
      return `<div><span>${formula}</span><i>→</i><b>${result}</b></div>`;
    })
    .join("")}</div>`;
}
function detailMarkup(item, isCore, status) {
  const prereq =
    !isCore && (item.requiresNames || []).length
      ? `<p class="prerequisite-note"><b>Requires:</b> ${item.requiresNames.join(" + ")}</p>`
      : "";
  const exclusive =
    !isCore && (item.exclusiveNames || []).length
      ? `<p class="exclusive-note"><b>!</b><span>Learning this prevents <strong>${item.exclusiveNames.join(", ")}</strong> until you reset the whole tree.</span></p>`
      : "";
  return `<div class="detail-hero" style="--icon-hue:${iconHue(item.name)}">${skillIconFrame(item, "detail-icon")}<div><div class="detail-meta"><span>${isCore ? "Granted Core" : `Tier ${toRoman(item.tier)}`}</span><span class="status-${status.code}">${status.label}</span></div><h2>${item.name}</h2></div></div>${prereq}<div class="skill-description">${formatDescriptionWithFormIcons(item)}</div>${synthesisPreview(item)}${exclusive}${severingProgress(item)}${technicalStrip(item)}`;
}
function renderInspector() {
  hideKeywordTooltip();
  const root = document.getElementById("inspectorContent"),
    panel = document.getElementById("inspector");
  if (!inspected) {
    panel.classList.remove("open");
    root.innerHTML =
      '<div class="inspector-empty"><span>✦</span><h2>Inspect a skill</h2><p>Select a node to view its description, requirements and current state.</p></div>';
    return;
  }
  if (inspected.type === "core") {
    const item = classData().core.find((x) => x.id === inspected.id);
    if (!item) {
      inspected = null;
      return renderInspector();
    }
    root.innerHTML = detailMarkup(item, true, {
      code: "granted",
      label: "Always available",
    });
    return;
  }
  const item = byId(inspected.id);
  if (!item) {
    inspected = null;
    return renderInspector();
  }
  const status = nodeState(item);
  const reason =
    status.code === "locked"
      ? `<p class="action-reason">${status.reason}</p>`
      : "";
  const button =
    status.code === "available"
      ? '<button class="primary-action" id="nodeAction" type="button">Learn</button>'
      : `<button class="primary-action" type="button" disabled>${status.label}</button>`;
  root.innerHTML =
    detailMarkup(item, false, status) +
    `<div class="inspector-actions">${reason}${button}</div>`;
  document
    .getElementById("nodeAction")
    ?.addEventListener("click", () => learnNode(item));
}
function renderAppendix() {
  const root = document.getElementById("appendixHolder"),
    items = classData().appendix || [];
  root.innerHTML = "";
  if (!items.length) return;
  const details = document.createElement("details");
  details.className = "appendix";
  details.innerHTML = `<summary>Synthesis forms <span>${items.length}</span></summary><div class="appendix-grid">${items.map((x) => `<article><strong>${x.name}</strong>${formatDescription(x.text, x.keywords)}</article>`).join("")}</div>`;
  root.append(details);
}
function renderAll() {
  renderTabs();
  renderBuildStatus();
  renderCore();
  renderTree();
  renderAppendix();
  renderInspector();
}
document.getElementById("resetClass").onclick = resetTree;
document.getElementById("inspectorClose").onclick = () => {
  inspected = null;
  renderInspector();
  renderCore();
  document
    .querySelectorAll(".skill-node.inspected")
    .forEach((x) => x.classList.remove("inspected"));
};
document.getElementById("confirmDialog").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) e.currentTarget.close();
});
window.addEventListener("resize", () => {
  const board = document.querySelector(".vertical-tree");
  if (board) requestAnimationFrame(() => drawRelations(board));
});
renderAll();
