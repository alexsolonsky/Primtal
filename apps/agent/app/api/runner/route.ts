import {z} from 'zod';
import {wakePolls} from '@/lib/primtal/live-polls';
import {db,hash,runtime,lock} from '@/lib/primtal/store';
import {connection,providers,availableBotKey} from '@/lib/primtal/connections';
import {amb,ownCalendar} from '@/lib/primtal/ambiguous';
import {completion,DEFAULT_MODEL} from '@/lib/primtal/openrouter';
import {runOnce} from '@/lib/primtal/runner';
import {ensureAutomation} from '@/lib/primtal/automation';
import {ensureFastEvents,eventCapabilities} from '@/lib/primtal/fast-events';
import {chooseFreeModel} from '@/lib/primtal/model-setup';
import {bound,person,personConfig,savePerson} from '@/lib/primtal/participants';
import {getSession,accept,flush} from '@/lib/primtal/workflow';
import {seedDemoDay} from '@/lib/primtal/demo-calendar';
import {prepareHistoryDay,sampleStatus} from '@/lib/primtal/sample-history';
import {refreshPresentation} from '@/lib/primtal/presentation';
import {PrimtalCopilot} from '@/lib/primtal/copilot';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const expected=runtime('SITES_DISPATCH_TOKEN');if(!expected||await hash(request.headers.get('X-Primtal-Runner')||'')!==await hash(expected))return Response.json({error:'Unauthorized'},{status:401});
 try{const {mode,step}=z.object({mode:z.enum(['verify','activate','tick','listen','capabilities','instant','free-model','demo-day','demo-day-retry','calendar-review','status','history-step','presentation','copilot-check']) ,step:z.number().int().min(0).max(9).optional()}).strict().parse(await request.json());
 if(mode==='verify'){const c=await connection();let botStatus='missing',modelStatus='missing';let name='';const model=c?.data.model||DEFAULT_MODEL;const started=Date.now();try{const b=await amb(availableBotKey(c?.data),'/api/users/me');botStatus=b.type==='agent'?'connected':'invalid identity';name=b.display_name||'';}catch(e){botStatus=e instanceof Error?e.message:'unavailable';}if(c?.data.openrouterKey){try{await completion({openrouterKey:c.data.openrouterKey,model},'Return JSON with ok:true.','Connection test.',20);modelStatus='connected';}catch(e){modelStatus=e instanceof Error?e.message:'unavailable';}}return Response.json({botStatus,modelStatus,name,model,elapsedMs:Date.now()-started});}
 if(mode==='capabilities')return Response.json(await eventCapabilities());
 if(mode==='instant')return Response.json(await ensureFastEvents(new URL(request.url).origin));
 if(mode==='free-model')return Response.json(await chooseFreeModel());
 if(mode==='activate'){const scheduled=await ensureAutomation(new URL(request.url).origin);const instant=await ensureFastEvents(new URL(request.url).origin);return Response.json({scheduled,instant});}
 if(mode==='listen'){wakePolls(new URL(request.url).origin);return Response.json({accepted:true},{status:202});}if(mode==='tick'){const result=await runOnce();wakePolls(new URL(request.url).origin);return Response.json(result);}
 // Owner operations use the existing verified web-to-DM binding. No caller-supplied user ID.
 const row=await connection();if(mode==='copilot-check'){if(!row)throw new Error('Providers are not connected.');const started=Date.now();const eventTypes:string[]=[];let reply='';await new Promise<void>((resolve,reject)=>{new PrimtalCopilot(row.owner).run({threadId:crypto.randomUUID(),runId:crypto.randomUUID(),state:{},messages:[{id:crypto.randomUUID(),role:'user',content:'Explain how CopilotKit and OpenRouter are connected in Primtal, in one short English sentence.'}],tools:[],context:[],forwardedProps:{}}).subscribe({next(event){const e=event as unknown as {type:string;delta?:string};eventTypes.push(e.type);if(e.delta)reply+=e.delta;},error:reject,complete:resolve});});return Response.json({connected:eventTypes.includes('RUN_FINISHED'),model:row.data.model||DEFAULT_MODEL,eventTypes,reply,elapsedMs:Date.now()-started,scope:'Server agent verification; browser transport is verified separately.'});}const id=row?await bound(row.owner):null;if(!id)throw new Error('Pair the project owner first.');
 return await lock(id,async()=>{const p=await person(id);if(!p)throw new Error('Participant unavailable.');const c=await personConfig(id);const s=await getSession(id);
 if(mode==='status'){const health=await db().prepare("SELECT id,value FROM settings WHERE id IN ('listener-heartbeat','listener-continuation')").all<{id:string;value:string}>();return Response.json({history:await sampleStatus(id,c),listener:Object.fromEntries(health.results.map(r=>[r.id,JSON.parse(r.value)])),name:p.name,calendarSelected:!!p.calendarId,consent:p.consent,stage:s?.stage,answered:s?.index,hasCard:!!s?.outbox?.pollId,model:c.model});}
 await ownCalendar(c);p.calendarId=c.calendarId;await savePerson(id,p);
 if(mode==='history-step')return Response.json(await prepareHistoryDay(id,c,step??0));
 if(mode==='presentation')return Response.json(await refreshPresentation(c));
 if(mode==='demo-day'||mode==='demo-day-retry')return Response.json(await seedDemoDay(id,c,mode==='demo-day-retry'));
 if(!s||s.index!==6||s.safety&&s.safety!=='clear')throw new Error('A completed clear check-in is required.');await accept(c,s,'CALENDAR');await flush(c,s);wakePolls(new URL(request.url).origin);return Response.json({stage:s.stage,calendarReady:!s.error,proposal:s.proposal});});
 }catch(e){console.error('Primtal runner failed',{kind:e instanceof Error?e.name:'Error'});return Response.json({error:e instanceof Error?e.message:'Runner unavailable'},{status:503});}
}
