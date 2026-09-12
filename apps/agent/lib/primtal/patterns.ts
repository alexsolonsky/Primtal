import {formatInTimeZone} from 'date-fns-tz';
import {db,unseal} from './store';
import {isLate} from './calendar-actions';
import type {Event} from './ambiguous';
export type HistoryDay={owner:string;day:string;answers:Record<string,number>;source?:'synthetic';calendarEventId?:string;safety?:string;index:number;created:number};
export async function patternHistory(owner:string,today:string){
 const first=new Date(today+'T12:00Z');first.setUTCDate(first.getUTCDate()-28);
 const rows=await db().prepare('SELECT value FROM checkins WHERE owner=? AND day>=? AND day<? ORDER BY day').bind(owner,first.toISOString().slice(0,10),today).all<{value:string}>();
 const all=await Promise.all(rows.results.map(r=>unseal<HistoryDay>(r.value)));const days=new Map<string,HistoryDay>();
 for(const row of all){if(row.owner!==owner||row.index!==6||row.safety&&row.safety!=='clear')continue;const old=days.get(row.day);if(!old||(old.source==='synthetic'&&row.source!=='synthetic')||(old.source===row.source&&row.created>old.created))days.set(row.day,row);}
 return [...days.values()].sort((a,b)=>a.day.localeCompare(b.day));
}
export function lateMeetingPattern(rows:HistoryDay[],calendar:Event[],tz:string){
 const usable=rows.filter(r=>['mood','depression','burnout'].every(k=>Number.isInteger(r.answers[k])&&r.answers[k]>=1&&r.answers[k]<=5));
 const lateDays=new Set(calendar.filter(e=>isLate(e,tz)).map(e=>formatInTimeZone(e.start_at,tz,'yyyy-MM-dd')));
 const linkedLate=(r:HistoryDay)=>r.source==='synthetic'&&r.calendarEventId?calendar.some(e=>e.id===r.calendarEventId&&isLate(e,tz)):lateDays.has(r.day);
 const late=usable.filter(linkedLate),earlier=usable.filter(r=>!linkedLate(r));
 const synthetic=usable.filter(r=>r.source==='synthetic').length;
 const prefix=synthetic?`**Prepared example history: ${synthetic} synthetic days (linked example meetings)${usable.length>synthetic?`, ${usable.length-synthetic} recorded days`:''}.**\n`:'';
 if(late.length<3||earlier.length<3)return {matched:false,synthetic,late:late.length,earlier:earlier.length,text:prefix+`There are ${usable.length} usable days in the last 28 days. A comparison needs at least three days with meetings ending after 18:00 and three days without them.`};
 const mean=(list:HistoryDay[],key:string)=>list.reduce((s,r)=>s+r.answers[key],0)/list.length;
 const metrics=[['Mood','mood'],['Enjoyment','depression'],['Work fatigue','burnout']];
 const moodGap=mean(earlier,'mood')-mean(late,'mood'),enjoyGap=mean(earlier,'depression')-mean(late,'depression'),fatigueGap=mean(late,'burnout')-mean(earlier,'burnout');
 const matched=moodGap>=1||enjoyGap>=1||fatigueGap>=1;
 return {matched,synthetic,late:late.length,earlier:earlier.length,text:prefix+`**Meetings ending after 18:00 · ${late.length} days compared with ${earlier.length} other days**\n\n| Average answer | Late meetings | Other days |\n| --- | --- | --- |\n${metrics.map(([label,key])=>`| ${label} | ${mean(late,key).toFixed(1)}/5 | ${mean(earlier,key).toFixed(1)}/5 |`).join('\n')}\n\nHigher mood and enjoyment scores mean feeling better; higher fatigue means feeling more drained. ${matched?'Late meetings coincide with less favourable answers in this history.':'This history does not show a clear difference.'} This association may also reflect other factors; these answers do not diagnose depression.`};
}
