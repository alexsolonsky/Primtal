'use client';
import {CopilotKit,CopilotChat} from '@copilotkit/react-core/v2';
export default function Chat(){return <div style={{height:420,minHeight:300}}><CopilotKit runtimeUrl="/api/copilotkit" useSingleEndpoint={false}><CopilotChat labels={{modalHeaderTitle:'Primtal assistant',chatInputPlaceholder:'Ask Primtal…',welcomeMessageText:'Ask about Primtal or use the controls above to start your check-in.'}}/></CopilotKit></div>}
