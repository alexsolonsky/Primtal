import {signedIn} from '@/lib/primtal/web-auth';
import {connection} from '@/lib/primtal/connections';
import {ensureFastEvents} from '@/lib/primtal/fast-events';
import {ensureAutomation} from '@/lib/primtal/automation';
import {errorResponse} from '@/lib/primtal/store';
export async function POST(request:Request){try{const user=await signedIn(request);const c=await connection();if(!c||c.owner!==user.userId)throw new Error('Connect provider keys first.');const origin=new URL(request.url).origin;const scheduled=await ensureAutomation(origin);return Response.json({scheduled,instant:await ensureFastEvents(origin)});}catch(e){return errorResponse(e);}}
