'use client';
import dynamic from 'next/dynamic';
const CopilotChat=dynamic(()=>import('./copilot-chat'),{ssr:false,loading:()=> <p className="muted">Loading assistant…</p>});
export default function CopilotPanel(){return <section className="card"><h2>Primtal assistant</h2><p className="muted">Ask about your check-in or connection. Calendar changes always require your confirmation.</p><CopilotChat/></section>}
