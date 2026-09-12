import {getChatGPTUser} from '@/app/chatgpt-auth';
import {bound} from './participants';
export async function signedIn(request:Request){if(request.method!=='GET'&&request.headers.get('origin')!==new URL(request.url).origin)throw new Error('Open Primtal to perform this action.');const user=await getChatGPTUser();if(!user)throw new Error('Sign in required.');return user;}
export async function myPerson(request:Request){const user=await signedIn(request);const id=await bound(user.userId);if(!id)throw new Error('Pair your own Ambiguous account first.');return id;}
