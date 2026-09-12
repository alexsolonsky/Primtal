'use client';
import {CopilotKit,CopilotChat} from '@copilotkit/react-core/v2';
export default function Chat(){return <div style={{height:420,minHeight:300}}><CopilotKit runtimeUrl="/api/copilotkit" useSingleEndpoint={false}><CopilotChat labels={{welcomeMessageText:'Ask about Primtal or use the controls above to start your demo.'}}/></CopilotKit></div>}
