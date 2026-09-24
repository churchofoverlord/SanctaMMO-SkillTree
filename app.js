const DATA = window.SKILL_TREE_DATA;
const ICONS = window.SKILL_ICON_CATALOG;
const ASSET_VERSION = "hud-2";
const asset = (src) => `${src}?v=${ASSET_VERSION}`;

function iconEntry(key) {
  return key ? ICONS.icons[key] : null;
}
function skillIconStyle(key) {
  const entry = iconEntry(key);
  if (!entry) return "";
  if (entry.src)
    return `background-image:url('${asset(entry.src)}');background-size:cover;background-position:center;`;
  const { src, columns, rows } = ICONS.sprite;
  const x = ((entry.sprite % columns) / (columns - 1)) * 100;
  const y = (Math.floor(entry.sprite / columns) / (rows - 1)) * 100;
  return `background-image:url('${asset(src)}');background-size:${columns * 100}% ${rows * 100}%;background-position:${x}% ${y}%;`;
}
function skillIconFrame(item, className, mark) {
  const keys = (item.iconKeys || []).filter(iconEntry);
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
    ? '<i class="slot-chip" aria-hidden="true">' + mark + "</i>"
    : "";
  return '<span class="' + className + (art ? " has-skill-art" : "") + '">' +
    art + fallback + stateMark + "</span>";
}

const STORAGE_KEY = "sanctammo-skill-tree-v2";
const MAX_SP = 13;
const requestedClass = new URLSearchParams(location.search).get("class");
let currentClass = Object.hasOwn(DATA, requestedClass)
  ? requestedClass
  : "Fighter";
let state = loadState();
let tooltipTarget = null;
let justLearned = null;

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
      lock: "tier",
      reason: `Locked — Spend ${more} more SP to unlock Tier ${toRoman(node.tier)}`,
    };
  }
  const missing = (node.requires || []).filter((id) => !set.has(id));
  if (missing.length)
    return {
      code: "locked",
      label: "Locked",
      lock: "requires",
      reason: `Locked — Requires ${missing.map((id) => byId(id)?.name || id).join(" + ")}`,
    };
  const excluded = (node.exclusiveWith || []).filter((id) => set.has(id));
  if (excluded.length)
    return {
      code: "locked",
      label: "Locked",
      lock: "exclusive",
      reason: `Locked — Cannot be learned with ${excluded.map((id) => byId(id)?.name || id).join(", ")}`,
    };
  if (learnedCount() >= maxSp())
    return {
      code: "locked",
      label: "Locked",
      lock: "cap",
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
  justLearned = node.id;
  showNotice(`Learned ${node.name}.`, "good");
  renderAll();
  justLearned = null;
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
    button.innerHTML = `<span>${name}</span>`;
    button.setAttribute("aria-pressed", String(name === currentClass));
    button.onclick = () => {
      currentClass = name;
      showNotice("");
      renderAll();
    };
    root.append(button);
  }
}
function renderBuildStatus() {
  const count = learnedCount();
  document.body.dataset.class = currentClass.toLowerCase();
  const emblem = asset(ICONS.classEmblems[currentClass]);
  const mark = document.getElementById("brandClassMark");
  if (mark.querySelector("img")?.getAttribute("src") !== emblem)
    mark.innerHTML = `<img src="${emblem}" alt="" />`;
  mark.title = `${currentClass} class emblem`;
  document.getElementById("currentClass").textContent = currentClass;
  document.getElementById("role").textContent = classData().role;
  document.getElementById("spent").textContent = count;
  document.getElementById("remaining").textContent =
    `${maxSp() - count} SP remaining`;
  document.getElementById("progressFill").style.width =
    `${(count / maxSp()) * 100}%`;
  const milestones = [1, 2, 3, 4]
    .map((tier) => ({ value: threshold(tier), label: `<span>Tier </span>${toRoman(tier)}` }))
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
    button.className = "core-card";
    button.dataset.tip = `core:${core.id}`;
    button.setAttribute("aria-label", `${core.name}. Granted Core.`);
    button.style.setProperty("--icon-hue", iconHue(core.name));
    button.innerHTML = `${skillIconFrame(core, "core-icon")}<span><strong>${core.name}</strong><small>Granted Core</small></span>`;
    button.onclick = (event) => {
      if (event.pointerType && event.pointerType !== "mouse") showTooltip(button);
    };
    root.append(button);
  }
}
function renderUniversalActions() {
  const section = document.getElementById("universalActionSection"),
    root = document.getElementById("universalActionGrid"),
    actions = classData().universalActions || [];
  section.hidden = !actions.length;
  root.innerHTML = "";
  for (const action of actions) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "core-card";
    button.dataset.tip = `action:${action.id}`;
    button.setAttribute("aria-label", `${action.name}. Universal Action.`);
    button.style.setProperty("--icon-hue", iconHue(action.name));
    button.innerHTML = `${skillIconFrame(action, "core-icon")}<span><strong>${action.name}</strong><small>Universal Action</small></span>`;
    button.onclick = (event) => {
      if (event.pointerType && event.pointerType !== "mouse") showTooltip(button);
    };
    root.append(button);
  }
}
const LOCK_GLYPH =
  '<svg viewBox="0 0 10 12" width="8" height="10"><path d="M2.6 5.2V3.6a2.4 2.4 0 0 1 4.8 0v1.6" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="1" y="5.2" width="8" height="6.3" rx="1.2" fill="currentColor"/></svg>';
function createNode(node) {
  const status = nodeState(node),
    button = document.createElement("button");
  button.type = "button";
  button.className = `skill-node state-${status.code}${status.lock ? ` lock-${status.lock}` : ""}${justLearned === node.id ? " just-learned" : ""}`;
  button.dataset.id = node.id;
  button.dataset.tip = `node:${node.id}`;
  button.dataset.tier = node.tier;
  button.dataset.order = node.order;
  button.style.setProperty("--icon-hue", iconHue(node.name));
  button.setAttribute("aria-label", `${node.name}. ${status.reason}.`);
  const mark =
    status.code === "learned"
      ? "✓"
      : status.code === "locked"
        ? LOCK_GLYPH
        : "1 SP";
  button.innerHTML = `${skillIconFrame(node, "node-icon", mark)}<strong>${node.name}</strong>`;
  button.onclick = (event) => {
    // On touch there is no hover: the first tap shows the tooltip.
    if (event.pointerType && event.pointerType !== "mouse" && tooltipTarget !== button) {
      showTooltip(button);
      return;
    }
    const current = nodeState(node);
    if (current.code === "available") learnNode(node);
    else if (current.code === "locked") showNotice(current.reason, "error");
  };
  return button;
}

function renderTree() {
  const root = document.getElementById("tree");
  root.innerHTML = "";
  const board = document.createElement("div");
  board.className = "vertical-tree";
  const columns = Math.max(...classData().nodes.map((n) => n.column));
  board.style.setProperty("--family-columns", columns);
  board.style.minWidth = `${columns * 104 + 140}px`;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("relations");
  svg.setAttribute("aria-hidden", "true");
  board.append(svg);
  for (let tier = 1; tier <= 4; tier++) {
    const unlocked = tierUnlocked(tier),
      section = document.createElement("section");
    section.className = `tier-section tier-${tier}${unlocked ? " unlocked" : " locked"}`;
    const need = Math.max(0, threshold(tier) - learnedCount());
    section.innerHTML = `<header><span class="tier-kicker">Tier</span><span class="tier-numeral">${toRoman(tier)}</span><strong class="tier-status ${unlocked ? "open" : "sealed"}">${unlocked ? "Open" : "Locked"}</strong>${unlocked ? "" : `<small class="tier-need">Spend ${need} more SP</small>`}<small class="tier-count">${classData().tierCounts[String(tier)]} investments</small></header>`;
    const nodes = document.createElement("div");
    nodes.className = "tier-nodes";
    classData()
      .nodes.filter((n) => n.tier === tier)
      .sort((a, b) => a.order - b.order)
      .forEach((n) => {
        const node = createNode(n);
        node.style.gridColumn = n.column;
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
const TOOLTIP_STATS = ["Cooldown", "Cast Time", "Range", "Resource Cost", "Charges"];
function formStats(form) {
  const fields = form.fields || {};
  const rows = TOOLTIP_STATS.filter(
    (key) => fields[key] && !/^(none|n\/a)$/i.test(fields[key]),
  )
    .map(
      (key) =>
        `<div><dt>${key}</dt><dd>${formatTaggedText(fields[key], form.keywords || [])}</dd></div>`,
    )
    .join("");
  return rows ? `<dl class="tt-stats">${rows}</dl>` : "";
}
function formMarkup(form, showName) {
  const icon = iconEntry(form.presentation?.iconKey)
    ? `<i class="form-skill-icon" aria-hidden="true" style="${skillIconStyle(form.presentation.iconKey)}"></i>`
    : "";
  const name = showName ? `<div class="tt-form-name">${icon}<span>${form.name}</span></div>` : "";
  return `<section class="tt-form">${name}<div class="skill-description">${formatDescription(form.description, form.keywords || [])}</div>${formStats(form)}</section>`;
}
function synthesisPreview(item) {
  if (currentClass !== "Mage" || !item.id?.startsWith("elemental")) return "";
  const forms = classData().appendix || [];
  if (!forms.length) return "";
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
function tooltipMarkup(item, kind) {
  const isNode = kind === "node";
  const status = isNode
    ? nodeState(item)
    : kind === "core"
      ? { code: "granted", label: "Always available" }
      : { code: "granted", label: "Universal Action" };
  const excluded = status.lock === "exclusive";
  const stateCode = excluded ? "excluded" : status.code;
  const stateLabel = excluded ? "Excluded" : status.label;
  const identity = isNode ? `Tier ${toRoman(item.tier)}` : kind === "core" ? "Granted Core" : "Universal Action";
  const prereq =
    isNode && (item.requiresNames || []).length
      ? `<p class="prerequisite-note"><b>Requires:</b> ${item.requiresNames.join(" + ")}</p>`
      : "";
  const exclusive =
    isNode && (item.exclusiveNames || []).length
      ? `<p class="exclusive-note"><b>!</b><span>Learning this prevents <strong>${item.exclusiveNames.join(", ")}</strong> until you reset the whole tree.</span></p>`
      : "";
  const forms = item.forms || [];
  const foot = !isNode
    ? kind === "core"
      ? "Granted · 0 SP"
      : "Not a Skill Tree investment"
    : status.code === "available"
      ? "Click to learn · 1 SP"
      : status.code === "learned"
        ? "Learned"
        : status.reason.replace(/^Locked — /, "");
  return `<div class="tt-head">${skillIconFrame(item, "detail-icon")}<div><div class="tt-meta"><span>${identity}</span><span class="status-${stateCode}">${stateLabel}</span></div><h2>${item.name}</h2></div></div>${prereq}<div class="tt-forms">${forms.map((form) => formMarkup(form, forms.length > 1)).join("")}</div>${synthesisPreview(item)}${exclusive}${severingProgress(item)}<div class="tt-foot ${stateCode}">${foot}</div>`;
}
function tooltipItem(tip) {
  const [kind, id] = tip.split(/:(.*)/s);
  const data = classData();
  const item =
    kind === "node"
      ? byId(id)
      : (kind === "core" ? data.core : data.universalActions || []).find((x) => x.id === id);
  return item ? { kind, item } : null;
}
// Beside the slot (right, else left); below or above it on narrow screens.
function positionTooltip(tooltip, anchor) {
  const rect = (anchor.querySelector(".node-icon, .core-icon") || anchor).getBoundingClientRect();
  const gap = 14,
    margin = 8,
    width = tooltip.offsetWidth,
    height = tooltip.offsetHeight;
  let left, top;
  if (rect.right + gap + width <= innerWidth - margin) {
    left = rect.right + gap;
    top = rect.top;
  } else if (rect.left - gap - width >= margin) {
    left = rect.left - gap - width;
    top = rect.top;
  } else {
    left = rect.left + rect.width / 2 - width / 2;
    top = rect.bottom + gap + 8;
    if (top + height > innerHeight - margin) top = rect.top - gap - height;
  }
  left = Math.max(margin, Math.min(left, innerWidth - width - margin));
  top = Math.max(margin, Math.min(top, innerHeight - height - margin));
  tooltip.style.left = `${Math.round(left)}px`;
  tooltip.style.top = `${Math.round(top)}px`;
}
function showTooltip(anchor) {
  const found = tooltipItem(anchor.dataset.tip);
  if (!found) return;
  const tooltip = document.getElementById("skillTooltip");
  hideKeywordTooltip();
  tooltipTarget = anchor;
  tooltip.innerHTML = tooltipMarkup(found.item, found.kind);
  tooltip.classList.toggle("wide", (found.item.forms || []).length > 3);
  tooltip.classList.add("visible");
  tooltip.setAttribute("aria-hidden", "false");
  positionTooltip(tooltip, anchor);
}
function hideTooltip() {
  const tooltip = document.getElementById("skillTooltip");
  tooltipTarget = null;
  tooltip.classList.remove("visible");
  tooltip.setAttribute("aria-hidden", "true");
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
const NODE_STATE_LEGEND = [
  { label: "Available", note: "Gold edge · 1 SP chip", classes: "state-available", chip: "1 SP" },
  { label: "Hover", note: "Light gold edge", classes: "state-available is-hover", chip: "1 SP" },
  { label: "Learned", note: "Bright gold + halo · ✓", classes: "state-learned", chip: "✓" },
  { label: "Locked", note: "Tier or prerequisite missing", classes: "state-locked lock-tier", chip: LOCK_GLYPH },
  { label: "Excluded", note: "Red edge · other choice learned", classes: "state-locked lock-exclusive", chip: LOCK_GLYPH },
];
function renderStateLegend() {
  const sample = classData().nodes.find((n) => n.tier === 1) || classData().nodes[0];
  document.getElementById("stateLegend").innerHTML = NODE_STATE_LEGEND.map(
    (state) =>
      `<div class="state-sample"><div class="sample-slot skill-node ${state.classes}" aria-hidden="true">${skillIconFrame(sample, "node-icon", state.chip)}</div><strong>${state.label}</strong><small>${state.note}</small></div>`,
  ).join("");
}
function renderAll() {
  renderTabs();
  renderBuildStatus();
  renderCore();
  renderUniversalActions();
  renderTree();
  renderAppendix();
  renderStateLegend();
  refreshTooltip();
}
// After a re-render, keep the tooltip on the slot now under the pointer.
function refreshTooltip() {
  const tip = tooltipTarget?.dataset.tip;
  if (!tip) return;
  const anchor = document.querySelector(`[data-tip="${CSS.escape(tip)}"]`);
  if (anchor) showTooltip(anchor);
  else hideTooltip();
}
document.getElementById("resetClass").onclick = resetTree;
document.addEventListener("pointerover", (event) => {
  if (event.pointerType !== "mouse") return;
  const anchor = event.target.closest("[data-tip]");
  if (anchor && anchor !== tooltipTarget) showTooltip(anchor);
});
document.addEventListener("pointerout", (event) => {
  if (event.pointerType !== "mouse" || !tooltipTarget) return;
  if (!tooltipTarget.contains(event.relatedTarget)) hideTooltip();
});
document.addEventListener("focusin", (event) => {
  const anchor = event.target.closest?.("[data-tip]");
  if (anchor?.matches(":focus-visible")) showTooltip(anchor);
});
document.addEventListener("focusout", (event) => {
  if (event.target === tooltipTarget && !tooltipTarget.matches(":hover")) hideTooltip();
});
document.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" || !tooltipTarget) return;
  if (!event.target.closest("[data-tip], #skillTooltip")) hideTooltip();
});
window.addEventListener(
  "scroll",
  (event) => {
    if (tooltipTarget && event.target.id !== "skillTooltip") hideTooltip();
  },
  { passive: true, capture: true },
);
document.getElementById("confirmDialog").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) e.currentTarget.close();
});
window.addEventListener("resize", () => {
  const board = document.querySelector(".vertical-tree");
  if (board) requestAnimationFrame(() => drawRelations(board));
});
renderAll();
