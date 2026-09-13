const DATA = window.SKILL_TREE_DATA;
const STORAGE_KEY = 'sanctammo-skill-tree-v1';
const MAX_SP = 13;

let currentClass = 'Fighter';
let state = loadState();
let inspected = null;

function emptyState(){
  const result = {};
  Object.keys(DATA).forEach(name => result[name] = []);
  return result;
}

function loadState(){
  try{
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const clean = emptyState();
    if(!raw || typeof raw !== 'object') return clean;
    Object.keys(DATA).forEach(name => {
      const validIds = new Set(DATA[name].nodes.map(n => n.id));
      const incoming = Array.isArray(raw[name]) ? raw[name].filter(id => validIds.has(id)) : [];
      const chosen = [];
      incoming.forEach(id => {
        const node = DATA[name].nodes.find(n => n.id === id);
        if(!node) return;
        if(node.exclusiveWith?.some(other => chosen.includes(other))) return;
        chosen.push(id);
      });
      clean[name] = chosen.slice(0, DATA[name].maxSp || MAX_SP);
    });
    return clean;
  }catch(_){
    return emptyState();
  }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function classData(){ return DATA[currentClass]; }
function selectedSet(){ return new Set(state[currentClass]); }
function spent(){ return state[currentClass].length; }
function threshold(tier){ return classData().thresholds[String(tier)]; }
function byId(id){ return classData().nodes.find(n => n.id === id); }
function tierUnlocked(tier){ return spent() >= threshold(tier); }

function initials(name){
  return String(name || '')
    .replace(/—.*$/,'')
    .split(/\s+|\//)
    .filter(Boolean)
    .slice(0,2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[char]));
}

function missingPrereqs(node, set = selectedSet()){
  return (node.requires || []).filter(id => !set.has(id));
}

function activeExclusions(node, set = selectedSet()){
  return (node.exclusiveWith || []).filter(id => set.has(id));
}

function availability(node){
  const set = selectedSet();
  if(set.has(node.id)) return { ok:true, selected:true, reason:'Purchased' };
  if(spent() >= (classData().maxSp || MAX_SP)) return { ok:false, code:'cap', reason:'Maximum 13 Skill Points reached' };
  if(!tierUnlocked(node.tier)) return { ok:false, code:'tier', reason:`Requires ${threshold(node.tier)} SP spent` };
  const missing = missingPrereqs(node, set);
  if(missing.length){
    return { ok:false, code:'prereq', reason:`Requires ${missing.map(id => byId(id)?.name || id).join(' + ')}` };
  }
  const excluded = activeExclusions(node, set);
  if(excluded.length){
    return { ok:false, code:'exclusive', reason:`Alternative selected: ${excluded.map(id => byId(id)?.name || id).join(', ')}` };
  }
  return { ok:true, code:'available', reason:'Available' };
}

function selectedAllocationValidForTier(tier, total){
  if(tier === 1) return true;
  return total >= threshold(tier) + 1;
}

function normalizeAfterRemoval(set){
  const removed = [];
  let changed = true;
  while(changed){
    changed = false;
    for(const node of classData().nodes){
      if(!set.has(node.id)) continue;
      const invalidPrereq = (node.requires || []).some(id => !set.has(id));
      const invalidTier = !selectedAllocationValidForTier(node.tier, set.size);
      if(invalidPrereq || invalidTier){
        set.delete(node.id);
        removed.push(node.name);
        changed = true;
      }
    }
  }
  return removed;
}

function togglePurchase(id){
  const node = byId(id);
  if(!node) return;
  const set = selectedSet();

  if(set.has(id)){
    set.delete(id);
    const cascade = normalizeAfterRemoval(set);
    state[currentClass] = [...set];
    saveState();
    showNotice(cascade.length
      ? `Refunded ${node.name}; ${cascade.length} dependent investment${cascade.length === 1 ? '' : 's'} also removed.`
      : `Refunded ${node.name}.`);
  }else{
    const check = availability(node);
    if(!check.ok){
      showNotice(check.reason, 'error');
      renderInspector();
      return;
    }
    set.add(id);
    state[currentClass] = [...set];
    saveState();
    showNotice(`Learned ${node.name}.`, 'good');
  }

  renderAll({ preserveInspector:true });
}

function showNotice(text, type=''){
  const notice = document.getElementById('notice');
  notice.textContent = text;
  notice.className = `notice ${type}`.trim();
}

function semanticKind(node){
  if((node.exclusiveWith || []).length) return 'Branch';
  if((node.requires || []).length) return 'Upgrade';
  if(String(node.fields?.['Activation Type'] || '').toLowerCase().includes('passive')) return 'Passive';
  return 'Skill';
}

function visualState(node){
  const set = selectedSet();
  if(set.has(node.id)) return 'selected';
  const check = availability(node);
  return check.code || 'available';
}

function buildComponents(nodes){
  const index = new Map(nodes.map((node, i) => [node.id, i]));
  const adjacency = new Map(nodes.map(node => [node.id, new Set()]));

  nodes.forEach(node => {
    [...(node.requires || []), ...(node.exclusiveWith || [])].forEach(other => {
      if(!adjacency.has(other)) return;
      adjacency.get(node.id).add(other);
      adjacency.get(other).add(node.id);
    });
  });

  const seen = new Set();
  const components = [];
  nodes.forEach(start => {
    if(seen.has(start.id)) return;
    const stack = [start.id];
    const ids = [];
    seen.add(start.id);
    while(stack.length){
      const id = stack.pop();
      ids.push(id);
      adjacency.get(id).forEach(next => {
        if(seen.has(next)) return;
        seen.add(next);
        stack.push(next);
      });
    }
    ids.sort((a,b) => index.get(a) - index.get(b));
    components.push(ids.map(id => nodes[index.get(id)]));
  });
  return components;
}

function computeLayout(data){
  const components = buildComponents(data.nodes);
  const related = components.filter(group => group.length > 1);
  const singles = components.filter(group => group.length === 1).flat();
  const positions = {};
  let row = 1;

  related.forEach(component => {
    const groups = {1:[],2:[],3:[],4:[]};
    component.forEach(node => groups[node.tier].push(node));
    const span = Math.max(1, ...Object.values(groups).map(list => list.length));
    const rows = Array.from({length:span}, (_,i) => row + i);

    for(let tier=1;tier<=4;tier++){
      const used = new Set();
      groups[tier]
        .sort((a,b) => {
          const ap = (a.requires || []).map(id => positions[id]?.row).find(Boolean) ?? 999;
          const bp = (b.requires || []).map(id => positions[id]?.row).find(Boolean) ?? 999;
          if(ap !== bp) return ap - bp;
          return data.nodes.indexOf(a) - data.nodes.indexOf(b);
        })
        .forEach(node => {
          const parentRow = (node.requires || []).map(id => positions[id]?.row).find(Boolean);
          let targetRow = parentRow && rows.includes(parentRow) && !used.has(parentRow) ? parentRow : null;
          if(!targetRow) targetRow = rows.find(candidate => !used.has(candidate));
          if(!targetRow) targetRow = rows[0];
          used.add(targetRow);
          positions[node.id] = { tier, row:targetRow };
        });
    }
    row += span;
  });

  const packedRows = [];
  singles.forEach(node => {
    let slot = packedRows.find(entry => !entry.tiers.has(node.tier));
    if(!slot){
      slot = { row:row + packedRows.length, tiers:new Set() };
      packedRows.push(slot);
    }
    slot.tiers.add(node.tier);
    positions[node.id] = { tier:node.tier, row:slot.row };
  });

  const totalRows = Math.max(1, row - 1 + packedRows.length);
  return { positions, totalRows };
}

function renderTabs(){
  const container = document.getElementById('classTabs');
  container.innerHTML = '';
  Object.keys(DATA).forEach(name => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `class-tab${name === currentClass ? ' active' : ''}`;
    button.textContent = name;
    button.setAttribute('aria-pressed', name === currentClass ? 'true' : 'false');
    button.onclick = () => {
      currentClass = name;
      inspected = null;
      showNotice('');
      renderAll();
    };
    container.appendChild(button);
  });
}

function renderBuildStatus(){
  const data = classData();
  const current = spent();
  document.body.dataset.class = currentClass.toLowerCase();
  document.getElementById('currentClass').textContent = currentClass;
  document.getElementById('role').textContent = data.role;
  document.getElementById('spent').textContent = current;
  document.getElementById('remaining').textContent = `${data.maxSp - current} SP remaining`;
  document.getElementById('progressFill').style.width = `${Math.min(100, (current / data.maxSp) * 100)}%`;

  const milestones = [
    {value:0,label:'Tier I'},
    {value:5,label:'Tier II'},
    {value:9,label:'Tier III'},
    {value:11,label:'Tier IV'},
    {value:13,label:'Cap'}
  ];
  const wrap = document.getElementById('milestones');
  wrap.innerHTML = '';
  milestones.forEach(item => {
    const marker = document.createElement('div');
    marker.className = `milestone${current >= item.value ? ' reached' : ''}`;
    marker.style.left = `${(item.value / data.maxSp) * 100}%`;
    marker.innerHTML = `<i></i><span>${escapeHtml(item.label)}</span><b>${item.value}</b>`;
    wrap.appendChild(marker);
  });
}

function renderCore(){
  const grid = document.getElementById('grantedGrid');
  grid.innerHTML = '';
  classData().core.forEach(core => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `core-card${inspected?.type === 'core' && inspected.id === core.id ? ' inspected' : ''}`;
    button.title = core.short || core.name;
    button.innerHTML = `
      <span class="core-icon">${escapeHtml(initials(core.name))}</span>
      <span class="core-copy"><strong>${escapeHtml(core.name)}</strong><small>Granted</small></span>
      <span class="inspect-chevron" aria-hidden="true">›</span>`;
    button.onclick = () => inspect('core', core.id);
    grid.appendChild(button);
  });
}

function createNode(node){
  const stateName = visualState(node);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `skill-node state-${stateName}${inspected?.type === 'node' && inspected.id === node.id ? ' inspected' : ''}`;
  button.dataset.id = node.id;
  button.dataset.tier = node.tier;
  button.title = node.short || node.name;
  button.setAttribute('aria-label', `${node.name}. ${availability(node).reason}. Select for details. Double-click to learn or refund.`);
  button.innerHTML = `
    <span class="node-icon">${escapeHtml(initials(node.name))}</span>
    <span class="node-copy">
      <strong>${escapeHtml(node.name)}</strong>
      <small>${escapeHtml(semanticKind(node))}</small>
    </span>
    <span class="node-cost">${node.cost || 1}<em>SP</em></span>
    <span class="state-mark" aria-hidden="true"></span>`;
  button.onclick = () => inspect('node', node.id);
  button.addEventListener('dblclick', event => {
    event.preventDefault();
    togglePurchase(node.id);
  });
  button.addEventListener('mouseenter', () => emphasizeRelations(node.id, true));
  button.addEventListener('mouseleave', () => emphasizeRelations(node.id, false));
  button.addEventListener('focus', () => emphasizeRelations(node.id, true));
  button.addEventListener('blur', () => emphasizeRelations(node.id, false));
  return button;
}

function renderTree(){
  const data = classData();
  const layout = computeLayout(data);
  const root = document.getElementById('tree');
  root.innerHTML = '';

  const board = document.createElement('div');
  board.className = 'skill-board';
  board.style.setProperty('--rows', layout.totalRows);

  const heads = document.createElement('div');
  heads.className = 'tier-heads';
  for(let tier=1;tier<=4;tier++){
    const head = document.createElement('div');
    const unlocked = tierUnlocked(tier);
    head.className = `tier-head${unlocked ? ' unlocked' : ''}`;
    head.innerHTML = `
      <div class="tier-title"><span>Tier ${toRoman(tier)}${unlocked ? '' : ' <strong class="tier-locked">LOCKED</strong>'}</span><b>${unlocked ? 'OPEN' : `Spend +${Math.max(0, threshold(tier) - spent())} SP to unlock tier`}</b></div>
      <small>${data.tierCounts[String(tier)]} investments</small>`;
    heads.appendChild(head);
  }
  board.appendChild(heads);

  const canvas = document.createElement('div');
  canvas.className = 'tree-canvas';
  canvas.style.setProperty('--rows', layout.totalRows);

  const lanes = document.createElement('div');
  lanes.className = 'tier-lanes';
  for(let tier=1;tier<=4;tier++){
    const lane = document.createElement('div');
    lane.className = `tier-lane tier-${tier}${tierUnlocked(tier) ? ' unlocked' : ''}`;
    lanes.appendChild(lane);
  }
  canvas.appendChild(lanes);

  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.classList.add('relations');
  svg.setAttribute('aria-hidden','true');
  canvas.appendChild(svg);

  data.nodes.forEach(node => {
    const position = layout.positions[node.id];
    const element = createNode(node);
    element.style.gridColumn = String(position.tier);
    element.style.gridRow = String(position.row);
    canvas.appendChild(element);
  });

  board.appendChild(canvas);
  root.appendChild(board);
  requestAnimationFrame(() => requestAnimationFrame(() => drawRelations(canvas)));
}

function toRoman(number){ return ['','I','II','III','IV'][number] || number; }

function edgePoint(element, canvas, edge){
  const rect = element.getBoundingClientRect();
  const base = canvas.getBoundingClientRect();
  const left = rect.left - base.left;
  const top = rect.top - base.top;
  if(edge === 'left') return [left, top + rect.height/2];
  if(edge === 'right') return [left + rect.width, top + rect.height/2];
  if(edge === 'top') return [left + rect.width/2, top];
  if(edge === 'bottom') return [left + rect.width/2, top + rect.height];
  return [left + rect.width/2, top + rect.height/2];
}

function drawRelations(canvas){
  const svg = canvas.querySelector('.relations');
  if(!svg) return;
  canvas.querySelectorAll('.choice-label').forEach(el => el.remove());

  const width = canvas.scrollWidth;
  const height = canvas.scrollHeight;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.innerHTML = `
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L8,4 L0,8 z"></path>
      </marker>
    </defs>`;

  const set = selectedSet();
  const nodeElement = id => canvas.querySelector(`.skill-node[data-id="${id}"]`);

  classData().nodes.forEach(target => {
    (target.requires || []).forEach(sourceId => {
      const source = nodeElement(sourceId);
      const destination = nodeElement(target.id);
      if(!source || !destination) return;

      const sourceRect = source.getBoundingClientRect();
      const targetRect = destination.getBoundingClientRect();
      const sameColumn = Math.abs(sourceRect.left - targetRect.left) < 20;
      let pathData;

      if(sameColumn){
        const start = edgePoint(source, canvas, 'right');
        const end = edgePoint(destination, canvas, 'right');
        const bracketX = Math.max(start[0], end[0]) + 22;
        pathData = `M ${start[0]} ${start[1]} H ${bracketX} V ${end[1]} H ${end[0]}`;
      }else{
        const forward = targetRect.left > sourceRect.left;
        const start = edgePoint(source, canvas, forward ? 'right' : 'left');
        const end = edgePoint(destination, canvas, forward ? 'left' : 'right');
        if(Math.abs(start[1] - end[1]) < 2){
          pathData = `M ${start[0]} ${start[1]} H ${end[0]}`;
        }else{
          const gutterX = start[0] + (forward ? 22 : -22);
          pathData = `M ${start[0]} ${start[1]} H ${gutterX} V ${end[1]} H ${end[0]}`;
        }
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', pathData);
      path.classList.add('relation-path','prerequisite');
      path.dataset.source = sourceId;
      path.dataset.target = target.id;
      if(set.has(sourceId)) path.classList.add('source-owned');
      if(set.has(target.id)) path.classList.add('complete');
      path.setAttribute('marker-end','url(#arrow)');
      svg.appendChild(path);
    });
  });

  const seen = new Set();
  classData().nodes.forEach(node => {
    (node.exclusiveWith || []).forEach(otherId => {
      const key = [node.id, otherId].sort().join('::');
      if(seen.has(key)) return;
      seen.add(key);
      const a = nodeElement(node.id);
      const b = nodeElement(otherId);
      if(!a || !b) return;

      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const sameColumn = Math.abs(ar.left - br.left) < 20;
      let pathData, labelX, labelY;

      if(sameColumn){
        const aPoint = edgePoint(a, canvas, 'left');
        const bPoint = edgePoint(b, canvas, 'left');
        const bracketX = Math.min(aPoint[0], bPoint[0]) - 24;
        pathData = `M ${aPoint[0]} ${aPoint[1]} H ${bracketX} V ${bPoint[1]} H ${bPoint[0]}`;
        labelX = bracketX;
        labelY = (aPoint[1] + bPoint[1]) / 2;
      }else{
        const forward = br.left > ar.left;
        const aPoint = edgePoint(a, canvas, forward ? 'right' : 'left');
        const bPoint = edgePoint(b, canvas, forward ? 'left' : 'right');
        const midX = (aPoint[0] + bPoint[0]) / 2;
        pathData = `M ${aPoint[0]} ${aPoint[1]} H ${midX} V ${bPoint[1]} H ${bPoint[0]}`;
        labelX = midX;
        labelY = (aPoint[1] + bPoint[1]) / 2;
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', pathData);
      path.classList.add('relation-path','exclusive');
      path.dataset.source = node.id;
      path.dataset.target = otherId;
      if(set.has(node.id) || set.has(otherId)) path.classList.add('choice-made');
      svg.appendChild(path);

      const label = document.createElement('div');
      label.className = `choice-label${set.has(node.id) || set.has(otherId) ? ' choice-made' : ''}`;
      label.textContent = 'CHOOSE ONE';
      label.style.left = `${labelX}px`;
      label.style.top = `${labelY}px`;
      canvas.appendChild(label);
    });
  });
}

function emphasizeRelations(id, active){
  document.querySelectorAll(`.relation-path[data-source="${id}"], .relation-path[data-target="${id}"]`)
    .forEach(path => path.classList.toggle('emphasis', active));
}

function inspect(type, id){
  inspected = { type, id };
  renderCore();
  document.querySelectorAll('.skill-node.inspected').forEach(el => el.classList.remove('inspected'));
  if(type === 'node') document.querySelector(`.skill-node[data-id="${id}"]`)?.classList.add('inspected');
  renderInspector();
  document.getElementById('inspector').classList.add('open');
}

function renderInspector(){
  const content = document.getElementById('inspectorContent');
  const inspector = document.getElementById('inspector');
  if(!inspected){
    inspector.classList.remove('open');
    content.innerHTML = `
      <div class="inspector-empty">
        <div class="empty-glyph" aria-hidden="true">✦</div>
        <h2>Inspect a skill</h2>
        <p>Select any node to view its full description, requirements and build action.</p>
      </div>`;
    return;
  }

  if(inspected.type === 'core'){
    const core = classData().core.find(item => item.id === inspected.id);
    if(!core){ inspected = null; return renderInspector(); }
    content.innerHTML = detailMarkup(core, true);
    return;
  }

  const node = byId(inspected.id);
  if(!node){ inspected = null; return renderInspector(); }
  const check = availability(node);
  const owned = selectedSet().has(node.id);
  const actionText = owned ? 'Refund 1 SP' : `Learn for ${node.cost || 1} SP`;
  const disabled = !owned && !check.ok;
  content.innerHTML = `${detailMarkup(node, false)}
    <div class="inspector-action-wrap">
      ${disabled ? `<div class="action-reason">${escapeHtml(check.reason)}</div>` : ''}
      <button class="primary-action${owned ? ' refund' : ''}" id="nodeAction" type="button" ${disabled ? 'disabled' : ''}>${escapeHtml(actionText)}</button>
    </div>`;
  document.getElementById('nodeAction')?.addEventListener('click', () => togglePurchase(node.id));
}

function detailMarkup(item, isCore){
  const fields = item.fields || {};
  const rows = Object.entries(fields)
    .map(([key,value]) => `<div class="detail-row"><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join('');
  const relationBits = [];
  if(!isCore && item.requiresNames?.length) relationBits.push(`<span>Requires ${escapeHtml(item.requiresNames.join(' + '))}</span>`);
  if(!isCore && item.exclusiveNames?.length) relationBits.push(`<span>Exclusive with ${escapeHtml(item.exclusiveNames.join(', '))}</span>`);
  const meta = isCore
    ? `<span class="detail-chip">Granted Core</span><span class="detail-chip">0 SP</span>`
    : `<span class="detail-chip">Tier ${toRoman(item.tier)}</span><span class="detail-chip">${escapeHtml(semanticKind(item))}</span><span class="detail-chip">${item.cost || 1} SP</span>`;

  return `
    <div class="detail-hero">
      <div class="detail-icon">${escapeHtml(initials(item.name))}</div>
      <div><div class="detail-meta">${meta}</div><h2>${escapeHtml(item.name)}</h2></div>
    </div>
    <p class="detail-short">${escapeHtml(item.short)}</p>
    <div class="detail-tooltip">${escapeHtml(item.tooltip)}</div>
    ${relationBits.length ? `<div class="relation-notes">${relationBits.join('')}</div>` : ''}
    ${rows ? `<dl class="detail-table">${rows}</dl>` : ''}`;
}

function renderAppendix(){
  const holder = document.getElementById('appendixHolder');
  holder.innerHTML = '';
  const appendix = classData().appendix || [];
  if(!appendix.length) return;
  const details = document.createElement('details');
  details.className = 'appendix';
  details.innerHTML = `<summary>Contextual / synthesis forms <span>${appendix.length}</span></summary>`;
  const grid = document.createElement('div');
  grid.className = 'appendix-grid';
  appendix.forEach(item => {
    const card = document.createElement('article');
    card.innerHTML = `<strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.text)}</p>`;
    grid.appendChild(card);
  });
  details.appendChild(grid);
  holder.appendChild(details);
}

function renderAll(options = {}){
  renderTabs();
  renderBuildStatus();
  renderCore();
  renderTree();
  renderAppendix();
  if(options.preserveInspector && inspected) renderInspector();
  else if(!inspected) renderInspector();
}

document.getElementById('resetClass').onclick = () => {
  state[currentClass] = [];
  saveState();
  showNotice(`Reset ${currentClass}.`);
  renderAll({ preserveInspector:true });
};

document.getElementById('resetAll').onclick = () => {
  state = emptyState();
  saveState();
  showNotice('Reset all Primary builds.');
  renderAll({ preserveInspector:true });
};

document.getElementById('inspectorClose').onclick = () => {
  inspected = null;
  renderInspector();
  renderCore();
  document.querySelectorAll('.skill-node.inspected').forEach(el => el.classList.remove('inspected'));
};

window.addEventListener('resize', () => {
  const canvas = document.querySelector('.tree-canvas');
  if(canvas) requestAnimationFrame(() => drawRelations(canvas));
});

renderAll();
