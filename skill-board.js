const boardBaseRenderCore = renderCore;
const boardBaseRenderTree = renderTree;

function buildRelationComponents(classData){
  const nodes=classData.nodes;
  const byIdMap=new Map(nodes.map((n,i)=>[n.id,{node:n,index:i}]));
  const adjacency=new Map(nodes.map(n=>[n.id,new Set()]));

  nodes.forEach(n=>{
    (n.requires||[]).forEach(other=>{
      if(!adjacency.has(other)) return;
      adjacency.get(n.id).add(other);
      adjacency.get(other).add(n.id);
    });
    (n.exclusiveWith||[]).forEach(other=>{
      if(!adjacency.has(other)) return;
      adjacency.get(n.id).add(other);
      adjacency.get(other).add(n.id);
    });
  });

  const seen=new Set();
  const components=[];
  nodes.forEach(start=>{
    if(seen.has(start.id)) return;
    const stack=[start.id];
    const ids=[];
    seen.add(start.id);
    while(stack.length){
      const id=stack.pop();
      ids.push(id);
      adjacency.get(id).forEach(next=>{
        if(seen.has(next)) return;
        seen.add(next);
        stack.push(next);
      });
    }
    ids.sort((a,b)=>byIdMap.get(a).index-byIdMap.get(b).index);
    components.push(ids.map(id=>byIdMap.get(id).node));
  });
  return components;
}

function computeUnifiedLayout(classData){
  const components=buildRelationComponents(classData);
  const positions={};
  let baseRow=1;

  components.forEach(component=>{
    const tierGroups={1:[],2:[],3:[],4:[]};
    component.forEach(n=>tierGroups[n.tier].push(n));
    const span=Math.max(1,...Object.values(tierGroups).map(x=>x.length));
    const componentRows=Array.from({length:span},(_,i)=>baseRow+i);

    for(let tier=1;tier<=4;tier++){
      const group=tierGroups[tier];
      if(!group.length) continue;
      const used=new Set();

      group.sort((a,b)=>{
        const ap=(a.requires||[]).map(id=>positions[id]?.row).find(Boolean) ?? 999;
        const bp=(b.requires||[]).map(id=>positions[id]?.row).find(Boolean) ?? 999;
        if(ap!==bp) return ap-bp;
        return classData.nodes.indexOf(a)-classData.nodes.indexOf(b);
      });

      group.forEach(node=>{
        const desired=(node.requires||[]).map(id=>positions[id]?.row).find(Boolean);
        let row=desired && componentRows.includes(desired) && !used.has(desired) ? desired : null;
        if(!row) row=componentRows.find(r=>!used.has(r));
        if(!row) row=componentRows[0];
        used.add(row);
        positions[node.id]={tier,row};
      });
    }

    baseRow+=span;
  });

  return {positions,totalRows:Math.max(1,baseRow-1)};
}

function nodeVisualState(node,set){
  if(set.has(node.id)) return 'selected';
  if(spent()>=DATA[currentClass].maxSp) return 'cap';
  if(!tierUnlockedForPurchase(node.tier)) return 'tier';
  if(missingPrereqs(node,set).length) return 'prereq';
  if(activeExclusions(node,set).length) return 'exclusive';
  return 'available';
}

function compactNode(node,set){
  const a=availability(node);
  const visual=nodeVisualState(node,set);
  const b=document.createElement('button');
  const isUpgrade=(node.requires||[]).length>0;
  const isChoice=(node.exclusiveWith||[]).length>0;
  b.type='button';
  b.className=`node skill-node state-${visual}${set.has(node.id)?' selected':''}${!a.ok?' locked':''}${a.exclusive?' exclusive-lock':''}${isUpgrade?' is-upgrade':''}${isChoice?' is-choice':''}`;
  b.dataset.id=node.id;
  b.setAttribute('aria-label',`${node.name}. ${set.has(node.id)?'Purchased':a.reason}`);
  const kind=isChoice?'Branch choice':(isUpgrade?'Upgrade':'Skill');
  b.innerHTML=`
    <div class="icon">${escapeHtml(initials(node.name))}</div>
    <div class="node-copy">
      <div class="node-name">${escapeHtml(node.name)}</div>
      <div class="node-kind">${kind}</div>
    </div>
    <div class="sp-badge">${node.cost||1} SP</div>`;
  b.onclick=()=>toggleNode(node.id);
  bindTooltip(b,node,false);
  return b;
}

renderCore = function(){
  const grid=document.getElementById('grantedGrid');
  grid.innerHTML='';
  DATA[currentClass].core.forEach(n=>{
    const d=document.createElement('div');
    d.className='core-card compact-core';
    d.tabIndex=0;
    d.innerHTML=`<div class="core-mark">${escapeHtml(initials(n.name))}</div><div><b>${escapeHtml(n.name)}</b><span>Granted</span></div>`;
    bindTooltip(d,n,true);
    grid.appendChild(d);
  });
};

renderTree = function(){
  const root=document.getElementById('tree');
  root.innerHTML='';
  root.className='tree unified-tree';
  const classData=DATA[currentClass];
  const set=selectedSet();
  const layout=computeUnifiedLayout(classData);

  const board=document.createElement('div');
  board.className='unified-board';
  board.dataset.className=currentClass;

  const legend=document.createElement('div');
  legend.className='board-legend';
  legend.innerHTML=`
    <span><i class="legend-line prereq"></i>Prerequisite / upgrade</span>
    <span><i class="legend-line choice"></i>Choose one</span>
    <span class="legend-note">Tier gates unlock access; proximity does not create dependencies.</span>`;
  board.appendChild(legend);

  const heads=document.createElement('div');
  heads.className='tier-heads';
  for(let tier=1;tier<=4;tier++){
    const h=document.createElement('div');
    h.className='tier-head'+(tierUnlockedForPurchase(tier)?' unlocked':'');
    h.innerHTML=`<div><span>Tier ${tier}</span><strong>${tier===1?'OPEN':threshold(tier)+' SP'}</strong></div><small>${classData.tierCounts[String(tier)]} investments</small>`;
    heads.appendChild(h);
  }
  board.appendChild(heads);

  const canvas=document.createElement('div');
  canvas.className='unified-canvas';
  canvas.style.setProperty('--rows',layout.totalRows);

  const lanes=document.createElement('div');
  lanes.className='tier-lanes';
  for(let i=1;i<=4;i++){
    const lane=document.createElement('div');
    lane.className='tier-lane';
    lanes.appendChild(lane);
  }
  canvas.appendChild(lanes);

  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.classList.add('board-relations');
  svg.setAttribute('aria-hidden','true');
  canvas.appendChild(svg);

  classData.nodes.forEach(node=>{
    const pos=layout.positions[node.id];
    const b=compactNode(node,set);
    b.style.gridColumn=String(pos.tier);
    b.style.gridRow=String(pos.row);
    canvas.appendChild(b);
  });

  board.appendChild(canvas);
  root.appendChild(board);
  requestAnimationFrame(()=>requestAnimationFrame(()=>drawUnifiedRelations(canvas,set)));
};

function edgePoint(el,canvas,edge){
  const r=el.getBoundingClientRect();
  const base=canvas.getBoundingClientRect();
  const left=r.left-base.left;
  const top=r.top-base.top;
  if(edge==='left') return [left,top+r.height/2];
  if(edge==='right') return [left+r.width,top+r.height/2];
  if(edge==='top') return [left+r.width/2,top];
  if(edge==='bottom') return [left+r.width/2,top+r.height];
  return [left+r.width/2,top+r.height/2];
}

function drawUnifiedRelations(canvas,set){
  const svg=canvas.querySelector('.board-relations');
  if(!svg) return;
  canvas.querySelectorAll('.choice-label').forEach(el=>el.remove());
  const width=canvas.scrollWidth;
  const height=canvas.scrollHeight;
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  svg.setAttribute('width',width);
  svg.setAttribute('height',height);
  svg.innerHTML=`<defs><marker id="board-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 z" /></marker></defs>`;

  const nodeEl=id=>canvas.querySelector(`.skill-node[data-id="${id}"]`);
  const nodes=DATA[currentClass].nodes;

  nodes.forEach(target=>{
    (target.requires||[]).forEach(sourceId=>{
      const source=nodeEl(sourceId), dest=nodeEl(target.id);
      if(!source||!dest) return;
      const sr=source.getBoundingClientRect(), tr=dest.getBoundingClientRect();
      let start,end,d;
      if(Math.abs(sr.left-tr.left)<20){
        start=edgePoint(source,canvas,'bottom');
        end=edgePoint(dest,canvas,'top');
        const bend=Math.max(20,Math.abs(end[1]-start[1])*.42);
        d=`M ${start[0]} ${start[1]} C ${start[0]} ${start[1]+bend}, ${end[0]} ${end[1]-bend}, ${end[0]} ${end[1]}`;
      } else {
        const forward=tr.left>sr.left;
        start=edgePoint(source,canvas,forward?'right':'left');
        end=edgePoint(dest,canvas,forward?'left':'right');
        const bend=Math.max(28,Math.abs(end[0]-start[0])*.40);
        const dir=forward?1:-1;
        d=`M ${start[0]} ${start[1]} C ${start[0]+bend*dir} ${start[1]}, ${end[0]-bend*dir} ${end[1]}, ${end[0]} ${end[1]}`;
      }
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',d);
      path.classList.add('board-prereq');
      if(set.has(sourceId)) path.classList.add('source-owned');
      if(set.has(target.id)) path.classList.add('complete');
      path.setAttribute('marker-end','url(#board-arrow)');
      svg.appendChild(path);
    });
  });

  const seen=new Set();
  nodes.forEach(a=>{
    (a.exclusiveWith||[]).forEach(bId=>{
      const key=[a.id,bId].sort().join('::');
      if(seen.has(key)) return;
      seen.add(key);
      const ae=nodeEl(a.id), be=nodeEl(bId);
      if(!ae||!be) return;
      const ar=ae.getBoundingClientRect(), br=be.getBoundingClientRect();
      const sameColumn=Math.abs(ar.left-br.left)<20;
      let d,labelX,labelY;

      if(sameColumn){
        const aP=edgePoint(ae,canvas,'left');
        const bP=edgePoint(be,canvas,'left');
        const bracketX=Math.min(aP[0],bP[0])-24;
        d=`M ${aP[0]} ${aP[1]} C ${bracketX} ${aP[1]}, ${bracketX} ${bP[1]}, ${bP[0]} ${bP[1]}`;
        labelX=bracketX;
        labelY=(aP[1]+bP[1])/2;
      } else {
        const forward=br.left>ar.left;
        const aP=edgePoint(ae,canvas,forward?'right':'left');
        const bP=edgePoint(be,canvas,forward?'left':'right');
        const bend=Math.max(24,Math.abs(bP[0]-aP[0])*.35);
        const dir=forward?1:-1;
        d=`M ${aP[0]} ${aP[1]} C ${aP[0]+bend*dir} ${aP[1]}, ${bP[0]-bend*dir} ${bP[1]}, ${bP[0]} ${bP[1]}`;
        labelX=(aP[0]+bP[0])/2;
        labelY=(aP[1]+bP[1])/2;
      }

      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',d);
      path.classList.add('board-choice');
      if(set.has(a.id)||set.has(bId)) path.classList.add('choice-made');
      svg.appendChild(path);

      const label=document.createElement('div');
      label.className='choice-label'+(set.has(a.id)||set.has(bId)?' choice-made':'');
      label.textContent='CHOOSE ONE';
      label.style.left=`${labelX}px`;
      label.style.top=`${labelY}px`;
      canvas.appendChild(label);
    });
  });
}

window.addEventListener('resize',()=>{
  const canvas=document.querySelector('.unified-canvas');
  if(canvas) requestAnimationFrame(()=>drawUnifiedRelations(canvas,selectedSet()));
});

render();
