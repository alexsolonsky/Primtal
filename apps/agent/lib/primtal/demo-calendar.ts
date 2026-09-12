import {formatInTimeZone,fromZonedTime} from 'date-fns-tz';
import {amb,ownCalendar,events,AmbiguousError} from './ambiguous';
import {db,type Config} from './store';
// Fictional work blocks only. Conflicting existing events are never moved or overwritten.
const blocks=[['09:00','10:00','Product stand-up'],['10:00','11:00','Design review'],['11:15','12:00','Team sync'],['12:00','13:00','Roadmap planning'],['13:30','14:15','Customer feedback'],['14:15','14:45','Launch preparation'],['17:00','18:00','Stakeholder review'],['18:00','18:30','Daily handover']];
export async function seedDemoDay(owner:string,c:Config,retryRejected=false){
 await ownCalendar(c);const day=formatInTimeZone(new Date(),c.timezone,'yyyy-MM-dd');
 const at=(time:string)=>fromZonedTime(`${day}T${time}:00`,c.timezone).toISOString();
 const existing=await events(c,at('00:00'),at('23:59'));let created=0,skipped=0;
 for(const [a,b,title] of blocks){const reference=`Primtal synthetic workday ${day} / ${a}`;if(existing.some(e=>e.description===reference)){skipped++;continue;}const start=at(a),end=at(b);if(existing.some(e=>Date.parse(e.start_at)<Date.parse(end)&&Date.parse(e.end_at)>Date.parse(start))){skipped++;continue;}
  const id=`seed:${owner}:${day}:${a}`;const old=await db().prepare('SELECT value FROM settings WHERE id=? AND owner=?').bind(id,owner).first<{value:string}>();if(old&&!(JSON.parse(old.value).status==='rejected'||retryRejected&&a==='09:00'))throw new Error('A demo event write is unconfirmed. Inspect the calendar before retrying.');
  await db().prepare('INSERT INTO settings(id,owner,value) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').bind(id,owner,JSON.stringify({status:'creating'})).run();
  let e;try{e=await amb(c.botKey,`/api/calendars/${c.calendarId}/events`,'POST',{title:`[DEMO] Primtal · ${title}`,start_at:start,end_at:end,description:reference,visibility:'private',force:true,color:'#8ABD82',attendees:[],auto_conference:false,auto_meeting_notes:false});}catch(error){if(error instanceof AmbiguousError&&[400,401,403,422].includes(error.status))await db().prepare('UPDATE settings SET value=? WHERE id=? AND owner=?').bind(JSON.stringify({status:'rejected',http:error.status}),id,owner).run();throw error;}
  await db().prepare('UPDATE settings SET value=? WHERE id=? AND owner=?').bind(JSON.stringify({status:'created',eventId:e.id}),id,owner).run();existing.push({id:e.id,calendar_id:c.calendarId,start_at:start,end_at:end,title:e.title,description:reference,status:'confirmed',transparency:'opaque'});created++;
 }
 return {day,created,skipped,calendarId:c.calendarId};
}
