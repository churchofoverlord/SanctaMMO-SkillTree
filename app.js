const DATA = window.SKILL_TREE_DATA;
const STORAGE_KEY='sanctammo-skill-tree-v1';
let currentClass='Fighter';
let state=loadState();
let hoverTarget=null;

function emptyState(){
  const s={}; Object.keys(DATA).forEach(k=>s[k]=[]);
  return s;
}
function loadState(){
  try {
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
    const s=emptyState();
    if(raw && typeof raw==='object') Object.keys(DATA).forEach(k=>{
      if(Array.isArray(raw[k])) s[k]=raw[k].filter(id=>DATA[k].nodes.some(n=>n.id===id));
    });
    return s;
  } catch(e){ return emptyState(); }
}
function saveState(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
function selectedSet(){ return new Set(state[currentClass]); }
function spent(){ return state[currentClass].length; }
function byId(id){ return DATA[currentClass].nodes.find(n=>n.id===id); }
function initials(name){
  return name.replace(/—.*$/,'').split(/\s+|\//).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
}
function threshold(tier){ return DATA[currentClass].thresholds[String(tier)]; }
function tierUnlockedForPurchase(tier){ return spent() >= threshold(tier); }
function selectedAllocationValidForTier(tier,total){
  if(tier===1) return true;
  return total >= threshold(tier)+1;
}
function missingPrereqs(node,set){
  return node.requires.filter(id=>!set.has(id));
}
function activeExclusions(node,set){
  return node.exclusiveWith.filter(id=>set.has(id));
}
function availability(node){
  const set=selectedSet();
  if(set.has(node.id)) return {ok:true,selected:true,reason:'Selected'};
  if(spent()>=DATA[currentClass].maxSp) return {ok:false,reason:'Maximum 13 Skill Points reached'};
  if(!tierUnlockedForPurchase(node.tier)) return {ok:false,reason:`Requires ${threshold(node.tier)} SP already spent to unlock Tier ${node.tier}`};
  const miss=missingPrereqs(node,set);
  if(miss.length) return {ok:false,reason:'Requires: '+miss.map(id=>byId(id)?.name||id).join(' + ')};
  const ex=activeExclusions(node,set);
  if(ex.length) return {ok:false,exclusive:true,reason:'Mutually exclusive with: '+ex.map(id=>byId(id)?.name||id).join(', ')};
  return {ok:true,reason:'Available'};
}
function dependentsOf(id,set){
  return DATA[currentClass].nodes.filter(n=>set.has(n.id) && n.requires.includes(id)).map(n=>n.id);
}
function normalizeAfterRemoval(set){
  const removed=[];
  let changed=true;
  while(changed){
    changed=false;
    for(const n of DATA[currentClass].nodes){
      if(!set.has(n.id)) continue;
      if(n.requires.some(r=>!set.has(r)) || !selectedAllocationValidForTier(n.tier,set.size)){
        set.delete(n.id); removed.push(n.name); changed=true;
      }
    }
  }
  return removed;
}
function toggleNode(id){
  const node=byId(id); const set=selectedSet();
  if(set.has(id)){
    set.delete(id);
    const removed=normalizeAfterRemoval(set);
    state[currentClass]=[...set];
    saveState(); render();
    showNotice(removed.length ? `Removed ${node.name} and ${removed.length} dependent/invalid investment${removed.length===1?'':'s'}.` : `Removed ${node.name}.`,'');
    return;
  }
  const a=availability(node);
  if(!a.ok){ showNotice(a.reason,'error'); return; }
  set.add(id); state[currentClass]=[...set]; saveState(); render(); showNotice(`Purchased ${node.name}.`,'good');
}
function showNotice(text,type=''){
  const el=document.getElementById('notice'); el.textContent=text; el.className='notice '+type;
}
function renderTabs(){
 const tabs=document.getElementById('classTabs'); tabs.innerHTML='';
 Object.keys(DATA).forEach(name=>{
  const b=document.createElement('button'); b.className='class-tab'+(name===currentClass?' active':''); b.textContent=name;
  b.onclick=()=>{currentClass=name; hideTooltip(); render();};
  tabs.appendChild(b);
 });
}
function renderCore(){
 const grid=document.getElementById('grantedGrid'); grid.innerHTML='';
 DATA[currentClass].core.forEach(n=>{
  const d=document.createElement('div'); d.className='core-card'; d.tabIndex=0;
  d.innerHTML=`<b>${escapeHtml(n.name)}</b><p>${escapeHtml(n.short)}</p>`;
  bindTooltip(d,n,true); grid.appendChild(d);
 });
}
function renderTree(){
 const root=document.getElementById('tree'); root.innerHTML='';
 const set=selectedSet();
 for(let tier=1;tier<=4;tier++){
   const row=document.createElement('section'); row.className='tier'; row.dataset.tier=tier;
   const isUnlocked=tierUnlockedForPurchase(tier);
   const meta=document.createElement('div'); meta.className='tier-meta'+(isUnlocked?' unlocked':'');
   meta.innerHTML=`<div class="tname">Tier ${tier}</div><div class="threshold">${tier===1?'Available immediately':`Unlock: ${threshold(tier)} SP spent`}</div><div class="threshold">${DATA[currentClass].tierCounts[String(tier)]} investments</div>`;
   const nodes=document.createElement('div'); nodes.className='nodes';
   DATA[currentClass].nodes.filter(n=>n.tier===tier).forEach(n=>{
     const a=availability(n); const b=document.createElement('button');
     b.type='button'; b.className='node'+(set.has(n.id)?' selected':'')+(!a.ok?' locked':'')+(a.exclusive?' exclusive-lock':'');
     b.dataset.id=n.id;
     const depText=n.requiresNames.length ? 'Req: '+n.requiresNames.join(' + ') : (n.exclusiveNames.length?'Exclusive branch':'');
     b.innerHTML=`<div class="icon">${escapeHtml(initials(n.name))}</div><div class="node-name">${escapeHtml(n.name)}</div><div class="node-bottom"><span>1 SP</span><span class="dep-dot">${escapeHtml(depText)}</span></div><div class="lock-reason">${escapeHtml(set.has(n.id)?'Purchased':(!a.ok?a.reason:''))}</div>`;
     b.onclick=()=>toggleNode(n.id); bindTooltip(b,n,false); nodes.appendChild(b);
   });
   row.append(meta,nodes); root.appendChild(row);
 }
}
function renderAppendix(){
 const h=document.getElementById('appendixHolder'); h.innerHTML='';
 if(!DATA[currentClass].appendix?.length) return;
 const d=document.createElement('details'); d.className='appendix';
 d.innerHTML='<summary>Contextual / Synthesis forms — no additional Skill Point cost</summary>';
 const g=document.createElement('div'); g.className='appendix-grid';
 DATA[currentClass].appendix.forEach(x=>{const c=document.createElement('div');c.className='appendix-card';c.innerHTML=`<b>${escapeHtml(x.name)}</b>${escapeHtml(x.text)}`;g.appendChild(c);});
 d.appendChild(g);h.appendChild(d);
}
function render(){
 renderTabs();
 document.getElementById('role').textContent=DATA[currentClass].role;
 document.getElementById('spent').textContent=spent();
 document.getElementById('remaining').textContent=DATA[currentClass].maxSp-spent();
 renderCore(); renderTree(); renderAppendix();
}
function escapeHtml(s){
 return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function tooltipContent(n,isCore){
 const fields=n.fields||{};
 let tags=`<div class="tagrow">${isCore?'<span class="tag">Granted Core</span>':`<span class="tag">Tier ${n.tier}</span><span class="tag">1 SP</span>`}`;
 if(n.requiresNames?.length) tags+=`<span class="tag">Requires: ${escapeHtml(n.requiresNames.join(' + '))}</span>`;
 if(n.exclusiveNames?.length) tags+=`<span class="tag">Exclusive: ${escapeHtml(n.exclusiveNames.join(', '))}</span>`;
 tags+='</div>';
 const rows=Object.entries(fields).map(([k,v])=>`<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`).join('');
 return `<h3>${escapeHtml(n.name)}</h3>${tags}<div class="short"><b>Short:</b> ${escapeHtml(n.short)}</div><div class="tt"><b>Tooltip:</b> ${escapeHtml(n.tooltip)}</div>${rows?`<table>${rows}</table>`:''}`;
}
function bindTooltip(el,n,isCore){
 el.addEventListener('mouseenter',e=>showTooltip(el,n,isCore));
 el.addEventListener('focus',e=>showTooltip(el,n,isCore));
 el.addEventListener('mouseleave',hideTooltip);
 el.addEventListener('blur',hideTooltip);
 el.addEventListener('mousemove',()=>positionTooltip(el));
}
function showTooltip(el,n,isCore){
 const t=document.getElementById('tooltip'); hoverTarget=el; t.innerHTML=tooltipContent(n,isCore); t.classList.add('show'); positionTooltip(el);
}
function positionTooltip(el){
 const t=document.getElementById('tooltip'); if(!t.classList.contains('show')||!el) return;
 const r=el.getBoundingClientRect(), margin=10;
 const tw=t.offsetWidth, th=t.offsetHeight;
 let left=r.right+margin, top=r.top;
 if(left+tw>window.innerWidth-margin) left=Math.max(margin,r.left-tw-margin);
 if(top+th>window.innerHeight-margin) top=Math.max(margin,window.innerHeight-th-margin);
 t.style.left=left+'px'; t.style.top=top+'px';
}
function hideTooltip(){document.getElementById('tooltip').classList.remove('show');hoverTarget=null;}
window.addEventListener('scroll',()=>{if(hoverTarget)positionTooltip(hoverTarget)},true);
window.addEventListener('resize',()=>{if(hoverTarget)positionTooltip(hoverTarget)});

document.getElementById('resetClass').onclick=()=>{state[currentClass]=[];saveState();render();showNotice(`Reset ${currentClass}.`,'')};
document.getElementById('resetAll').onclick=()=>{state=emptyState();saveState();render();showNotice('Reset all class builds.','')};

render();
