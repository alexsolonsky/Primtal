import {amb,assertDM} from './ambiguous';
import type {Config} from './store';
import type {Session} from './workflow';
export type Choice={label:string;value:string};
export type Outbox={content:string;ref:string;state:string;id?:string;created?:number;phase?:'text'|'poll';textId?:string;pollId?:string;question?:string;choices?:Choice[]};
// A native single-choice Ambiguous poll: the only eligible voter is the paired DM peer.
export async function selectedChoice(c:Config,box?:Outbox){
 if(!box?.pollId||!box.choices)return null;
 const results=await amb(c.botKey,`/api/polls/${box.pollId}/results`);
 if(results.anonymous)return null;
 const picked=(results.options||[]).filter((o:{voters?:{user_id:string}[]})=>o.voters?.some(v=>v.user_id===c.userId));
 if(picked.length!==1)return null;
 const choice=box.choices.find(x=>x.label===picked[0].text);
 return choice?{value:choice.value,pollId:box.pollId}:null;
}
export async function closeCard(c:Config,box?:Outbox){if(box?.pollId)await amb(c.botKey,`/api/polls/${box.pollId}/close`,'POST',{});}
export async function deliverCard(c:Config,s:Session,persist:(s:Session)=>Promise<void>){
 const box=s.outbox;if(!box||box.state==='sent')return;
 await assertDM(c);
 if(box.state==='uncertain'){
  const recent=await amb(c.botKey,`/api/channels/${c.channelId}/messages?limit=30`);
  const candidates=(recent.data||[]).filter((m:{author?:{id:string};created_at?:string})=>m.author?.id===c.botId&&(!m.created_at||Date.parse(m.created_at)>=(box.created||s.created)-1000));
  if(box.phase==='poll'){
   for(const m of candidates.slice(0,6)){try{const p=await amb(c.botKey,`/api/polls/by-message/${m.id}`);if(p.question===box.question&&p.channel_id===c.channelId&&p.creator_id===c.botId){box.pollId=p.id;box.id=m.id;box.state='sent';s.cursor=m.id;await persist(s);return;}}catch{}}
  }else{const m=candidates.find((m:{content:string})=>m.content===box.content||m.content.includes(box.ref));if(m){box.textId=m.id;box.id=m.id;s.cursor=m.id;box.state=box.choices?'pending':'sent';await persist(s);}}
  if(box.state==='uncertain')throw new Error('Delivery is unconfirmed. A duplicate card was prevented.');
 }
 if(box.content&&!box.textId){box.phase='text';box.state='uncertain';await persist(s);const m=await amb(c.botKey,`/api/channels/${c.channelId}/messages`,'POST',{content:box.content,starts_new_block:true});box.textId=m.id;box.id=m.id;s.cursor=m.id;box.state=box.choices?'pending':'sent';await persist(s);}
 if(box.choices&&!box.pollId){box.phase='poll';box.state='uncertain';await persist(s);const p=await amb(c.botKey,'/api/polls','POST',{channel_id:c.channelId,question:box.question,options:box.choices.map(o=>o.label),anonymous:false,multi_vote:false});if(!p.id||!p.message_id)throw new Error('The question card was created without a message reference.');box.pollId=p.id;box.id=p.message_id;s.cursor=p.message_id;}
 box.state='sent';delete s.error;await persist(s);
}
