import {waitUntil} from 'cloudflare:workers';
import {db,runtime} from './store';
import {getSession} from './workflow';
import {personConfig} from './participants';
import {selectedChoice} from './message-cards';
import {runParticipant} from './runner';
// Poll votes have no EventBus trigger in Ambiguous. While a card is active,
// bounded Worker continuations check votes; the minute schedule is recovery only.
export function wakePolls(origin:string){waitUntil(listen(origin).catch(()=>console.error('Primtal live listener paused; the schedule will recover it.')));}
async function listen(origin:string){
 const token=crypto.randomUUID(),started=Date.now();const lease=await db().prepare('INSERT INTO locks(id,token,expires) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET token=excluded.token,expires=excluded.expires WHERE locks.expires < ?').bind('live-polls',token,started+28000,started).run();if(!lease.meta.changes)return;
 let active=0,rounds=0;
 try{while(Date.now()-started<18000){
  const rows=await db().prepare('SELECT id FROM sessions WHERE updated>? LIMIT 20').bind(Date.now()-15*60000).all<{id:string}>();
  const cards=(await Promise.all(rows.results.map(async r=>({id:r.id,s:await getSession(r.id)})))).filter(x=>x.s?.outbox?.pollId&&x.s.outbox.state==='sent'&&!['stopped','safety'].includes(x.s.stage));active=cards.length;if(!active)break;
  await Promise.allSettled(cards.slice(0,5).map(async({id,s})=>{const c=await personConfig(id);if(!c.consent&&s!.stage!=='consent')return;const vote=await selectedChoice(c,s!.outbox);if(vote)await runParticipant(id);}));rounds++;await new Promise(resolve=>setTimeout(resolve,900));
 }}finally{await db().prepare('DELETE FROM locks WHERE id=? AND token=?').bind('live-polls',token).run();await db().prepare('INSERT INTO settings(id,owner,value) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').bind('listener-heartbeat','system',JSON.stringify({at:new Date().toISOString(),active,rounds})).run();}
 if(active){const credential=runtime('SITES_DISPATCH_TOKEN');const response=await fetch(origin+'/api/runner',{method:'POST',headers:{'Content-Type':'application/json','OAI-Sites-Authorization':'Bearer '+credential,'X-Primtal-Runner':credential},body:JSON.stringify({mode:'listen'}),signal:AbortSignal.timeout(4000)});await db().prepare('INSERT INTO settings(id,owner,value) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').bind('listener-continuation','system',JSON.stringify({at:new Date().toISOString(),status:response.status})).run();await response.body?.cancel();}
}
