import {z} from 'zod';
import {myPerson} from '@/lib/primtal/web-auth';
import {personConfig} from '@/lib/primtal/participants';
import {lock,errorResponse,saveConfig} from '@/lib/primtal/store';
import {prepareHistoryDay,removeSampleAnswers,sampleStatus} from '@/lib/primtal/sample-history';
import {seedDemoDay} from '@/lib/primtal/demo-calendar';
import {ownCalendar} from '@/lib/primtal/ambiguous';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const id=await myPerson(request);const c=await personConfig(id);return Response.json(await sampleStatus(id,c),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
export async function POST(request:Request){try{const id=await myPerson(request);const input=z.object({action:z.enum(['prepare','clear','today']),step:z.number().int().min(0).max(9).optional(),acknowledge:z.literal(true)}).strict().parse(await request.json());return await lock(id,async()=>{const c=await personConfig(id);if(!c.consent)throw new Error('Confirm personal-data consent first.');if(input.action==='clear')return Response.json(await removeSampleAnswers(id));await ownCalendar(c);await saveConfig(id,c);return Response.json(input.action==='today'?await seedDemoDay(id,c):await prepareHistoryDay(id,c,input.step??0));});}catch(e){return errorResponse(e);}}
