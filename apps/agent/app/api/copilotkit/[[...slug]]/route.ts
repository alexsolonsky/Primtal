import {CopilotRuntime,createCopilotRuntimeHandler,InMemoryAgentRunner} from '@copilotkit/runtime/v2';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {PrimtalCopilot} from '@/lib/primtal/copilot';
export const dynamic='force-dynamic';
async function handler(request:Request){const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in required'},{status:401});if(request.method==='POST'&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Same-origin request required'},{status:403});const runtime=new CopilotRuntime({agents:{default:new PrimtalCopilot(user.userId)},runner:new InMemoryAgentRunner()});return createCopilotRuntimeHandler({runtime,basePath:'/api/copilotkit'})(request);}
export const GET=handler;
export const POST=handler;
