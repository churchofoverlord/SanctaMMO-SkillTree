const fighterOriginalRenderCore = renderCore;
const fighterOriginalRenderTree = renderTree;

const FIGHTER_LAYOUT = {
  'severing-strike':[1,1],
  'severing-strike-stage-ii':[2,1],
  'severing-strike-stage-iii':[3,1],
  'piercing-strike':[1,2],
  'breaching-strike-warrior-tank':[3,2],
  'crushing-blow':[1,3],
  'crushing-blow-combo':[2,3],
  'shoulder-rush':[1,4],
  'blade-rush-shield-rush':[2,4],
  'battlecry-challenge':[1,5],
  'battlerage-chain-challenge':[4,5],
  'pressure-provoke':[1,6],
  'chains':[2,7],
  'chain-pull':[3,7],
  'war-leap':[2,8],
  'second-wind':[1,9],
  'defiant-presence':[3,9],
  'rally':[2,10],
  'bloodlust-inspiration':[4,10],
  'momentum-mastery':[4,11]
};

renderCore = function(){
  if(currentClass!=='Fighter') return fighterOriginalRenderCore();
  const grid=document.getElementById('grantedGrid');
  grid.innerHTML='';
  const core=DATA.Fighter.core;
  const rage=core.find(n=>n.id==='core-rage');
  const bulwark=core.find(n=>n.id==='core-bulwark');
  const display=[
    core.find(n=>n.id==='core-cleanse'),
    core.find(n=>n.id==='core-warrior-tank-stance'),
    {
      id:'core-rage-bulwark',
      name:'Rage / Bulwark',
      short:'Contextual Momentum payoff: Warrior restores HP; Tank gains a Shield.',
      tooltip:`Warrior — Rage: ${rage?.tooltip||''}\n\nTank — Bulwark: ${bulwark?.tooltip||''}`,
      fields:{
        'Acquisition':'Granted — contextual stance payoff',
        'Activation Type':'Click to Cast',
        'Target Type':'Self',
        'Resource Cost':'All Momentum',
        'Cooldown':'Shared Rage / Bulwark cooldown'
      }
    }
  ].filter(Boolean);

  display.forEach(n=>{
    const d=document.createElement('div');
    d.className='core-card';
    d.tabIndex=0;
    d.innerHTML=`<b>${escapeHtml(n.name)}</b><p>${escapeHtml(n.short)}</p>`;
    bindTooltip(d,n,true);
    grid.appendChild(d);
  });
};

function fighterNodeState(node,set){
  if(set.has(node.id)) return 'selected';
  if(spent()>=DATA.Fighter.maxSp) return 'cap';
  if(!tierUnlockedForPurchase(node.tier)) return 'tier';
  if(missingPrereqs(node,set).length) return 'prereq';
  if(activeExclusions(node,set).length) return 'exclusive';
  return 'available';
}

function makeFighterNode(node,set){
  const a=availability(node);
  const stateName=fighterNodeState(node,set);
  const b=document.createElement('button');
  b.type='button';
  b.className='node fighter-node'+(set.has(node.id)?' selected':'')+(!a.ok?' locked':'')+` state-${stateName}`+(a.exclusive?' exclusive-lock':'');
  b.dataset.id=node.id;
  const depText=node.requiresNames.length ? 'Requires '+node.requiresNames.join(' + ') : 'Independent';
  b.innerHTML=`<div class="icon">${escapeHtml(initials(node.name))}</div><div class="node-name">${escapeHtml(node.name)}</div><div class="node-bottom"><span>1 SP</span><span class="dep-dot">${escapeHtml(depText)}</span></div><div class="lock-reason">${escapeHtml(set.has(node.id)?'Purchased':(!a.ok?a.reason:'Available'))}</div>`;
  b.onclick=()=>toggleNode(node.id);
  bindTooltip(b,node,false);
  return b;
}

renderTree = function(){
  const root=document.getElementById('tree');
  if(currentClass!=='Fighter'){
    root.className='tree';
    return fighterOriginalRenderTree();
  }

  root.innerHTML='';
  root.className='tree fighter-tree';
  const set=selectedSet();

  const wrap=document.createElement('div');
  wrap.className='fighter-board';

  const note=document.createElement('div');
  note.className='board-note';
  note.innerHTML='<b>Fighter Primary</b><span>Lines show authored prerequisites only. Tier gates unlock access; visual proximity never creates a prerequisite.</span>';
  wrap.appendChild(note);

  const heads=document.createElement('div');
  heads.className='board-heads';
  for(let tier=1;tier<=4;tier++){
    const h=document.createElement('div');
    h.className='board-head'+(tierUnlockedForPurchase(tier)?' unlocked':'');
    h.innerHTML=`<span class="board-tier">Tier ${tier}</span><span class="board-gate">${tier===1?'0 SP · available immediately':`${threshold(tier)} SP spent to unlock`}</span><span class="board-count">${DATA.Fighter.tierCounts[String(tier)]} investments</span>`;
    heads.appendChild(h);
  }
  wrap.appendChild(heads);

  const board=document.createElement('div');
  board.className='board-canvas';
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.classList.add('connections');
  svg.setAttribute('aria-hidden','true');
  board.appendChild(svg);

  DATA.Fighter.nodes.forEach(node=>{
    const pos=FIGHTER_LAYOUT[node.id];
    const b=makeFighterNode(node,set);
    if(pos){
      b.style.gridColumn=String(pos[0]);
      b.style.gridRow=String(pos[1]);
    }
    board.appendChild(b);
  });

  wrap.appendChild(board);
  root.appendChild(wrap);
  requestAnimationFrame(()=>drawFighterConnections(board,set));
};

function drawFighterConnections(board,set){
  const svg=board.querySelector('.connections');
  if(!svg) return;
  const rect=board.getBoundingClientRect();
  const w=board.scrollWidth;
  const h=board.scrollHeight;
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  svg.setAttribute('width',w);
  svg.setAttribute('height',h);
  svg.innerHTML='<defs><marker id="fighter-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 z" /></marker></defs>';

  DATA.Fighter.nodes.forEach(target=>{
    target.requires.forEach(sourceId=>{
      const sourceEl=board.querySelector(`[data-id="${sourceId}"]`);
      const targetEl=board.querySelector(`[data-id="${target.id}"]`);
      if(!sourceEl||!targetEl) return;
      const s=sourceEl.getBoundingClientRect();
      const t=targetEl.getBoundingClientRect();
      const sx=s.right-rect.left;
      const sy=s.top+s.height/2-rect.top;
      const tx=t.left-rect.left;
      const ty=t.top+t.height/2-rect.top;
      const bend=Math.max(26,(tx-sx)*.42);
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',`M ${sx} ${sy} C ${sx+bend} ${sy}, ${tx-bend} ${ty}, ${tx} ${ty}`);
      path.classList.add('connection');
      if(set.has(sourceId)) path.classList.add('active');
      if(set.has(target.id)) path.classList.add('complete');
      path.setAttribute('marker-end','url(#fighter-arrow)');
      svg.appendChild(path);
    });
  });
}

window.addEventListener('resize',()=>{
  if(currentClass!=='Fighter') return;
  const board=document.querySelector('.board-canvas');
  if(board) drawFighterConnections(board,selectedSet());
});

render();
