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
  {id:'tech-hand-crossbow',category:'technology',name:'手弩',description:'第一次完成手弩的制作与验证。'},
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
 triggers:[
  {id:'ch01-valley-contact',chapter:'ch01',anchor:'军车是斜着倒扣在山谷里的。',unlocks:['place-valley'],source:'第一章 · 被扔进的世界'}
 ]
};
