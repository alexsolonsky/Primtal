import {amb,assertDM,events,ownCalendar} from './ambiguous';
import {SYSTEM_EVENT_COLOR} from './calendar-actions';
import {cleanPollMessage,cleanPresentationText} from './message-cards';
import type {Config} from './store';
// Cosmetic changes only, bounded to the bot's own events and messages in this person's DM.
export async function refreshPresentation(c:Config){
 await ownCalendar(c);const calendar=await events(c,new Date(Date.now()-28*86400000).toISOString(),new Date(Date.now()+8*86400000).toISOString());
 const pending=calendar.filter(e=>e.creator_id===c.botId&&(/Primtal synthetic (workday|history)/.test(e.description||'')||/Primtal reference /.test(e.description||''))&&(e.color!==SYSTEM_EVENT_COLOR||/\bDEMO\b/.test(e.title)));
 let changedEvents=0;for(const e of pending.slice(0,5)){await amb(c.botKey,`/api/calendars/events/${e.id}`,'PATCH',{title:cleanPresentationText(e.title),color:SYSTEM_EVENT_COLOR,force:true});changedEvents++;}
 await assertDM(c);const messages=await amb(c.botKey,`/api/channels/${c.channelId}/messages?limit=100`);const edits=(messages.data||[]).filter((m:{author?:{id:string};content:string})=>m.author?.id===c.botId&&cleanPollMessage(m.content)!==m.content);
 let changedMessages=0;for(const m of edits.slice(0,8)){await amb(c.botKey,`/api/channels/${c.channelId}/messages/${m.id}`,'PATCH',{content:cleanPollMessage(m.content)});changedMessages++;}
 return {changedEvents,changedMessages,remaining:Math.max(0,pending.length-5)+Math.max(0,edits.length-8),color:SYSTEM_EVENT_COLOR};
}
