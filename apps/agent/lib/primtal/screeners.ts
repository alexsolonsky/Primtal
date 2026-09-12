// PHQ/GAD instruments released for unrestricted reproduction by Pfizer in 2010.
// Exact item wording and scoring sources: docs/SCREENERS.md.
export type Screener={name:string;recall:string;min:number;max:number;items:string[];labels:string[]};
const labels=['Not at all','Several days','More than half the days','Nearly every day'];
export const screeners:Record<string,Screener>={
 depression:{name:'PHQ-9',recall:'Over the last 2 weeks, how often have you been bothered by any of the following problems?',min:0,max:3,labels,items:[
 'Little interest or pleasure in doing things',
 'Feeling down, depressed, or hopeless',
 'Trouble falling or staying asleep, or sleeping too much',
 'Feeling tired or having little energy',
 'Poor appetite or overeating',
 'Feeling bad about yourself or that you are a failure or have let yourself or your family down',
 'Trouble concentrating on things, such as reading the newspaper or watching television',
 'Moving or speaking so slowly that other people could have noticed. Or the opposite being so fidgety or restless that you have been moving around a lot more than usual',
 'Thoughts that you would be better off dead, or of hurting yourself'
 ]},
 anxiety:{name:'GAD-7',recall:'Over the last two weeks, how often have you been bothered by the following problems?',min:0,max:3,labels,items:[
 'Feeling nervous, anxious, or on edge','Not being able to stop or control worrying','Worrying too much about different things','Trouble relaxing','Being so restless that it’s hard to sit still','Becoming easily annoyed or irritable','Feeling afraid as if something awful might happen'
 ]}
};
export function screenPrompt(domain:string,index:number){const s=screeners[domain];if(!s||!s.items[index])throw new Error('Questionnaire unavailable');return `**${s.name} · ${index+1}/${s.items.length}**\n${s.recall}\n\n${s.items[index]}\n\n${s.labels.map((label,n)=>`${n+s.min}. ${label}`).join('\n')}\n\nReply with a number (${s.min}–${s.max}), or STOP.`;}
export function screenResult(domain:string,answers:number[]){const s=screeners[domain];if(!s||answers.length!==s.items.length||answers.some(a=>!Number.isInteger(a)||a<s.min||a>s.max))throw new Error('Complete every question before scoring.');const total=answers.reduce((a,b)=>a+b,0);const severity=domain==='depression'?(total>=20?'severe':total>=15?'moderately severe':total>=10?'moderate':total>=5?'mild':'minimal'):(total>=15?'severe':total>=10?'moderate':total>=5?'mild':'minimal');return `${s.name}: ${total}/${s.max*s.items.length}, ${severity} ${domain==='depression'?'depressive':'anxiety'} symptoms over the previous two weeks. Completed ${new Date().toISOString().slice(0,10)}. Trigger: ${domain} daily answer. This is a screening result, not a diagnosis. Consider discussing persistent or concerning symptoms with a qualified professional.`;}
