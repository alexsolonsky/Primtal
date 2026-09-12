'use client';
import dynamic from 'next/dynamic';
const CopilotChat=dynamic(()=>import('./copilot-chat'),{ssr:false,loading:()=> <p className="muted">Loading assistant…</p>});
export default function CopilotPanel(){return <section className="card" id="primtal-assistant"><p className="eyebrow">HERE TO HELP</p><h2>Primtal assistant</h2><p className="muted">Get help with setup and using Primtal. To start a check-in or manage your calendar, use the controls above.</p><CopilotChat/></section>}
