import {signedIn} from '@/lib/primtal/web-auth';
import {connection} from '@/lib/primtal/connections';
import {ensureAutomation} from '@/lib/primtal/automation';
import {errorResponse} from '@/lib/primtal/store';
export async function POST(request:Request){try{const user=await signedIn(request);const c=await connection();if(!c||c.owner!==user.userId)throw new Error('Connect provider keys first.');return Response.json(await ensureAutomation(new URL(request.url).origin));}catch(e){return errorResponse(e);}}
