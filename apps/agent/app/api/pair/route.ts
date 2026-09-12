import {signedIn} from '@/lib/primtal/web-auth';
import {pairing,bound} from '@/lib/primtal/participants';
import {providers} from '@/lib/primtal/connections';
import {errorResponse} from '@/lib/primtal/store';
export async function POST(request:Request){try{const user=await signedIn(request);await providers();return Response.json(await pairing(user.userId),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
