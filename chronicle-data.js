// Stable IDs are shared across chapters. Pending entries have no live trigger.
window.CHRONICLE_DATA = {
 version:1,
 places:[
  {id:'place-valley',name:'无名山谷',subtitle:'被扔进的世界',description:'翻覆的军车，贴地的雾气。五个人的故事从这里开始。',x:14,y:76,region:'4,61 23,55 31,72 22,93 5,93'},
  {id:'place-qinghe-village',name:'清河村',x:32,y:59,region:'23,35 43,36 48,57 38,74 23,55'},
  {id:'place-longcheng',name:'陇城县',x:51,y:73,region:'38,74 48,57 66,61 69,88 45,95'},
  {id:'place-qinghe-county',name:'清河县',x:56,y:40,region:'43,36 48,16 65,13 73,36 66,61 48,57'},
  {id:'place-yaojia',name:'药家部山匪',x:29,y:22,region:'8,8 35,5 48,16 43,36 23,35 7,46'},
  {id:'place-linhe',name:'临河州',x:79,y:53,region:'73,36 94,28 96,67 69,88 66,61'},
  {id:'place-capital',name:'京都',x:83,y:17,region:'65,13 81,3 95,8 94,28 73,36'}
 ],
 routes:[['place-valley','place-qinghe-village'],['place-qinghe-village','place-longcheng'],['place-longcheng','place-qinghe-county'],['place-qinghe-county','place-yaojia'],['place-yaojia','place-linhe'],['place-linhe','place-capital']],
 achievements:[
  {id:'tech-hand-crossbow',category:'technology',people:['马振邦'],name:'手弩',description:'第一次完成手弩的制作与验证。'},
  {id:'tech-qinghe-crossbow',category:'technology',name:'清河弩',description:'清河弩成为可使用的成果。'},
  {id:'tech-grenade',category:'technology',name:'手榴弹',description:'第一次完成本地研制的手榴弹。'},
  {id:'tech-light-artillery',category:'technology',name:'轻型火炮',description:'轻型火炮首次制成并投入使用。'},
  {id:'tech-folangji',category:'technology',name:'佛朗基炮',description:'佛朗基炮首次研制成功。'},
  {id:'tech-balloon',category:'technology',name:'热气球',description:'热气球首次试飞成功。'},
  {id:'career-lin-shetou',category:'career',person:'林昭',name:'社头',description:'林昭正式担起清河村社头之职。'},
  {id:'career-lin-magistrate',category:'career',person:'林昭',name:'知县',description:'林昭正式受任知县。'},
  {id:'career-lin-jinglue',category:'career',person:'林昭',name:'五品经略使',description:'林昭晋升至经略使这一阶段。'},
  {id:'career-wang-jinshi',category:'career',person:'王浩川',name:'进士出身',description:'王浩川取得进士出身。'},
  {id:'career-wang-zhubu',category:'career',person:'王浩川',name:'宗正寺主簿',description:'王浩川正式受任宗正寺主簿。'},
  {id:'career-wang-tongpan',category:'career',person:'王浩川',name:'六品通判',description:'王浩川晋升至通判这一阶段。'}
 ],
 characters:[
  {id:'person-lin',name:'林昭',protagonist:true,location:'无名山谷 · 军车驾驶室',description:'队长。翻车后从变形的驾驶室撑了出来。'},
  {id:'person-wang',name:'王浩川',protagonist:true,location:'无名山谷 · 军车另一侧驾驶门',description:'翻车时的驾驶员，从另一侧车门爬了出来。'},
  {id:'person-xie',name:'谢长风',protagonist:true,location:'无名山谷 · 军车车尾',description:'从翻倒的军车车尾脱身，落地后立刻环顾四周。'},
  {id:'person-chen',name:'陈素',protagonist:true,location:'无名山谷 · 军车后座',description:'队里的军医。林昭在后座发现了仍在沉睡的她。'},
  {id:'person-ma',name:'马振邦',protagonist:true,location:'无名山谷 · 军车旁的树丛',description:'大家称他马工。翻车后，他从车旁的树丛中爬出来。'}
 ],
 relationships:[
  {id:'relation-xie-lin',from:'person-xie',to:'person-lin',name:'队员与队长',description:'谢长风打算上前查看林昭，听到队长的命令后停下。'},
  {id:'relation-wang-lin',from:'person-wang',to:'person-lin',name:'同队 · 驾驶员与队长',description:'两人先后离开驾驶室，林昭向王浩川询问翻车经过。'},
  {id:'relation-ma-lin',from:'person-ma',to:'person-lin',name:'同行队友',description:'林昭在车头方向寻找马振邦，马振邦从树丛中现身。'},
  {id:'relation-chen-lin',from:'person-chen',to:'person-lin',name:'救援 · 队长与军医',description:'林昭探进翻覆的车厢，把陈素从后座抱了出来。'}
 ],
 triggers:[
  {id:'ch01-valley-contact',chapter:'ch01',anchor:'军车是斜着倒扣在山谷里的。',unlocks:['place-valley'],source:'第一章 · 被扔进的世界'},
  {id:'ch01-xie-appears',chapter:'ch01',anchor:'谢长风从翻倒的军车车尾破开的缝里挤出来，落地时膝盖一沉，整个人半跪着就把视线扫了一圈。刚想喊，又硬生生把声音压低，可东北人那股劲儿绷不住，越压越抖：',unlocks:['person-xie'],source:'第一章 · 坠入雾谷'},
  {id:'ch01-lin-appears',chapter:'ch01',anchor:'声音从车头那边传来，林昭从变形的驾驶室里把自己撑出来，头盔歪了点，额角一道血线往下淌。',unlocks:['person-lin'],source:'第一章 · 坠入雾谷'},
  {id:'ch01-xie-lin',chapter:'ch01',anchor:'谢长风本想上前，听到命令生生刹住，改成警戒姿势。',unlocks:['relation-xie-lin'],source:'第一章 · 坠入雾谷'},
  {id:'ch01-wang-appears',chapter:'ch01',anchor:'林昭喘了口气，先看人，再看车，最后那目光像刀一样落到从另一面驾驶门往外爬的王浩川身上。',unlocks:['person-wang'],source:'第一章 · 坠入雾谷'},
  {id:'ch01-wang-lin',chapter:'ch01',anchor:'“王浩川儿。”林昭的京腔一出来，火气不大，却更让人发怵，“你丫车怎么开的？”',unlocks:['relation-wang-lin'],source:'第一章 · 坠入雾谷'},
  {id:'ch01-ma-appears',chapter:'ch01',anchor:'马振邦脸上糊着泥，衣衫凌乱，一边往外爬一边拍身上的土。带着那股不紧不慢的劲儿：',unlocks:['person-ma','relation-ma-lin'],source:'第一章 · 寻找第五个人'},
  {id:'ch01-chen-appears',chapter:'ch01',anchor:'那不是他们熟悉的、二十六岁的、常年熬夜值班眼圈发黑的女军医陈素。',unlocks:['person-chen'],source:'第一章 · 沉睡的人'},
  {id:'ch01-chen-lin',chapter:'ch01',anchor:'他小心翼翼地把那个“小陈素”从车里抱了出来。',unlocks:['relation-chen-lin'],source:'第一章 · 沉睡的人'}
 ]
};
