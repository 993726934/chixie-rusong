'use strict';
const $=id=>document.getElementById(id),{scenes,pages}=window.STORY;
let page=0,started=false,ended=false,narrating=false,autoplay=true,saved=0,toastTimer;
try{saved=Math.max(0,Math.min(pages.length-1,Number(localStorage.getItem('rusong-page'))||0));if(localStorage.getItem('rusong-page')!==null)$('resume').hidden=false;}catch{}
const voice=$('voice');
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),4000);}
// Original, procedural pentatonic score. No third-party music or network requests.
class Soundscape{
 constructor(){this.on=false;this.ctx=null;this.step=0;this.scene=0;this.level=.28;}
 async toggle(force){const next=force??!this.on;if(next===this.on)return;
  if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C){toast('此浏览器不支持配乐播放');return;}this.ctx=new C();this.master=this.ctx.createGain();this.master.gain.value=0;this.master.connect(this.ctx.destination);
   const buffer=this.ctx.createBuffer(1,this.ctx.sampleRate*4,this.ctx.sampleRate);const data=buffer.getChannelData(0);let last=0;for(let i=0;i<data.length;i++){last=(last+(Math.random()*2-1)*.02)/1.02;data[i]=last*2;}const source=this.ctx.createBufferSource();source.buffer=buffer;source.loop=true;const filter=this.ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=450;const gain=this.ctx.createGain();gain.gain.value=.18;source.connect(filter).connect(gain).connect(this.master);source.start();
   this.timer=setInterval(()=>this.note(),1900);
  }
  try{await this.ctx.resume();this.on=next;this.volume();if(next)this.note();}catch{toast('配乐暂时无法播放，请再次点击');}
  $('music').textContent='配乐 '+(this.on?'开':'关');$('music').setAttribute('aria-pressed',this.on);document.body.classList.toggle('music-on',this.on);this.label();
 }
 label(){$('music-label').textContent=this.on?(this.scene===6?'低频脉冲 · 失联':'风声 / 五声音阶'):'配乐已关闭';}
 volume(){if(this.ctx)this.master.gain.setTargetAtTime(this.on?this.level*(narrating?.34:.8):0,this.ctx.currentTime,.6);}
 note(){if(!this.on||document.hidden)return;const t=this.ctx.currentTime;const seq=[0,7,12,15,19,12,7,3];const base=[146.83,130.81,146.83,164.81,174.61,130.81,110,146.83][this.scene];const f=base*Math.pow(2,seq[this.step++%seq.length]/12);const osc=this.ctx.createOscillator(),g=this.ctx.createGain();osc.type='sine';osc.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.11,t+.06);g.gain.exponentialRampToValueAtTime(.001,t+5);osc.connect(g).connect(this.master);osc.start(t);osc.stop(t+5.1);osc.onended=()=>{osc.disconnect();g.disconnect();};
  if(this.step%4===0){const o=this.ctx.createOscillator(),v=this.ctx.createGain();o.frequency.value=base/2;v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(.055,t+1);v.gain.linearRampToValueAtTime(0,t+7);o.connect(v).connect(this.master);o.start(t);o.stop(t+7);o.onended=()=>{o.disconnect();v.disconnect();};}
 }
}
const music=new Soundscape();
function updateVoice(){narrating=!voice.paused&&!voice.ended;$('narrate').textContent=narrating?'Ⅱ 暂停旁白':'▷ 旁白';$('narrate').setAttribute('aria-pressed',narrating);music.volume();}
async function playVoice(){try{await voice.play();}catch{toast('旁白未能播放，请点击“旁白”重试');updateVoice();}}
voice.addEventListener('play',updateVoice);voice.addEventListener('pause',updateVoice);
voice.addEventListener('ended',()=>{updateVoice();if(autoplay){if(page<pages.length-1)render(page+1,true);else finish();}});
voice.addEventListener('error',()=>{if(started){toast('旁白音频加载失败，请检查文件或网络后重试');updateVoice();}});
function render(index,play=narrating){
 page=Math.max(0,Math.min(index,pages.length-1));started=true;ended=false;voice.pause();
 const p=pages[page],s=scenes[p.scene];document.body.classList.add('reading');document.body.dataset.scene=s.theme;
 $('intro').hidden=true;$('reader').hidden=false;$('ending').hidden=true;
 $('scene-number').textContent=String(p.scene+1).padStart(2,'0');$('scene-en').textContent=s.en;$('location').textContent=s.location;$('scene-title').textContent=s.title;
 $('passage').replaceChildren(...p.paragraphs.map((text,i)=>{const node=document.createElement('p');node.textContent=text;node.style.animationDelay=`${i*.06}s`;if(text.startsWith('“'))node.className='dialogue';return node;}));
 $('inspect').firstChild.textContent=s.action+' ';$('beat-counter').textContent=`${String(p.part).padStart(2,'0')} / ${String(p.parts).padStart(2,'0')}`;
 $('page-counter').textContent=`${String(page+1).padStart(2,'0')} — ${pages.length}`;$('prev').disabled=page===0;$('next').textContent=page===pages.length-1?'走出第一章 ↗':'继续 →';
 $('progress-label').textContent=`第 ${p.scene+1} 幕 / 共 8 幕`;$('progress').style.width=`${(page+1)/pages.length*100}%`;
 document.querySelectorAll('[data-scene-index]').forEach(b=>{const active=+b.dataset.sceneIndex===p.scene;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 music.scene=p.scene;music.label();voice.src=p.audio;voice.playbackRate=+$('rate').value;if(play)playVoice();
 try{localStorage.setItem('rusong-page',page);}catch{}window.scrollTo({top:0,behavior:'instant'});
}
function enter(index=0){render(index,false);music.toggle(true);}
function finish(){voice.pause();ended=true;$('reader').hidden=true;$('ending').hidden=false;$('progress-label').textContent='第一章 · 完';$('progress').style.width='100%';window.scrollTo({top:0,behavior:'instant'});}
$('begin').onclick=()=>enter();$('resume').onclick=()=>enter(saved);$('restart').onclick=()=>enter();$('back-end').onclick=()=>render(pages.length-1,false);
$('prev').onclick=()=>render(page-1);$('next').onclick=()=>page===pages.length-1?finish():render(page+1);
$('music').onclick=()=>music.toggle();$('volume').oninput=e=>{music.level=+e.target.value/100;music.volume();};
$('narrate').onclick=()=>{if(!started||ended)render(ended?0:page,false);if(voice.paused)playVoice();else voice.pause();};
$('rate').onchange=e=>voice.playbackRate=+e.target.value;$('auto').onclick=()=>{autoplay=!autoplay;$('auto').textContent='连播 '+(autoplay?'开':'关');$('auto').setAttribute('aria-pressed',autoplay);};
document.querySelector('.brand').onclick=e=>{e.preventDefault();voice.pause();started=false;ended=false;$('intro').hidden=false;$('reader').hidden=true;$('ending').hidden=true;document.body.classList.remove('reading');$('progress-label').textContent='序幕';$('progress').style.width='0';saved=page;$('resume').hidden=false;};
for(const [i,s] of scenes.entries()){
 const b=document.createElement('button');b.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span>${s.title}<small>${s.en}</small>`;b.dataset.sceneIndex=i;b.onclick=()=>{$('scene-dialog').close();if(!started)enter(s.first);else render(s.first);};$('scene-list').append(b);
 const dot=document.createElement('button');dot.textContent=String(i+1).padStart(2,'0');dot.title=s.title;dot.setAttribute('aria-label',`第${i+1}幕 ${s.title}`);dot.dataset.sceneIndex=i;dot.onclick=()=>render(s.first);$('scene-rail').append(dot);
}
$('directory').onclick=()=>{$('scene-dialog').showModal();};
document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
const details=[
 ['翻覆的军车','<p>车头扎进泥里，后桥翘着。四个轮子还在微微轻颤。</p><p>没有公路，没有来路。只有雾、水声，与密密的虫鸣。</p><small>场景观察 · 根据本章原文整理</small>'],
 ['消失的伤疤','<p>王浩川额头上的疤不见了。林昭被弹片划过的旧伤，也消失了。</p><p>他们的记忆没有变化。可身体，像被时间往回拨了一截。</p><small>场景观察 · 根据本章原文整理</small>'],
 ['人员清点','<ul><li>林昭 · 已离开驾驶室</li><li>谢长风 · 警戒四周</li><li>王浩川 · 已脱离军车</li><li>马振邦 · 从树丛中出现</li><li>陈素 · 尚在后座</li></ul><small>仅显示当前剧情已知状态</small>'],
 ['后座的一缕光','<p>袖口掩盖住了手，裤脚堆在脚踝处。</p><p>她的作训服大了一号。那位连续值班三天三夜的军医，仍在沉睡。</p><small>场景观察 · 根据本章原文整理</small>'],
 ['随身的小圆镜','<button class="mirror-disc" id="mirror" aria-label="翻开镜子，看向镜中的自己"></button><p class="reveal" id="reflection">轻触镜面</p><small>“我看看我是不是在做梦……”</small>'],
 ['随身物资','<ul><li>五把军用匕首</li><li>五把手枪 · 各配备用弹夹</li><li>手枪弹药 · 一百五十发</li><li>一把微冲 · 六十发</li><li>一把狙击枪 · 十发</li><li>四颗手雷</li><li>两把工兵铲 · 一个望远镜</li><li>陈素的急救包</li></ul><small>物资记录 · 按原文列示</small>'],
 ['全频段静默','<div class="signal-bars" id="bars"><i style="--h:15px"></i><i style="--h:30px"></i><i style="--h:45px"></i><i style="--h:60px"></i><i style="--h:75px"></i></div><p id="signal-result">GPS / 北斗卫星手机 / 移动通讯</p><button id="scan">重新搜索</button><small>剧情内的设备模拟，不会访问你的定位或网络。</small>'],
 ['留在雾里的旧世界','<p>军车已经被树枝遮盖，碎玻璃被拢进车底。</p><p>车钥匙带走了。林昭拔下行车记录仪，揣进口袋。</p><p>前方没有路标。他们只能离开。</p><small>场景观察 · 根据本章原文整理</small>']
];
$('inspect').onclick=()=>{voice.pause();const i=pages[page].scene;const [title,html]=details[i];$('detail-title').textContent=title;$('detail-body').innerHTML=html;$('detail-tag').textContent=`FIELD NOTES / 0${i+1}`;$('detail-dialog').showModal();if(i===4)$('mirror').onclick=()=>{$('reflection').textContent='熟悉的记忆。十五六岁的面容。';};if(i===6)$('scan').onclick=()=>{const b=$('scan'),bars=$('bars'),r=$('signal-result');b.disabled=true;b.textContent='搜索中…';bars.classList.add('scanning');r.textContent='正在尝试建立连接…';setTimeout(()=>{bars.classList.remove('scanning');r.textContent='无信号。连忙音都没有。';b.textContent='再次尝试';b.disabled=false;},2200);};};
document.addEventListener('keydown',e=>{if(!started||ended||document.querySelector('dialog[open]')||/INPUT|SELECT|BUTTON|A/.test(e.target.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();$('next').click();}if(e.key==='ArrowLeft'){e.preventDefault();if(page>0)render(page-1);}if(e.code==='Space'){e.preventDefault();$('narrate').click();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){voice.pause();if(music.ctx)music.ctx.suspend();}else if(music.ctx&&music.on)music.ctx.resume().catch(()=>{});});
// Sparse ambient particles; disabled for reduced-motion preference.
const canvas=$('motes'),ctx=canvas.getContext('2d');let w,h;function size(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;}size();window.addEventListener('resize',size);
const dots=Array.from({length:30},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.2+.2,v:Math.random()*.00008+.00002}));
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){let last=0;function frame(t){if(t-last>45&&!document.hidden){last=t;ctx.clearRect(0,0,w,h);for(const d of dots){d.x=(d.x+d.v)%1;d.y-=d.v*.25;if(d.y<0)d.y=1;ctx.fillStyle='#c3d0b055';ctx.beginPath();ctx.arc(d.x*w,d.y*h,d.r,0,Math.PI*2);ctx.fill();}}requestAnimationFrame(frame);}requestAnimationFrame(frame);}
