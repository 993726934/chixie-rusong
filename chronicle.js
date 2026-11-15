(function(){
 'use strict';
 const data=window.CHRONICLE_DATA,$=id=>document.getElementById(id),key='rusong-chronicle-v1';
 let saved=null,storageOK=true;try{saved=JSON.parse(localStorage.getItem(key)||'null');}catch{storageOK=false;}
 let engine=window.ChronicleCore.create(data,saved),category='technology',person='all',selectedCharacter;
 const dialog=$('chronicle-dialog'),svgNS='http://www.w3.org/2000/svg';
 function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
 function svg(tag,attributes){const node=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attributes))node.setAttribute(k,v);return node;}
 function sourceOf(id){return data.triggers.find(t=>t.id===engine.record(id)?.event)?.source||'';}
 function persist(){try{localStorage.setItem(key,JSON.stringify(engine.snapshot()));storageOK=true;}catch{storageOK=false;}$('collection-storage').textContent=storageOK?'探索记录保存在当前浏览器；重读不会丢失。':'浏览器无法保存记录，本次探索仍然有效，关闭页面后可能丢失。';}
 function counters(){const p=data.places.filter(i=>engine.has(i.id)).length,a=data.achievements.filter(i=>engine.has(i.id)).length;$('map-count').textContent=p;$('achievement-count').textContent=a;$('map-progress').textContent=`已探索 ${p} / ${data.places.length} 处`;$('relationship-count').textContent=data.characters.filter(i=>engine.has(i.id)).length;}
 function showPlace(item){const panel=$('map-detail');panel.replaceChildren();if(!engine.has(item.id)){panel.append(element('span','collection-kicker','UNEXPLORED'),element('h3','','雾中之地'),element('p','','这片区域仍藏在迷雾中。读到与这里首次接触的剧情，地名与记录才会显现。'));return;}panel.append(element('span','collection-kicker','DISCOVERED'),element('h3','',item.name),element('p','',item.description||'你已读到与此地首次接触的剧情。'),element('small','',sourceOf(item.id)));}
 function drawMap(){
  const map=$('story-map');map.replaceChildren();
  const canvas=svg('svg',{viewBox:'0 0 100 100',preserveAspectRatio:'none','aria-hidden':'true',class:'map-terrain'});
  canvas.append(svg('path',{d:'M4 13 Q30 33 48 23 T94 40 M12 48 Q39 41 62 68 T95 81',class:'terrain-ridge'}));
  data.places.forEach(item=>canvas.append(svg('polygon',{points:item.region,class:engine.has(item.id)?'map-region revealed':'map-region fogged'})));
  for(const [a,b] of data.routes){if(!engine.has(a)||!engine.has(b))continue;const first=data.places.find(p=>p.id===a),last=data.places.find(p=>p.id===b);canvas.append(svg('path',{d:`M${first.x} ${first.y} Q${first.x} ${last.y} ${last.x} ${last.y}`,class:'map-route'}));}
  map.append(canvas,element('div','map-fog'));
  data.places.forEach((item,i)=>{const unlocked=engine.has(item.id),button=element('button',`map-pin ${unlocked?'discovered':'unknown'}`);button.style.left=item.x+'%';button.style.top=item.y+'%';button.setAttribute('aria-label',unlocked?`查看${item.name}`:`迷雾区域 ${i+1}，尚未探索`);button.append(element('span','pin-symbol',unlocked?'◇':'·'),element('span','pin-label',unlocked?item.name:'未探索'));button.onclick=()=>showPlace(item);map.append(button);});
 }
 function drawAchievements(){
  const grid=$('achievement-grid');grid.replaceChildren();
  const items=data.achievements.filter(item=>item.category===category&&(person==='all'||(item.people??[item.person]).includes(person)));
  const earned=items.filter(item=>engine.has(item.id)).length;
  $('achievement-progress').textContent=`已达成 ${earned} / ${items.length} 项`;
  $('achievement-empty').hidden=earned>0;
  $('achievement-empty').textContent=category==='technology'?'这一页历史尚未写下。读到首次研制成功的剧情后，科技成就会在这里点亮。':'功名尚在故事深处。读到本人获得身份、正式授职或晋升的剧情后，留下履历。';
  if(!items.length)$('achievement-empty').textContent='该人物暂无已编排的此类成就。';
  for(const item of items){const unlocked=engine.has(item.id),card=element('article',`achievement-card ${unlocked?'earned':'locked'}`);card.append(element('span','achievement-seal',unlocked?(category==='technology'?'工':'仕'):'?'),element('small','collection-kicker',category==='technology'?'科技':'官职 · '+item.person),element('h3','',unlocked?item.name:'未解锁的历史'),element('p','',unlocked?item.description:'继续阅读，揭开这一段故事。'));if(unlocked)card.append(element('small','',sourceOf(item.id)));grid.append(card);}
  document.querySelectorAll('[data-achievement-category]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.achievementCategory===category));
 }
 function drawRelationships(){
  const appeared=data.characters.filter(item=>engine.has(item.id));
  const edges=engine.visibleRelationships();
  $('cast-progress').textContent=`已结识 ${appeared.length} 人 · 已记录 ${edges.length} 条关系`;
  $('cast-empty').hidden=appeared.length>0;
  $('cast-content').hidden=!appeared.length;
  if(!appeared.length)return;

  const currentCharacter=appeared.find(item=>item.id===selectedCharacter)||appeared[0];
  selectedCharacter=currentCharacter.id;
  const roster=$('cast-roster'),graph=$('cast-graph'),detail=$('cast-detail');
  function choose(id,fromGraph=false){
   selectedCharacter=id;
   drawRelationships();
   const group=fromGraph?graph:roster;
   [...group.querySelectorAll('button')].find(button=>button.dataset.character===id)?.focus();
  }
  function characterButton(item,style,fromGraph){
   const button=element('button',style,item.name);
   button.dataset.character=item.id;
   button.setAttribute('aria-pressed',item.id===selectedCharacter);
   button.onclick=()=>choose(item.id,fromGraph);
   return button;
  }
  roster.replaceChildren(...appeared.map(item=>characterButton(item,'cast-choice',false)));

  const connections=edges.filter(edge=>edge.from===selectedCharacter||edge.to===selectedCharacter);
  const neighbours=new Map();
  for(const edge of connections){
   const otherId=edge.from===selectedCharacter?edge.to:edge.from;
   if(!neighbours.has(otherId))neighbours.set(otherId,[]);
   neighbours.get(otherId).push(edge);
  }
  const rows=Math.max(1,Math.ceil(neighbours.size/2));
  graph.style.minHeight=`${Math.max(210,rows*80+32)}px`;
  const lines=svg('svg',{viewBox:'0 0 100 100',preserveAspectRatio:'none','aria-hidden':'true'});
  graph.replaceChildren(lines);
  function addNode(item,x,y){
   const node=characterButton(item,'cast-node',true);
   node.style.left=`${x}%`;
   node.style.top=`${y}%`;
   graph.append(node);
   return node;
  }
  addNode(currentCharacter,50,50);
  [...neighbours].forEach(([id,relations],index)=>{
   const item=appeared.find(character=>character.id===id);
   const x=index%2===0?18:82;
   const y=(Math.floor(index/2)+.5)*100/rows;
   lines.append(svg('line',{x1:50,y1:50,x2:x,y2:y,'vector-effect':'non-scaling-stroke'}));
   addNode(item,x,y).setAttribute('aria-label',`${item.name} · ${relations.map(edge=>edge.name).join('、')}`);
  });

  detail.replaceChildren(element('h3','',currentCharacter.name),element('p','cast-location',`首次出场 · ${currentCharacter.location}`),element('p','',currentCharacter.description),element('small','',sourceOf(selectedCharacter)),element('h4','','已知关系'));
  if(!connections.length){detail.append(element('p','','这位人物的关系尚未在已读情节中揭晓。'));return;}
  const list=element('ul','cast-relations');
  for(const [id,relations] of neighbours)for(const edge of relations){
   const entry=element('li');
   entry.append(element('strong','',`${appeared.find(item=>item.id===id).name} · ${edge.name}`),element('p','',edge.description),element('small','',sourceOf(edge.id)));
   list.append(entry);
  }
  detail.append(list);
 }
 function showPanel(tab){
  $('map-panel').hidden=tab!=='map';
  $('achievements-panel').hidden=tab!=='achievements';
  $('relationships-panel').hidden=tab!=='relationships';
  document.querySelectorAll('[data-collection-tab]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.collectionTab===tab));
  counters();
  if(tab==='map'){drawMap();showPlace(data.places.find(i=>engine.has(i.id))||data.places[0]);}
  if(tab==='achievements')drawAchievements();
  if(tab==='relationships')drawRelationships();
 }
 function open(tab){$('voice').pause();showPanel(tab);persist();dialog.showModal();}
 $('open-map').onclick=()=>open('map');$('open-achievements').onclick=()=>open('achievements');
 $('open-relationships').onclick=()=>open('relationships');
 for(const item of data.characters.filter(character=>character.protagonist))$('career-person').add(new Option(item.name,item.name));
 document.querySelectorAll('[data-collection-tab]').forEach(b=>b.onclick=()=>showPanel(b.dataset.collectionTab));
 document.querySelectorAll('[data-achievement-category]').forEach(b=>b.onclick=()=>{category=b.dataset.achievementCategory;drawAchievements();});
 $('career-person').onchange=e=>{person=e.target.value;drawAchievements();};
 // Only a rendered paragraph, in the foreground and outside a modal, can trigger discovery.
 let observer=null,current=[];let notificationTimer;
 function announce(items){
  const item=items[0],notice=$('discovery-notice');
  const tab=item.location||item.from?'relationships':item.category?'achievements':'map';
  notice.replaceChildren(element('span','collection-kicker','新增档案'),element('strong','',items.map(entry=>entry.name).join(' · ')));
  const button=element('button','','查看 →');
  button.onclick=()=>{
   notice.hidden=true;
   if(item.location)selectedCharacter=item.id;
   if(item.from)selectedCharacter=item.from;
   if(item.category){category=item.category;person='all';$('career-person').value=person;}
   open(tab);
  };
  notice.append(button);notice.hidden=false;clearTimeout(notificationTimer);notificationTimer=setTimeout(()=>notice.hidden=true,7000);
 }
 function encounter(entry){const added=engine.encounter(entry.chapter,entry.text);if(!added.length)return;persist();counters();const visible=added.filter(item=>!item.from||engine.visibleRelationships().includes(item));if(visible.length)announce(visible);}
 function observe(){observer?.disconnect();if(!('IntersectionObserver' in window))return;
  observer=new IntersectionObserver(entries=>{if(document.hidden||document.querySelector('dialog[open]'))return;for(const entry of entries){if(entry.isIntersecting&&entry.intersectionRatio>=.55){const item=current.find(p=>p.node===entry.target);if(item)encounter(item);}}},{threshold:[.55],rootMargin:'0px 0px -110px 0px'});
  current.forEach(item=>observer.observe(item.node));
 }
 window.addEventListener('story:render',e=>{current=e.detail.paragraphs;observe();});
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',observe));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)observe();});
 window.addEventListener('storage',e=>{if(e.key!==key||!e.newValue)return;try{const incoming=window.ChronicleCore.create(data,JSON.parse(e.newValue));const records=new Map([...engine.snapshot().records,...incoming.snapshot().records].map(r=>[r.id,r]));engine=window.ChronicleCore.create(data,{version:1,records:[...records.values()]});counters();if(dialog.open){const activeTab=dialog.querySelector('[data-collection-tab][aria-pressed="true"]');showPanel(activeTab.dataset.collectionTab);}}catch{}});
 // Explicit reading controls also mark the current beat read, including in older browsers.
 window.addEventListener('story:complete-beat',()=>current.forEach(encounter));
 counters();persist();
})();
