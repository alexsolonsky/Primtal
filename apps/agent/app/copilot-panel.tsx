'use client';
import {CopilotKit,CopilotChat} from '@copilotkit/react-core/v2';
export default function CopilotPanel(){return <section className="card" style={{marginTop:24}}><h2>Primtal assistant</h2><p className="muted">Setup help through CopilotKit + OpenRouter. Use the form above for keys. This chat does not start check-ins yet.</p><div style={{height:420,minHeight:300}}><CopilotKit runtimeUrl="/api/copilotkit" useSingleEndpoint={false}><CopilotChat labels={{welcomeMessageText:'Ask what is connected or what remains before the demo.'}}/></CopilotKit></div></section>}
