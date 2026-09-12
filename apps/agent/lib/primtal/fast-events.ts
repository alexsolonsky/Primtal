import {amb} from './ambiguous';
import {connection,availableBotKey} from './connections';
import {db,runtime,lock} from './store';
export async function eventCapabilities(){const key=availableBotKey((await connection())?.data);const [events,node]=await Promise.all([amb(key,'/api/webhooks/event-types'),amb(key,'/api/automations/node-types/event')]);return {events,node};}
export async function ensureFastEvents(origin:string){return lock('fast-events-setup',async()=>{
 const key=availableBotKey((await connection())?.data),token=runtime('SITES_DISPATCH_TOKEN');if(!key||!token)throw new Error('Connect the agent first.');
 const catalog=await amb(key,'/api/webhooks/event-types');const rows=catalog.events||catalog.event_types||catalog.data||[];const names=(Array.isArray(rows)?rows:Object.keys(rows)).map((e:string|{type?:string;name?:string;event?:string})=>typeof e==='string'?e:e.type||e.name||e.event||'');
 const events:string[]=names.filter((s:string)=>s==='message.created'||(/^poll[._]/.test(s)&&/vot/.test(s)));if(!events.includes('message.created'))throw new Error('Message event type could not be verified.');
 const list=await amb(key,'/api/automations?tag=primtal-instant&limit=100');const ids=[];
 for(const eventType of events){const name=`Primtal instant · ${eventType}`;let item=(list.data||[]).find((a:{name:string;visibility:string})=>a.name===name&&a.visibility==='private');if(!item){item=await amb(key,'/api/automations','POST',{name,active:false,visibility:'private',shared_with:[],tags:['primtal-instant'],workflow:{nodes:[{id:'wake',name:'Answer received',type:'event',parameters:{eventType}},{id:'run',name:'Process answers',type:'http_request',parameters:{url:origin+'/api/runner',method:'POST',headers:{'Content-Type':'application/json','OAI-Sites-Authorization':'Bearer '+token,'X-Primtal-Runner':token},body:{mode:'tick'}}}],connections:{'Answer received':{main:[[{node:'Process answers',type:'main',index:0}]]}}}});}
  if(!item.id||item.warnings?.length)throw new Error('Instant event workflow was rejected.');if(!item.active)await amb(key,`/api/automations/${item.id}/enable`,'POST',{});ids.push({id:item.id,eventType});
 }
 await db().prepare('INSERT INTO settings(id,owner,value) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').bind('instant-events','system',JSON.stringify(ids)).run();return {active:true,events:ids};
});}
