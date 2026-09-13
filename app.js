const DATA = window.SKILL_TREE_DATA;
const STORAGE_KEY = 'sanctammo-skill-tree-v2';
const MAX_SP = 13;
const requestedClass = new URLSearchParams(location.search).get('class');
let currentClass = Object.hasOwn(DATA, requestedClass) ? requestedClass : 'Fighter';
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
        if ((node.exclusiveWith || []).some((other) => chosen.has(other))) continue;
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
  return ['', 'I', 'II', 'III', 'IV'][n] || n;
}
function initials(name) {
  return String(name)
    .split('/')[0]
    .replace(/\s+[IV]+$/, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0])
    .join('')
    .toUpperCase();
}

function nodeState(node, set = learnedSet()) {
  if (set.has(node.id)) return { code: 'learned', label: 'Learned', reason: 'Learned' };
  if (!tierUnlocked(node.tier)) {
    const more = threshold(node.tier) - learnedCount();
    return {
      code: 'locked',
      label: 'Locked',
      reason: `Locked — Spend ${more} more SP to unlock Tier ${toRoman(node.tier)}`,
    };
  }
  const missing = (node.requires || []).filter((id) => !set.has(id));
  if (missing.length)
    return {
      code: 'locked',
      label: 'Locked',
      reason: `Locked — Requires ${missing.map((id) => byId(id)?.name || id).join(' + ')}`,
    };
  const excluded = (node.exclusiveWith || []).filter((id) => set.has(id));
  if (excluded.length)
    return {
      code: 'locked',
      label: 'Locked',
      reason: `Locked — Cannot be learned with ${excluded.map((id) => byId(id)?.name || id).join(', ')}`,
    };
  if (learnedCount() >= maxSp())
    return {
      code: 'locked',
      label: 'Locked',
      reason: `Locked — Maximum ${maxSp()} Skill Points reached`,
    };
  return { code: 'available', label: 'Available', reason: 'Available to learn' };
}
function showNotice(text, type = '') {
  const n = document.getElementById('notice');
  n.textContent = text;
  n.className = `notice ${type}`.trim();
}

function showConfirm({ title, message, confirmLabel, onConfirm }) {
  const dialog = document.getElementById('confirmDialog');
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMessage').textContent = message;
  const confirm = document.getElementById('confirmAccept');
  confirm.textContent = confirmLabel;
  confirm.onclick = () => {
    dialog.close();
    onConfirm();
  };
  document.getElementById('confirmCancel').onclick = () => dialog.close();
  dialog.showModal();
}
function commitLearn(node) {
  const status = nodeState(node);
  if (status.code !== 'available') {
    showNotice(status.reason, 'error');
    return;
  }
  state[currentClass] = [...state[currentClass], node.id];
  saveState();
  inspected = { type: 'node', id: node.id };
  showNotice(`Learned ${node.name}.`, 'good');
  renderAll();
}
function learnNode(node) {
  if ((node.exclusiveWith || []).length) {
    const alternative = (node.exclusiveWith || []).map((id) => byId(id)?.name || id).join(', ');
    showConfirm({
      title: `Learn ${node.name}?`,
      message: `This choice locks ${alternative} until you reset the entire Skill Tree.`,
      confirmLabel: 'Confirm choice',
      onConfirm: () => commitLearn(node),
    });
  } else commitLearn(node);
}
function resetTree() {
  showConfirm({
    title: `Reset ${currentClass} Skill Tree?`,
    message: 'All learned nodes will be cleared and all 13 Primary Skill Points will be returned.',
    confirmLabel: 'Reset Skill Tree',
    onConfirm: () => {
      state[currentClass] = [];
      saveState();
      inspected = null;
      showNotice(`${currentClass} Skill Tree reset.`, 'good');
      renderAll();
    },
  });
}

function renderTabs() {
  const root = document.getElementById('classTabs');
  root.innerHTML = '';
  for (const name of Object.keys(DATA)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `class-tab${name === currentClass ? ' active' : ''}`;
    button.textContent = name;
    button.setAttribute('aria-pressed', String(name === currentClass));
    button.onclick = () => {
      currentClass = name;
      inspected = null;
      showNotice('');
      renderAll();
    };
    root.append(button);
  }
}
function renderBuildStatus() {
  const count = learnedCount();
  document.body.dataset.class = currentClass.toLowerCase();
  document.getElementById('currentClass').textContent = currentClass;
  document.getElementById('role').textContent = classData().role;
  document.getElementById('spent').textContent = count;
  document.getElementById('remaining').textContent = `${maxSp() - count} SP remaining`;
  document.getElementById('progressFill').style.width = `${(count / maxSp()) * 100}%`;
  const milestones = [1, 2, 3, 4]
    .map((tier) => ({ value: threshold(tier), label: `Tier ${toRoman(tier)}` }))
    .concat({ value: maxSp(), label: 'Cap' });
  document.getElementById('milestones').innerHTML = milestones
    .map(
      (x) =>
        `<span class="milestone ${count >= x.value ? 'reached' : ''}" style="left:${(x.value / maxSp()) * 100}%"><i></i><em>${x.label}</em><b>${x.value}</b></span>`,
    )
    .join('');
}
function renderCore() {
  const root = document.getElementById('grantedGrid');
  root.innerHTML = '';
  for (const core of classData().core) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `core-card${inspected?.type === 'core' && inspected.id === core.id ? ' inspected' : ''}`;
    button.setAttribute('aria-label', `${core.name}. Granted Core. Open details.`);
    button.innerHTML = `<span class="core-icon">${initials(core.name)}</span><span><strong>${core.name}</strong><small>Granted Core</small></span><span aria-hidden="true">›</span>`;
    button.onclick = () => inspect('core', core.id);
    root.append(button);
  }
}
function createNode(node) {
  const status = nodeState(node),
    button = document.createElement('button');
  button.type = 'button';
  button.className = `skill-node state-${status.code}${inspected?.type === 'node' && inspected.id === node.id ? ' inspected' : ''}`;
  button.dataset.id = node.id;
  button.dataset.tier = node.tier;
  button.dataset.order = node.order;
  button.title = status.reason;
  button.setAttribute('aria-label', `${node.name}. ${status.reason}. Open details.`);
  const mark = status.code === 'learned' ? '✓' : status.code === 'locked' ? '🔒' : '';
  button.innerHTML = `<span class="node-icon">${initials(node.name)}${mark ? `<i class="state-mark" aria-hidden="true">${mark}</i>` : ''}</span><strong>${node.name}</strong>`;
  button.onclick = () => inspect('node', node.id);
  return button;
}
function renderTree() {
  const root = document.getElementById('tree');
  root.innerHTML = '';
  const board = document.createElement('div');
  board.className = 'vertical-tree';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('relations');
  svg.setAttribute('aria-hidden', 'true');
  board.append(svg);
  for (let tier = 1; tier <= 4; tier++) {
    const unlocked = tierUnlocked(tier),
      section = document.createElement('section');
    section.className = `tier-section tier-${tier}${unlocked ? ' unlocked' : ' locked'}`;
    const need = Math.max(0, threshold(tier) - learnedCount());
    section.innerHTML = `<header><div><span>Tier ${toRoman(tier)}</span>${unlocked ? '' : `<strong>LOCKED</strong>`}</div><small>${unlocked ? 'OPEN' : `Spend ${need} more SP to unlock`} · ${classData().tierCounts[String(tier)]} investments</small></header>`;
    const nodes = document.createElement('div');
    nodes.className = 'tier-nodes';
    classData()
      .nodes.filter((n) => n.tier === tier)
      .sort((a, b) => a.order - b.order)
      .forEach((n) => nodes.append(createNode(n)));
    section.append(nodes);
    board.append(section);
  }
  root.append(board);
  requestAnimationFrame(() => requestAnimationFrame(() => drawRelations(board)));
}
function drawRelations(board) {
  const svg = board.querySelector('.relations');
  if (!svg) return;
  const box = board.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${board.scrollWidth} ${board.scrollHeight}`);
  svg.setAttribute('width', board.scrollWidth);
  svg.setAttribute('height', board.scrollHeight);
  svg.innerHTML =
    '<defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z"></path></marker></defs>';
  const point = (el, edge) => {
    const r = el.getBoundingClientRect();
    return [r.left - box.left + r.width / 2, (edge === 'bottom' ? r.bottom : r.top) - box.top];
  };
  for (const target of classData().nodes)
    for (const sourceId of target.requires || []) {
      const a = board.querySelector(`[data-id="${sourceId}"]`),
        b = board.querySelector(`[data-id="${target.id}"]`);
      if (!a || !b) continue;
      const start = point(a, 'bottom'),
        end = point(b, 'top'),
        mid = (start[1] + end[1]) / 2,
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${start[0]} ${start[1]} V${mid} H${end[0]} V${end[1]}`);
      path.classList.add('relation-path');
      if (learnedSet().has(sourceId)) path.classList.add('active');
      path.setAttribute('marker-end', 'url(#arrow)');
      svg.append(path);
    }
}
function inspect(type, id) {
  inspected = { type, id };
  renderCore();
  document
    .querySelectorAll('.skill-node.inspected')
    .forEach((x) => x.classList.remove('inspected'));
  if (type === 'node') document.querySelector(`[data-id="${id}"]`)?.classList.add('inspected');
  renderInspector();
  document.getElementById('inspector').classList.add('open');
}
function severingProgress(item) {
  const ids = ['severing-strike', 'severing-strike-stage-ii', 'severing-strike-stage-iii'];
  if (!ids.includes(item.id)) return '';
  const learned = learnedSet();
  return `<div class="severing-progress" aria-label="Severing progression">${ids.map((id, i) => `${i ? '→' : ''}<span class="${learned.has(id) ? 'learned' : ''}${item.id === id ? ' current' : ''}"><b>${i + 1}/3</b><small>${learned.has(id) ? 'Learned' : 'Not learned'}</small></span>`).join('')}</div>`;
}
function technicalStrip(item) {
  const allowed = ['Cooldown', 'Cast Time', 'Range', 'Resource Cost', 'Charges'],
    fields = item.fields || {},
    rows = allowed
      .filter((key) => fields[key] && !/^(none|n\/a)$/i.test(fields[key]))
      .map(
        (key) =>
          `<div><dt>${key}</dt><dd>${formatTaggedText(fields[key], item.keywords)}</dd></div>`,
      )
      .join('');
  return rows ? `<dl class="technical-strip">${rows}</dl>` : '';
}
function detailMarkup(item, isCore, status) {
  const prereq =
    !isCore && (item.requiresNames || []).length
      ? `<p class="prerequisite-note"><b>Requires:</b> ${item.requiresNames.join(' + ')}</p>`
      : '';
  return `<div class="detail-hero"><span class="detail-icon">${initials(item.name)}</span><div><div class="detail-meta"><span>${isCore ? 'Granted Core' : `Tier ${toRoman(item.tier)}`}</span><span class="status-${status.code}">${status.label}</span></div><h2>${item.name}</h2></div></div>${prereq}<div class="skill-description">${formatDescription(item.description, item.keywords)}</div>${severingProgress(item)}${technicalStrip(item)}`;
}
function renderInspector() {
  hideKeywordTooltip();
  const root = document.getElementById('inspectorContent'),
    panel = document.getElementById('inspector');
  if (!inspected) {
    panel.classList.remove('open');
    root.innerHTML =
      '<div class="inspector-empty"><span>✦</span><h2>Inspect a skill</h2><p>Select a node to view its description, requirements and current state.</p></div>';
    return;
  }
  if (inspected.type === 'core') {
    const item = classData().core.find((x) => x.id === inspected.id);
    if (!item) {
      inspected = null;
      return renderInspector();
    }
    root.innerHTML = detailMarkup(item, true, { code: 'granted', label: 'Always available' });
    return;
  }
  const item = byId(inspected.id);
  if (!item) {
    inspected = null;
    return renderInspector();
  }
  const status = nodeState(item);
  const reason = status.code === 'locked' ? `<p class="action-reason">${status.reason}</p>` : '';
  const button =
    status.code === 'available'
      ? '<button class="primary-action" id="nodeAction" type="button">Learn</button>'
      : `<button class="primary-action" type="button" disabled>${status.label}</button>`;
  root.innerHTML =
    detailMarkup(item, false, status) + `<div class="inspector-actions">${reason}${button}</div>`;
  document.getElementById('nodeAction')?.addEventListener('click', () => learnNode(item));
}
function renderAppendix() {
  const root = document.getElementById('appendixHolder'),
    items = classData().appendix || [];
  root.innerHTML = '';
  if (!items.length) return;
  const details = document.createElement('details');
  details.className = 'appendix';
  details.innerHTML = `<summary>Synthesis forms <span>${items.length}</span></summary><div class="appendix-grid">${items.map((x) => `<article><strong>${x.name}</strong>${formatDescription(x.text, x.keywords)}</article>`).join('')}</div>`;
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
document.getElementById('resetClass').onclick = resetTree;
document.getElementById('inspectorClose').onclick = () => {
  inspected = null;
  renderInspector();
  renderCore();
  document
    .querySelectorAll('.skill-node.inspected')
    .forEach((x) => x.classList.remove('inspected'));
};
document.getElementById('confirmDialog').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) e.currentTarget.close();
});
window.addEventListener('resize', () => {
  const board = document.querySelector('.vertical-tree');
  if (board) requestAnimationFrame(() => drawRelations(board));
});
renderAll();
