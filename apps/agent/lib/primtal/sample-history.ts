import {formatInTimeZone,fromZonedTime} from 'date-fns-tz';
import {amb,events,ownCalendar,AmbiguousError,type Event} from './ambiguous';
import {SYSTEM_EVENT_COLOR} from './calendar-actions';
import {db,seal,type Config} from './store';
import {patternHistory} from './patterns';
export async function sampleStatus(owner:string,c:Config){const today=formatInTimeZone(new Date(),c.timezone,'yyyy-MM-dd');const rows=await patternHistory(owner,today);return {days:rows.filter(r=>r.source==='synthetic').length,recorded:rows.filter(r=>r.source!=='synthetic').length};}
// One historical day per call keeps preparation resumable and requests bounded.
export async function prepareHistoryDay(owner:string,c:Config,step:number){
 if(!c.consent)throw new Error('Confirm answer storage consent first.');await ownCalendar(c);
 const today=formatInTimeZone(new Date(),c.timezone,'yyyy-MM-dd');const dates:string[]=[];const date=new Date(today+'T12:00Z');while(dates.length<10){date.setUTCDate(date.getUTCDate()-1);if(![0,6].includes(date.getUTCDay()))dates.push(date.toISOString().slice(0,10));}
 const day=dates[step];if(!day)throw new Error('Choose a preparation step from 0 to 9.');
 const actual=await db().prepare('SELECT id FROM checkins WHERE owner=? AND day=? AND id NOT LIKE ?').bind(owner,day,'synthetic:%').first();if(actual)return {day,skipped:true,reason:'Recorded answers already exist.'};
 const late=step%2===0;let start=fromZonedTime(day+(late?'T18:30:00':'T11:00:00'),c.timezone).toISOString(),end=fromZonedTime(day+(late?'T19:15:00':'T11:45:00'),c.timezone).toISOString();
 const marker=`Primtal synthetic history ${day}`;const dayEvents=await events(c,fromZonedTime(day+'T00:00:00',c.timezone).toISOString(),fromZonedTime(day+'T23:59:59',c.timezone).toISOString());let event=dayEvents.find(e=>e.description===marker);
 if(!event&&dayEvents.some(e=>Date.parse(e.start_at)<Date.parse(end)&&Date.parse(e.end_at)>Date.parse(start))){let found=false;for(let minute=late?18*60+15:9*60;minute+45<=(late?21*60:17*60);minute+=15){const begin=fromZonedTime(`${day}T${String(Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}:00`,c.timezone);const finish=new Date(begin.getTime()+45*60000);if(!dayEvents.some(e=>Date.parse(e.start_at)<finish.getTime()&&Date.parse(e.end_at)>begin.getTime())){start=begin.toISOString();end=finish.toISOString();found=true;break;}}if(!found)return {day,skipped:true,reason:'No free slot for a historical example.'};}
 const journal=`history-event:${owner}:${day}`;
 if(!event){const old=await db().prepare('SELECT value FROM settings WHERE id=? AND owner=?').bind(journal,owner).first<{value:string}>();if(old&&JSON.parse(old.value).status!=='rejected')throw new Error('A historical event write is unconfirmed. Inspect the calendar before retrying.');await db().prepare('INSERT INTO settings(id,owner,value) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').bind(journal,owner,JSON.stringify({status:'creating'})).run();
  try{event=await amb(c.botKey,`/api/calendars/${c.calendarId}/events`,'POST',{title:late?'Primtal · Project review':'Primtal · Team planning',start_at:start,end_at:end,description:marker,force:true,visibility:'private',color:SYSTEM_EVENT_COLOR,attendees:[],auto_conference:false,auto_meeting_notes:false}) as Event;}catch(e){if(e instanceof AmbiguousError&&[400,401,403,422].includes(e.status))await db().prepare('UPDATE settings SET value=? WHERE id=? AND owner=?').bind(JSON.stringify({status:'rejected'}),journal,owner).run();throw e;}
  await db().prepare('UPDATE settings SET value=? WHERE id=? AND owner=?').bind(JSON.stringify({status:'created',eventId:event!.id}),journal,owner).run();
 }
 const value={id:crypto.randomUUID(),owner,day,demo:true,source:'synthetic',stage:'complete',index:6,answers:late?{mood:step%4===0?1:2,depression:2,anxiety:4,burnout:5,adhd:4,technostress:4}:{mood:4,depression:5,anxiety:2,burnout:2,adhd:2,technostress:2},note:'Prepared example answers for a presentation.',safety:'clear',queue:[],screenAnswers:[],screenResults:{},created:Date.parse(end),calendarEventId:event!.id};
 await db().prepare('INSERT INTO checkins(id,owner,day,demo,value) VALUES(?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(`synthetic:${owner}:${day}`,owner,day,1,await seal(value)).run();return {day,late,prepared:true};
}
export async function removeSampleAnswers(owner:string){const result=await db().prepare('DELETE FROM checkins WHERE owner=? AND id LIKE ?').bind(owner,`synthetic:${owner}:%`).run();return {removed:result.meta.changes,calendarEventsKept:true};}
