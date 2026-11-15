import vm from 'node:vm';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const context={window:{}};vm.createContext(context);
for(const file of ['chronicle-data.js','chronicle-core.js','story.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const {CHRONICLE_DATA:data,ChronicleCore:core,STORY:story}=context.window;
const ids=[...data.places,...data.achievements].map(i=>i.id);assert.equal(new Set(ids).size,ids.length);
assert.equal(new Set(data.triggers.map(t=>t.id)).size,data.triggers.length);
for(const t of data.triggers){assert.ok(t.chapter&&t.anchor&&t.source);t.unlocks.forEach(id=>assert.ok(ids.includes(id)));if(t.chapter===story.chapter.id)assert.equal(story.pages.flatMap(p=>p.paragraphs).filter(p=>p===t.anchor).length,1);}
for(const route of data.routes)route.forEach(id=>assert.ok(data.places.some(p=>p.id===id)));
const engine=core.create(data,null);assert.equal(engine.snapshot().records.length,0);
assert.equal(engine.encounter('ch02',data.triggers[0].anchor).length,0,'wrong chapter must not trigger');
assert.equal(engine.encounter('ch01','军车是斜着倒扣在山谷里的。提到手榴弹、进士。').length,0,'keyword mentions must not trigger');
assert.equal(engine.encounter('ch01',data.triggers[0].anchor).length,1);
assert.ok(engine.has('place-valley'));assert.equal(engine.encounter('ch01',data.triggers[0].anchor).length,0,'re-reading is idempotent');
assert.ok(core.create(data,engine.snapshot()).has('place-valley'));
assert.equal(core.create(data,{version:1,records:[{id:'tech-grenade',event:'ch01-valley-contact'}]}).has('tech-grenade'),false);
assert.equal(core.create(data,{version:99,records:engine.snapshot().records}).snapshot().records.length,0);
assert.equal(core.create(data,{version:1,records:[null,5,'bad']}).snapshot().records.length,0);
// Synthetic future chapter checks: separate characters, no retroactive grants when jumping.
const future={...data,triggers:[...data.triggers,{id:'lin-appointed',chapter:'volume02-ch05',anchor:'林昭正式受任。',unlocks:['career-lin-jinglue'],source:'测试章'},{id:'wang-appointed',chapter:'volume02-ch06',anchor:'王浩川正式受任。',unlocks:['career-wang-tongpan'],source:'测试章'},{id:'technology-ready',chapter:'volume02-ch07',anchor:'首次试飞完成。',unlocks:['tech-balloon'],source:'测试章'}]};
const next=core.create(future,null);next.encounter('volume02-ch06','王浩川正式受任。');assert.ok(next.has('career-wang-tongpan'));assert.ok(!next.has('career-lin-jinglue'));assert.ok(!next.has('place-valley'));next.encounter('volume02-ch07','首次试飞完成。');assert.ok(next.has('tech-balloon'));assert.equal(next.snapshot().records.length,2);
console.log('PASS: fog at start, exact chapter/paragraph triggers, no mention-based awards, repeat safety, persistence, malformed saves, character isolation and future technology unlocks.');
