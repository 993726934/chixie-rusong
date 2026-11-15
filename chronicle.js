(function(){
 'use strict';
 const data=window.CHRONICLE_DATA,$=id=>document.getElementById(id),key='rusong-chronicle-v1';
 let saved=null,storageOK=true;try{saved=JSON.parse(localStorage.getItem(key)||'null');}catch{storageOK=false;}
 let engine=window.ChronicleCore.create(data,saved),category='technology',person='all';
 const dialog=$('chronicle-dialog'),svgNS='http://www.w3.org/2000/svg';
 function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
 function svg(tag,attributes){const node=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attributes))node.setAttribute(k,v);return node;}
 function sourceOf(id){return data.triggers.find(t=>t.id===engine.record(id)?.event)?.source||'';}
 function persist(){try{localStorage.setItem(key,JSON.stringify(engine.snapshot()));storageOK=true;}catch{storageOK=false;}$('collection-storage').textContent=storageOK?'探索记录保存在当前浏览器；重读不会丢失。':'浏览器无法保存记录，本次探索仍然有效，关闭页面后可能丢失。';}
 function counters(){const p=data.places.filter(i=>engine.has(i.id)).length,a=data.achievements.filter(i=>engine.has(i.id)).length;$('map-count').textContent=p;$('achievement-count').textContent=a;$('map-progress').textContent=`已探索 ${p} / ${data.places.length} 处`;$('achievement-progress').textContent=`已达成 ${a} / ${data.achievements.length} 项`;}
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
  const items=data.achievements.filter(item=>item.category===category&&(category!=='career'||person==='all'||item.person===person));
  $('career-filter').hidden=category!=='career';
  $('achievement-empty').hidden=items.some(i=>engine.has(i.id));
  $('achievement-empty').textContent=category==='technology'?'这一页历史尚未写下。读到首次研制成功的剧情后，科技成就会在这里点亮。':'功名尚在故事深处。读到本人获得身份、正式授职或晋升的剧情后，留下履历。';
  for(const item of items){const unlocked=engine.has(item.id),card=element('article',`achievement-card ${unlocked?'earned':'locked'}`);card.append(element('span','achievement-seal',unlocked?(category==='technology'?'工':'仕'):'?'),element('small','collection-kicker',category==='technology'?'科技':'官职 · '+item.person),element('h3','',unlocked?item.name:'未解锁的历史'),element('p','',unlocked?item.description:'继续阅读，揭开这一段故事。'));if(unlocked)card.append(element('small','',sourceOf(item.id)));grid.append(card);}
  document.querySelectorAll('[data-achievement-category]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.achievementCategory===category));
 }
 function showPanel(tab){$('map-panel').hidden=tab!=='map';$('achievements-panel').hidden=tab!=='achievements';document.querySelectorAll('[data-collection-tab]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.collectionTab===tab));counters();drawMap();drawAchievements();}
 function open(tab){document.getElementById('voice').pause();showPanel(tab);showPlace(data.places.find(i=>engine.has(i.id))||data.places[0]);persist();dialog.showModal();}
 $('open-map').onclick=()=>open('map');$('open-achievements').onclick=()=>open('achievements');
 document.querySelectorAll('[data-collection-tab]').forEach(b=>b.onclick=()=>showPanel(b.dataset.collectionTab));
 document.querySelectorAll('[data-achievement-category]').forEach(b=>b.onclick=()=>{category=b.dataset.achievementCategory;drawAchievements();});
 $('career-person').onchange=e=>{person=e.target.value;drawAchievements();};
 // Only a rendered paragraph, in the foreground and outside a modal, can trigger discovery.
 let observer=null,current=[];let notificationTimer;
 function announce(items){const notice=$('discovery-notice');notice.replaceChildren(element('span','collection-kicker','新的历史已被点亮'),element('strong','',items.map(i=>i.name).join(' · ')));const button=element('button','','查看 →');button.onclick=()=>{notice.hidden=true;open(items[0].category?'achievements':'map');};notice.append(button);notice.hidden=false;clearTimeout(notificationTimer);notificationTimer=setTimeout(()=>notice.hidden=true,7000);}
 function encounter(entry){const added=engine.encounter(entry.chapter,entry.text);if(!added.length)return;persist();counters();announce(added);}
 function observe(){observer?.disconnect();if(!('IntersectionObserver' in window))return;
  observer=new IntersectionObserver(entries=>{if(document.hidden||document.querySelector('dialog[open]'))return;for(const entry of entries){if(entry.isIntersecting&&entry.intersectionRatio>=.55){const item=current.find(p=>p.node===entry.target);if(item)encounter(item);}}},{threshold:[.55],rootMargin:'0px 0px -110px 0px'});
  current.forEach(item=>observer.observe(item.node));
 }
 window.addEventListener('story:render',e=>{current=e.detail.paragraphs;observe();});
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',observe));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)observe();});
 window.addEventListener('storage',e=>{if(e.key!==key||!e.newValue)return;try{const incoming=window.ChronicleCore.create(data,JSON.parse(e.newValue));const records=new Map([...engine.snapshot().records,...incoming.snapshot().records].map(r=>[r.id,r]));engine=window.ChronicleCore.create(data,{version:1,records:[...records.values()]});counters();if(dialog.open){drawMap();drawAchievements();}}catch{}});
 // Explicit reading controls also mark the current beat read, including in older browsers.
 window.addEventListener('story:complete-beat',()=>current.forEach(encounter));
 counters();persist();
})();
