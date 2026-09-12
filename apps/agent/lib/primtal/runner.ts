import {messageText} from './message-text';
import {amb,assertDM,send} from './ambiguous';
import {providers} from './connections';
import {db,lock,BusyError,type Config} from './store';
import {person,savePerson,personId,personConfig,completePairing,type Person} from './participants';
import {getSession,start,tick,accept,flush,persist,offerConsent} from './workflow';

type Message={id:string;author?:{id:string};content:string;created_at:string;deleted_at?:string;thread_id?:string};
function configFor(p:Person,c:Awaited<ReturnType<typeof providers>>):Config{return {...p,...c};}
async function processDM(channelId:string,userId:string,name:string,c:Awaited<ReturnType<typeof providers>>){
 const id=personId(c.workspaceId,userId);
 return lock(id,async()=>{
  let p=await person(id);
  const probe=configFor(p||{userId,channelId,calendarId:'',workspaceId:c.workspaceId,timezone:'Europe/Madrid',hour:'16:00',enabled:false,consent:false,support:'',joined:Date.now(),name},c);
  await assertDM(probe);
  if(p?.channelId&&p.channelId!==channelId)return;
  const session=p?await getSession(id):null;
  const cursor=session?.cursor||p?.cursor;
  const messages=await amb(c.botKey,`/api/channels/${channelId}/messages?limit=100${cursor?'&after='+encodeURIComponent(cursor):''}`);
  const incoming=(messages.data||[]).filter((m:Message)=>m.author?.id===userId&&!m.deleted_at&&!m.thread_id&&Date.parse(m.created_at)>= (p?.joined||Date.now()-600000)).sort((a:Message,b:Message)=>Date.parse(a.created_at)-Date.parse(b.created_at)||a.id.localeCompare(b.id));
  if(!p){const m=incoming.find((m:Message)=>/^(PAIR [A-F0-9]{16}|HELLO|HI|DEMO|CHECKIN|START|CALENDAR)$/i.test(messageText(m.content)));if(!m)return;p={userId,channelId,calendarId:'',workspaceId:c.workspaceId,timezone:'Europe/Madrid',hour:'16:00',enabled:false,consent:false,support:'',joined:Date.parse(m.created_at),name};await savePerson(id,p);}
  const m=incoming.find((entry:Message)=>Date.parse(entry.created_at)>=p!.joined) as Message|undefined;
  if(m){const command=messageText(m.content).toUpperCase();if(/^(PAIR |STOP$|DELETE MY DATA$|HELLO$|HI$|DEMO$|CHECKIN$|START$|I AGREE|REMIND |CALENDAR$)/.test(command)){p.cursor=m.id;await savePerson(id,p);if(session){session.cursor=m.id;await persist(session);}}
   if(command.startsWith('PAIR ')){const ok=await completePairing(command.slice(5),id);p.cursor=m.id;await savePerson(id,p);await send(configFor(p,c),ok?'Your Ambiguous account is paired with your Primtal panel. Start a check-in from the panel or send Hello. Your answers stay in this DM.':'That pairing code is invalid, expired or already used. Create a new code in your Primtal panel.');return;}
   if(command==='STOP'){p.enabled=false;p.cursor=m.id;await savePerson(id,p);if(session){await accept(configFor(p,c),session,'STOP');await flush(configFor(p,c),session);}else await send(configFor(p,c),'Check-ins are paused. Send Hello when you want to begin.');return;}
   if(command==='CALENDAR'&&session){await accept(configFor(p,c),session,'CALENDAR');await flush(configFor(p,c),session);return;}
   if(command==='DELETE MY DATA'){p.enabled=false;await savePerson(id,p);await db().batch([db().prepare('DELETE FROM sessions WHERE owner=?').bind(id),db().prepare('DELETE FROM checkins WHERE owner=?').bind(id),db().prepare('DELETE FROM bindings WHERE participant_id=?').bind(id),db().prepare('DELETE FROM participants WHERE id=?').bind(id)]);await send(configFor(p,c),'Your saved Primtal answers, settings and pairing have been deleted. Messages already in Ambiguous and calendar events remain under your control.');return;}
   if(/^(HELLO|HI|DEMO|CHECKIN|START|I AGREE|I AGREE DEMO)$/.test(command)){
    if(!p.consent){if(session?.stage==='consent'&&command.startsWith('I AGREE')){await accept(configFor(p,c),session,'AGREE');await flush(configFor(p,c),session);}else await offerConsent(id,configFor(p,c));return;}
    if(!p.calendarId){const calendars=await amb(c.botKey,'/api/calendars');const own=(calendars.data||[]).filter((v:{owner_id:string;workspace_id:string})=>v.owner_id===p!.userId&&v.workspace_id===p!.workspaceId);if(own.length===1)p.calendarId=own[0].id;}p.cursor=m.id;await savePerson(id,p);await start(id,configFor(p,c),command==='DEMO');return;
   }
   if(/^REMIND (\d\d:\d\d) ([A-Z_/]+)$/i.test(messageText(m.content))){const [,hour,tz]=messageText(m.content).match(/^REMIND (\d\d:\d\d) ([A-Z_/]+)$/i)!;if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(hour))throw new Error('Invalid time');new Intl.DateTimeFormat('en',{timeZone:tz});p.hour=hour;p.timezone=tz;p.enabled=true;p.cursor=m.id;await savePerson(id,p);await send(configFor(p,c),`Daily check-in enabled at ${hour} (${tz}). Reply STOP to pause.`);return;}
  }
  if(p.consent||session?.stage==='consent')await tick(id,configFor(p,c));
 });
}
export async function runParticipant(id:string){const p=await person(id);if(!p)return;const c=await providers();if(p.workspaceId!==c.workspaceId)throw new Error('Workspace mismatch');return processDM(p.channelId,p.userId,p.name||'Participant',c);}
export async function runOnce(){
 const c=await providers();const list=await amb(c.botKey,'/api/channels');let processed=0,failed=0;
 // Only two-member DMs that include the agent are eligible; group/public channels are never read.
 for(const channel of (list.data||[])){
  if(channel.type!=='dm'||channel.member_count!==2||!Array.isArray(channel.members))continue;
  const ids=channel.members.map((m:{id:string})=>m.id);if(ids.length!==2||!ids.includes(c.botId))continue;
  const peer=channel.members.find((m:{id:string})=>m.id!==c.botId);if(!peer)continue;
  try{await processDM(channel.id,peer.id,peer.display_name||'Participant',c);processed++;}catch(e){if(e instanceof BusyError)continue;failed++;console.error('Primtal DM processing failed',{kind:e instanceof Error?e.name:'Error'});}
 }
 await db().prepare('INSERT INTO settings(id,owner,value) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').bind('runner-heartbeat','system',JSON.stringify({at:new Date().toISOString(),processed,failed})).run();
 return {processed,failed};
}
