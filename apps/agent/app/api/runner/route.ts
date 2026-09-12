import {z} from 'zod';
import {wakePolls} from '@/lib/primtal/live-polls';
import {db,hash,runtime,lock} from '@/lib/primtal/store';
import {connection,providers,availableBotKey} from '@/lib/primtal/connections';
import {amb,ownCalendar,assertDM} from '@/lib/primtal/ambiguous';
import {completion,DEFAULT_MODEL,FREE_MODELS} from '@/lib/primtal/openrouter';
import {runOnce} from '@/lib/primtal/runner';
import {ensureAutomation} from '@/lib/primtal/automation';
import {ensureFastEvents,eventCapabilities} from '@/lib/primtal/fast-events';
import {chooseFreeModel} from '@/lib/primtal/model-setup';
import {bound,person,personConfig,savePerson} from '@/lib/primtal/participants';
import {getSession,accept,flush,start} from '@/lib/primtal/workflow';
import {seedDemoDay} from '@/lib/primtal/demo-calendar';
import {prepareHistoryDay,sampleStatus} from '@/lib/primtal/sample-history';
import {refreshPresentation} from '@/lib/primtal/presentation';
import {PrimtalCopilot} from '@/lib/primtal/copilot';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const expected=runtime('SITES_DISPATCH_TOKEN');if(!expected||await hash(request.headers.get('X-Primtal-Runner')||'')!==await hash(expected))return Response.json({error:'Unauthorized'},{status:401});
 try{const {mode,step,model}=z.object({mode:z.enum(['verify','activate','tick','listen','capabilities','instant','free-model','demo-day','demo-day-retry','calendar-review','status','history-step','presentation','copilot-check','start-checkin','set-model']) ,step:z.number().int().min(0).max(9).optional(),model:z.enum(FREE_MODELS).optional()}).strict().parse(await request.json());
 if(mode==='verify'){const c=await connection();let botStatus='missing',modelStatus='missing';let name='';const model=c?.data.model||DEFAULT_MODEL;const started=Date.now();try{const b=await amb(availableBotKey(c?.data),'/api/users/me');botStatus=b.type==='agent'?'connected':'invalid identity';name=b.display_name||'';}catch(e){botStatus=e instanceof Error?e.message:'unavailable';}if(c?.data.openrouterKey){try{await completion({openrouterKey:c.data.openrouterKey,model},'Return JSON with ok:true.','Connection test.',20);modelStatus='connected';}catch(e){modelStatus=e instanceof Error?e.message:'unavailable';}}return Response.json({botStatus,modelStatus,name,model,elapsedMs:Date.now()-started});}
 if(mode==='capabilities')return Response.json(await eventCapabilities());
 if(mode==='instant')return Response.json(await ensureFastEvents(new URL(request.url).origin));
 if(mode==='set-model'){if(!model)throw new Error('Select an allowed free model.');return Response.json(await chooseFreeModel(model));}
 if(mode==='free-model')return Response.json(await chooseFreeModel());
 if(mode==='activate'){const scheduled=await ensureAutomation(new URL(request.url).origin);const instant=await ensureFastEvents(new URL(request.url).origin);return Response.json({scheduled,instant});}
 if(mode==='listen'){wakePolls(new URL(request.url).origin);return Response.json({accepted:true},{status:202});}if(mode==='tick'){const result=await runOnce();wakePolls(new URL(request.url).origin);return Response.json(result);}
 // Owner operations use the existing verified web-to-DM binding. No caller-supplied user ID.
 const row=await connection();if(mode==='copilot-check'){if(!row)throw new Error('Providers are not connected.');const started=Date.now();const eventTypes:string[]=[];let reply='';await new Promise<void>((resolve,reject)=>{new PrimtalCopilot(row.owner).run({threadId:crypto.randomUUID(),runId:crypto.randomUUID(),state:{},messages:[{id:crypto.randomUUID(),role:'user',content:'Explain how Primtal uses OpenRouter, in one short English sentence.'}],tools:[],context:[],forwardedProps:{}}).subscribe({next(event){const e=event as unknown as {type:string;delta?:string};eventTypes.push(e.type);if(e.delta)reply+=e.delta;},error:reject,complete:resolve});});return Response.json({connected:eventTypes.includes('RUN_FINISHED'),model:row.data.model||DEFAULT_MODEL,eventTypes,reply,elapsedMs:Date.now()-started,scope:'Server agent verification; browser transport is verified separately.'});}const id=row?await bound(row.owner):null;if(!id)throw new Error('Pair the project owner first.');
 return await lock(id,async()=>{const p=await person(id);if(!p)throw new Error('Participant unavailable.');const c=await personConfig(id);const s=await getSession(id);
 if(mode==='start-checkin'){const session=await start(id,c,true);wakePolls(new URL(request.url).origin);return Response.json({started:true,name:p.name,stage:session.stage,answered:session.index,deliveryState:session.outbox?.state,hasCard:!!session.outbox?.pollId});}
 if(mode==='status'){let dmStatus='connected',calendarStatus='connected';try{await assertDM(c);}catch(e){dmStatus=e instanceof Error?e.message:'unavailable';}try{await ownCalendar(c);}catch(e){calendarStatus=e instanceof Error?e.message:'unavailable';}const health=await db().prepare("SELECT id,value FROM settings WHERE id IN ('listener-heartbeat','listener-continuation')").all<{id:string;value:string}>();return Response.json({history:await sampleStatus(id,c),listener:Object.fromEntries(health.results.map(r=>[r.id,JSON.parse(r.value)])),name:p.name,calendarSelected:!!p.calendarId,consent:p.consent,stage:s?.stage,answered:s?.index,hasCard:!!s?.outbox?.pollId,delivery:{state:s?.outbox?.state,phase:s?.outbox?.phase,cardId:s?.outbox?.pollId,messageId:s?.outbox?.id,created:s?.outbox?.created},error:s?.error,dmStatus,calendarStatus,model:c.model});}
 await ownCalendar(c);p.calendarId=c.calendarId;await savePerson(id,p);
 if(mode==='history-step')return Response.json(await prepareHistoryDay(id,c,step??0));
 if(mode==='presentation')return Response.json(await refreshPresentation(c));
 if(mode==='demo-day'||mode==='demo-day-retry')return Response.json(await seedDemoDay(id,c,mode==='demo-day-retry'));
 if(!s||s.index!==6||s.safety&&s.safety!=='clear')throw new Error('A completed clear check-in is required.');await accept(c,s,'CALENDAR');await flush(c,s);wakePolls(new URL(request.url).origin);return Response.json({stage:s.stage,calendarReady:!s.error,proposal:s.proposal});},mode==='start-checkin'?10000:0);
 }catch(e){console.error('Primtal runner failed',{kind:e instanceof Error?e.name:'Error'});return Response.json({error:e instanceof Error?e.message:'Runner unavailable'},{status:503});}
}
