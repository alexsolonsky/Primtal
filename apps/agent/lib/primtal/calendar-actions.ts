import {formatInTimeZone,fromZonedTime} from 'date-fns-tz';
import {amb,events,ownCalendar,type Event} from './ambiguous';
import type {Config} from './store';

export const SYSTEM_EVENT_COLOR='#8B5CF6';
export type CalendarProposal={kind?:'focus'|'move';start:string;end:string;eventId?:string;status:string;title?:string;original?:{start:string;end:string;color:string|null;calendarId:string;updatedAt?:string}};
export const applied=(p?:CalendarProposal)=>p?.status==='created'||p?.status==='moved';
export function isLate(e:Event,tz:string){return !e.all_day&&(formatInTimeZone(e.end_at,tz,'yyyy-MM-dd')>formatInTimeZone(e.start_at,tz,'yyyy-MM-dd')||formatInTimeZone(e.end_at,tz,'HH:mm')>'18:00');}
export function movable(e:Event,c:Config){return e.calendar_id===c.calendarId&&!e.all_day&&!e.recurrence_rule&&!e.master_event_id&&!e.external_id&&!e.is_task&&!e.resources?.length&&!e.has_more_attendees&&Array.isArray(e.attendees)&&e.attendees.every(a=>a.user_id===c.userId)&&(e.creator_id===c.userId||e.creator_id===c.botId);}
export function workingSlot(es:Event[],tz:string,minutes:number,now=Date.now(),allowBusyWeekend=false){
 for(let i=0;i<8;i++){const day=formatInTimeZone(new Date(now+i*86400000),tz,'yyyy-MM-dd');const weekday=new Date(day+'T12:00Z').getUTCDay();if([0,6].includes(weekday)&&!(i===0&&allowBusyWeekend))continue;
  for(let minute=9*60;minute+minutes<=17*60;minute+=15){const start=fromZonedTime(`${day}T${String(Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}:00`,tz);const end=new Date(start.getTime()+minutes*60000);if(start.getTime()<now+300000)continue;if(!es.some(e=>Date.parse(e.start_at)<end.getTime()&&Date.parse(e.end_at)>start.getTime()))return {start:start.toISOString(),end:end.toISOString()};}
 }return null;
}
export async function meetingProposal(c:Config,today:Event[],upcoming:Event[]){
 for(const candidate of today.filter(e=>isLate(e,c.timezone)&&Date.parse(e.start_at)>Date.now()+300000).sort((a,b)=>a.start_at.localeCompare(b.start_at))){
  const e=await amb(c.botKey,`/api/calendars/events/${candidate.id}`) as Event;if(!movable(e,c))continue;
  const minutes=(Date.parse(e.end_at)-Date.parse(e.start_at))/60000;if(minutes<=0||minutes>120)continue;
  const slot=workingSlot(upcoming.filter(x=>x.id!==e.id),c.timezone,minutes);if(!slot)continue;
  return {kind:'move',...slot,eventId:e.id,title:e.title,status:'pending',original:{start:e.start_at,end:e.end_at,color:e.color||null,calendarId:e.calendar_id,updatedAt:e.updated_at||undefined}} as CalendarProposal;
 }return null;
}
export async function changeMeeting(c:Config,p:CalendarProposal,undo:boolean,beforeWrite:()=>Promise<void>){
 if(p.kind!=='move'||!p.eventId||!p.original)throw new Error('Meeting proposal unavailable.');
 await ownCalendar(c);const e=await amb(c.botKey,`/api/calendars/events/${p.eventId}`) as Event;
 if(!movable(e,c)||p.original.calendarId!==c.calendarId)throw new Error('This meeting cannot be moved through Primtal.');
 const expected=undo?p:p.original;
 if(Date.parse(e.start_at)!==Date.parse(expected.start)||Date.parse(e.end_at)!==Date.parse(expected.end)||e.title!==p.title||(!undo&&p.original.updatedAt&&e.updated_at!==p.original.updatedAt))throw new Error('The meeting changed. Review your calendar before trying again.');
 const destination=undo?p.original:p;if(Date.parse(destination.start)<Date.now()+60000)throw new Error('That time has passed. Review your calendar for another slot.');
 const busy=await events(c,destination.start,destination.end);if(busy.some(x=>x.id!==p.eventId&&Date.parse(x.start_at)<Date.parse(destination.end)&&Date.parse(x.end_at)>Date.parse(destination.start)))throw new Error('That time is now occupied. Review your calendar for another slot.');
 await beforeWrite();
 await amb(c.botKey,`/api/calendars/events/${p.eventId}`,'PATCH',{start_at:destination.start,end_at:destination.end,color:undo?p.original.color:SYSTEM_EVENT_COLOR});
}
