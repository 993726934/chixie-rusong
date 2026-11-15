// Pure progression rules, shared by browser and regression checks.
(function(root){
 'use strict';
 function create(data,snapshot){
  const items=new Map([...data.places,...data.achievements,...(data.characters??[]),...(data.relationships??[])].map(item=>[item.id,item]));
  const validEvents=new Set(data.triggers.map(event=>event.id));
  const records=new Map();
  if(snapshot?.version===1&&Array.isArray(snapshot.records))for(const record of snapshot.records){
   if(!record||typeof record!=='object')continue;
   const trigger=data.triggers.find(t=>t.id===record.event);
   if(items.has(record.id)&&validEvents.has(record.event)&&trigger.unlocks.includes(record.id))records.set(record.id,{id:record.id,event:record.event});
  }
  return {
   has:id=>records.has(id),
   record:id=>records.get(id),
   visibleRelationships:()=> (data.relationships??[]).filter(edge=>[edge.id,edge.from,edge.to].every(id=>records.has(id))),
   encounter(chapter,text){
    const added=[];
    for(const trigger of data.triggers){
     if(trigger.chapter!==chapter||trigger.anchor!==text)continue;
     for(const id of trigger.unlocks){if(!items.has(id)||records.has(id))continue;records.set(id,{id,event:trigger.id});added.push(items.get(id));}
    }
    return added;
   },
   snapshot:()=>({version:1,records:[...records.values()]})
  };
 }
 root.ChronicleCore={create};
})(typeof window==='undefined'?globalThis:window);
