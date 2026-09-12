import {getChatGPTUser} from '@/app/chatgpt-auth';
import {connection,saveConnection,availableBotKey,type Connection} from '@/lib/primtal/connections';
import {amb} from '@/lib/primtal/ambiguous';
import {completion} from '@/lib/primtal/openrouter';
import {z} from 'zod';
export const dynamic='force-dynamic';
const safe=(error:string,status=400)=>Response.json({error},{status,headers:{'Cache-Control':'no-store'}});
async function authorized(request:Request){const user=await getChatGPTUser();if(!user)throw new Error('Sign in required.');if(request.method!=='GET'&&request.headers.get('origin')!==new URL(request.url).origin)throw new Error('Open this form from your Primtal page.');const old=await connection();if(old&&old.owner!==user.userId)throw new Error('Only the connection owner can manage provider keys.');return {user,old};}
export async function GET(request:Request){try{const {old}=await authorized(request);return Response.json({saved:!!old?.data.botId&&!!old?.data.openrouterKey,botKeyAvailable:!!availableBotKey(old?.data),routerKeyAvailable:!!old?.data.openrouterKey,botName:old?.data.botName,checkedAt:old?.data.checkedAt},{headers:{'Cache-Control':'no-store'}});}catch{return safe('Sign in with the owner account to manage connections.',403);}}
export async function POST(request:Request){try{const {user,old}=await authorized(request);const input=z.object({botKey:z.string().max(1000).optional(),openrouterKey:z.string().max(1000).optional(),consent:z.literal(true)}).strict().parse(await request.json());const botKey=input.botKey?.trim()||availableBotKey(old?.data);const openrouterKey=input.openrouterKey?.trim()||old?.data.openrouterKey||'';if(!botKey||!openrouterKey)return safe('Enter the missing provider key. Leave saved keys blank to keep them.');
 const outcomes=await Promise.allSettled([amb(botKey,'/api/users/me'),completion({openrouterKey,model:'openai/gpt-4o-mini'},'Return a JSON object with the single property ok set to true.','Connection test. No personal data.')]);
 const botResult=outcomes[0],routerResult=outcomes[1];const errors:string[]=[];let bot=old?.data;
 if(botResult.status==='fulfilled'){const b=botResult.value;if(b.type==='agent'&&b.id&&b.workspace_id)bot={botKey,openrouterKey:'',botId:b.id,workspaceId:b.workspace_id,botName:b.display_name||'Primtal',checkedAt:new Date().toISOString()};else errors.push('Use an Ambiguous agent API key.');}else errors.push(botResult.reason instanceof Error?botResult.reason.message:'Ambiguous validation failed.');
 if(routerResult.status==='rejected')errors.push(routerResult.reason instanceof Error?routerResult.reason.message:'OpenRouter validation failed.');
 const data:Connection={botKey:bot?.botKey||'',openrouterKey:routerResult.status==='fulfilled'?openrouterKey:old?.data.openrouterKey||'',botId:bot?.botId||'',workspaceId:bot?.workspaceId||'',botName:bot?.botName||'',checkedAt:new Date().toISOString()};
 if(botResult.status==='fulfilled'||routerResult.status==='fulfilled')await saveConnection(user.userId,data);
 if(errors.length)return safe(errors.join(' ')+' Successfully validated credentials were saved.');return Response.json({saved:true,botName:data.botName,checkedAt:data.checkedAt},{headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error('Primtal connection save failed',{name:e instanceof Error?e.name:'Error'});return safe(e instanceof z.ZodError?'Check the form and consent.':e instanceof Error?e.message:'Could not save. Try again.');}}
