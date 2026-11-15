import fs from 'node:fs';
const raw=fs.readFileSync('chapter-one.txt','utf8');
const paras=raw.split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean).slice(1);
const scenes=[
 ['坠入雾谷','THE FALL','军车是斜着倒扣在山谷里的。','valley','谷底 · 坐标未知','查看翻覆军车'],
 ['时间的裂隙','THE FRACTURE','林昭回头看见王浩川','faces','谷底 · 异常发生','查看消失的伤疤'],
 ['寻找第五个人','THE MISSING','林昭最先回过神','search','军车旁 · 人员搜索','查看人员状态'],
 ['沉睡的人','THE SLEEPER','“快！救人！”','sleep','后座 · 微光之中','观察后座'],
 ['镜中的陌生人','THE MIRROR','就在这时，怀里的','mirror','林间 · 身份确认','拿起小圆镜'],
 ['进入战备','THE CHECK','林昭被这问题','gear','谷底 · 重新集结','清点随身物资'],
 ['失联','NO SIGNAL','王浩川蹲在地上','signal','未知区域 · 全频段静默','尝试搜索信号'],
 ['走入未知','THE UNKNOWN','几个人动手，','leave','密林 · 去向未知','查看离开前的记录']
];
let starts=scenes.map(s=>paras.findIndex(p=>p.startsWith(s[2])));
if(starts.some(x=>x<0))throw new Error('Scene boundary missing');
let pages=[];
const anchorTerms=[['军车','车头','驾驶室'],['疤','脸','年轻'],['陈素','马振邦','找人'],['后座','作训服','陈素'],['小圆镜','镜子','眼睛'],['装备','匕首','战备'],['gps','卫星','设备'],['行车记录仪','树枝','军车']];
const out=scenes.map((s,i)=>{
 const content=paras.slice(starts[i],starts[i+1]??paras.length);let chunks=[],part=[];
 for(const p of content){if(part.join('').length+p.length>260&&part.length){chunks.push(part);part=[];}part.push(p);}if(part.length)chunks.push(part);
 const first=pages.length;
 chunks.forEach((p,j)=>{
  let paragraph=-1;
  for(const word of anchorTerms[i]){paragraph=p.findIndex(t=>t.includes(word));if(paragraph>=0)break;}
  pages.push({scene:i,paragraphs:p,audio:`assets/voice-${String(pages.length).padStart(2,'0')}.wav`,part:j+1,parts:chunks.length,interaction:{paragraph:Math.max(0,paragraph),label:s[5]}});
 });
 return {title:s[0],en:s[1],theme:s[3],location:s[4],action:s[5],first,count:chunks.length};
});
fs.writeFileSync('story.js','window.STORY='+JSON.stringify({chapter:{id:'ch01',title:'被扔进的世界'},scenes:out,pages})+';');
fs.writeFileSync('tools/narration.json',JSON.stringify(pages.map(p=>({file:p.audio,text:p.paragraphs.join('\n')})),null,2));
if(pages.flatMap(p=>p.paragraphs).join('')!==paras.join(''))throw new Error('Text integrity failure');
console.log(`${paras.length} original paragraphs preserved in ${pages.length} reading beats, ${out.length} scenes.`);
