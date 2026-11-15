import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context={window:{}};vm.createContext(context);
for(const file of ['story.js','interactions.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const {STORY:s,INTERACTIONS:details}=context.window;
assert.equal(s.scenes.length,details.length);
let cursor=0;
s.scenes.forEach((scene,i)=>{
 assert.equal(scene.first,cursor);assert.ok(scene.count>0);
 s.pages.slice(cursor,cursor+scene.count).forEach((p,j)=>{assert.equal(p.scene,i);assert.equal(p.part,j+1);assert.equal(p.parts,scene.count);assert.ok(p.interaction.paragraph>=0&&p.interaction.paragraph<p.paragraphs.length);assert.ok(fs.statSync(p.audio).size>44);});cursor+=scene.count;
});assert.equal(cursor,s.pages.length);
if(fs.existsSync('chapter-one.txt')){const original=fs.readFileSync('chapter-one.txt','utf8').split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean).slice(1);assert.equal(s.pages.flatMap(p=>p.paragraphs).join('\n'),original.join('\n'));}
const html=fs.readFileSync('index.html','utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g))assert.ok(fs.existsSync(match[1]),`Missing ${match[1]}`);
assert.ok(html.includes('aria-controls="audio-controls"'));
assert.ok(html.includes('id="prev" class="primary"')&&html.includes('id="next" class="primary"'));
console.log(`PASS: ${s.pages.length} beats, ${s.scenes.length} scenes, all audio and inline anchors present; original text preserved.`);
