const relationBaseRenderTree = renderTree;

renderTree = function(){
  relationBaseRenderTree();
  requestAnimationFrame(()=>requestAnimationFrame(renderSkillRelations));
};

function renderSkillRelations(){
  const root=document.getElementById('tree');
  if(!root) return;

  root.querySelectorAll('.relation-overlay,.branch-choice-label,.relation-legend').forEach(el=>el.remove());
  addRelationLegend(root);

  // Fighter already uses its dedicated horizontal prerequisite renderer.
  if(currentClass==='Fighter') return;

  root.classList.add('relation-tree');
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.classList.add('relation-overlay');
  svg.setAttribute('aria-hidden','true');

  const width=root.scrollWidth;
  const height=root.scrollHeight;
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  svg.setAttribute('width',width);
  svg.setAttribute('height',height);
  svg.innerHTML=`
    <defs>
      <marker id="relation-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L9,4.5 L0,9 z" class="relation-arrow-head" />
      </marker>
    </defs>`;
  root.prepend(svg);

  const set=selectedSet();
  const nodes=DATA[currentClass].nodes;

  nodes.forEach(target=>{
    target.requires.forEach(sourceId=>drawPrerequisite(svg,root,sourceId,target.id,set));
  });

  const seen=new Set();
  nodes.forEach(node=>{
    node.exclusiveWith.forEach(otherId=>{
      const key=[node.id,otherId].sort().join('::');
      if(seen.has(key)) return;
      seen.add(key);
      drawExclusiveChoice(svg,root,node.id,otherId,set);
    });
  });
}

function addRelationLegend(root){
  const legend=document.createElement('div');
  legend.className='relation-legend';
  legend.innerHTML=`
    <span><i class="legend-line prerequisite"></i>Prerequisite / upgrade</span>
    <span><i class="legend-line exclusive"></i>CHOOSE ONE — mutually exclusive</span>`;

  if(currentClass==='Fighter'){
    const board=document.querySelector('.fighter-board');
    const note=board?.querySelector('.board-note');
    if(note) note.insertAdjacentElement('afterend',legend);
    else root.prepend(legend);
  } else {
    root.prepend(legend);
  }
}

function nodeElement(root,id){
  return root.querySelector(`.node[data-id="${CSS.escape(id)}"]`);
}

function pointFor(el,root,edge){
  const r=el.getBoundingClientRect();
  const base=root.getBoundingClientRect();
  const left=r.left-base.left+root.scrollLeft;
  const top=r.top-base.top+root.scrollTop;
  if(edge==='top') return [left+r.width/2,top];
  if(edge==='bottom') return [left+r.width/2,top+r.height];
  if(edge==='left') return [left,top+r.height/2];
  if(edge==='right') return [left+r.width,top+r.height/2];
  return [left+r.width/2,top+r.height/2];
}

function drawPrerequisite(svg,root,sourceId,targetId,set){
  const source=nodeElement(root,sourceId);
  const target=nodeElement(root,targetId);
  if(!source||!target) return;

  const sr=source.getBoundingClientRect();
  const tr=target.getBoundingClientRect();
  const vertical=tr.top>=sr.bottom-10;
  let start,end,d;

  if(vertical){
    start=pointFor(source,root,'bottom');
    end=pointFor(target,root,'top');
    const bend=Math.max(24,(end[1]-start[1])*.48);
    d=`M ${start[0]} ${start[1]} C ${start[0]} ${start[1]+bend}, ${end[0]} ${end[1]-bend}, ${end[0]} ${end[1]}`;
  } else {
    const leftToRight=tr.left>=sr.right;
    start=pointFor(source,root,leftToRight?'right':'left');
    end=pointFor(target,root,leftToRight?'left':'right');
    const bend=Math.max(24,Math.abs(end[0]-start[0])*.42);
    const dir=leftToRight?1:-1;
    d=`M ${start[0]} ${start[1]} C ${start[0]+bend*dir} ${start[1]}, ${end[0]-bend*dir} ${end[1]}, ${end[0]} ${end[1]}`;
  }

  const path=document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d',d);
  path.classList.add('relation-prereq');
  if(set.has(sourceId)) path.classList.add('source-owned');
  if(set.has(targetId)) path.classList.add('complete');
  path.setAttribute('marker-end','url(#relation-arrow)');
  svg.appendChild(path);

  source.classList.add('has-dependent');
  target.classList.add('has-prerequisite');
}

function drawExclusiveChoice(svg,root,aId,bId,set){
  const a=nodeElement(root,aId);
  const b=nodeElement(root,bId);
  if(!a||!b) return;

  a.classList.add('branch-choice');
  b.classList.add('branch-choice');

  const ar=a.getBoundingClientRect();
  const br=b.getBoundingClientRect();
  const aLeft=ar.left<=br.left;
  const start=pointFor(a,root,aLeft?'right':'left');
  const end=pointFor(b,root,aLeft?'left':'right');
  const midX=(start[0]+end[0])/2;
  const midY=(start[1]+end[1])/2;

  const path=document.createElementNS('http://www.w3.org/2000/svg','path');
  const bend=Math.max(18,Math.abs(end[0]-start[0])*.2);
  const dir=end[0]>=start[0]?1:-1;
  path.setAttribute('d',`M ${start[0]} ${start[1]} C ${start[0]+bend*dir} ${start[1]}, ${end[0]-bend*dir} ${end[1]}, ${end[0]} ${end[1]}`);
  path.classList.add('relation-exclusive');
  if(set.has(aId)||set.has(bId)) path.classList.add('choice-made');
  svg.appendChild(path);

  const label=document.createElement('div');
  label.className='branch-choice-label'+(set.has(aId)||set.has(bId)?' choice-made':'');
  label.textContent='CHOOSE ONE';
  label.style.left=`${midX}px`;
  label.style.top=`${midY}px`;
  root.appendChild(label);
}

window.addEventListener('resize',()=>requestAnimationFrame(renderSkillRelations));

render();
