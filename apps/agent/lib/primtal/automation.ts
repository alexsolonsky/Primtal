import {amb} from './ambiguous';
import {connection,availableBotKey} from './connections';
import {db,runtime,lock} from './store';
export async function ensureAutomation(origin:string){return lock('automation-setup',async()=>{
 const key=availableBotKey((await connection())?.data);const token=runtime('SITES_DISPATCH_TOKEN');if(!key||!token)throw new Error('Server connection is not configured.');
 const existing=await db().prepare('SELECT value FROM settings WHERE id=?').bind('automation').first<{value:string}>();
 if(existing){const saved=JSON.parse(existing.value);const live=await amb(key,`/api/automations/${saved.id}`);if(!live.active)await amb(key,`/api/automations/${saved.id}/enable`,'POST',{});return {id:saved.id,active:true};}
 const name='Primtal private check-in runner';
 // Reconcile a prior response lost before D1 persistence; never create two recurring jobs.
 const found=await amb(key,'/api/automations?tag=primtal-runner&limit=100');let item=found.data?.find((a:{name:string;visibility:string})=>a.name===name&&a.visibility==='private');
 if(!item)item=await amb(key,'/api/automations','POST',{name,description:'Processes opted-in Primtal DMs and per-person daily reminders. No answer content is returned to automation logs.',active:false,visibility:'private',shared_with:[],tags:['primtal-runner'],workflow:{nodes:[{id:'clock',name:'Every minute',type:'scheduleTrigger',position:[0,0],parameters:{cron:'* * * * *',timezone:'Etc/UTC'}},{id:'run',name:'Process check-ins',type:'http_request',position:[300,0],parameters:{url:origin+'/api/runner',method:'POST',headers:{'Content-Type':'application/json','OAI-Sites-Authorization':'Bearer '+token,'X-Primtal-Runner':token},body:{mode:'tick'}}}],connections:{'Every minute':{main:[[{node:'Process check-ins',type:'main',index:0}]]}}}});
 if(!item.id||item.warnings?.length)throw new Error('Ambiguous did not accept the runner workflow.');
 await db().prepare('INSERT INTO settings(id,owner,value) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').bind('automation','system',JSON.stringify({id:item.id})).run();
 await amb(key,`/api/automations/${item.id}/enable`,'POST',{});return {id:item.id,active:true};
 });}
