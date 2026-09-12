import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs/promises';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {webcrypto} from 'node:crypto';
import ts from 'typescript';
const sql=new DatabaseSync(':memory:');
for(const file of ['drizzle/0000_needy_tana_nile.sql','drizzle/0001_cultured_mentallo.sql'])sql.exec(await fs.readFile(file,'utf8'));
const env={PRIMTAL_ENCRYPTION_KEY:Buffer.alloc(32,7).toString('base64'),DB:{prepare(query){const stmt=sql.prepare(query);let values=[];const obj={bind(...args){values=args;return obj;},async first(){return stmt.get(...values)||null;},async all(){return {results:stmt.all(...values)};},async run(){return {meta:{changes:Number(stmt.run(...values).changes)}};}};return obj;},async batch(stmts){sql.exec('BEGIN');try{const r=await Promise.all(stmts.map(s=>s.run()));sql.exec('COMMIT');return r;}catch(e){sql.exec('ROLLBACK');throw e;}}}};
let posts=0,deletes=0,calendarReads=0,group=false,modelFail=false,created;
const messages=[];
async function mockFetch(url,options={}){const u=new URL(url);const method=options.method||'GET';let data;
 if(u.hostname==='openrouter.ai'){if(modelFail)return new Response('',{status:503});return Response.json({choices:[{message:{content:JSON.stringify({status:'clear'})}}]});}
 if(u.pathname==='/api/channels/ch'){data={type:'dm',members:[{user_id:'u1'},{user_id:'bot'},...(group?[{user_id:'u2'}]:[])]};}
 else if(u.pathname==='/api/channels/ch/messages'){if(method==='POST'){data={id:crypto.randomUUID(),author:{id:'bot'},...JSON.parse(options.body)};messages.push(data);}else data={data:messages};}
 else if(u.pathname==='/api/calendars'){calendarReads++;data={data:[{id:'cal',owner_id:'u1',workspace_id:'ws'}]};}
 else if(u.pathname==='/api/calendars/events'){data={data:[],has_more:false};}
 else if(u.pathname==='/api/calendars/cal/events'&&method==='POST'){posts++;created={id:'event',calendar_id:'cal',...JSON.parse(options.body)};data=created;}
 else if(u.pathname==='/api/calendars/events/event'){if(method==='DELETE'){deletes++;return new Response(null,{status:204});}data=created;}
 else throw new Error('Unexpected test request '+u.pathname);
 return Response.json(data);
}
const context=vm.createContext({crypto:webcrypto,Uint8Array,TextEncoder,TextDecoder,atob,btoa,Date,Intl,URL,URLSearchParams,AbortSignal,Response,Request,Headers,console,fetch:mockFetch,setTimeout,clearTimeout});
const cache=new Map();
async function load(file){if(cache.has(file))return cache.get(file);let mod;
 if(file==='cloudflare:workers')mod=new vm.SyntheticModule(['env'],function(){this.setExport('env',env);},{context});
 else if(file==='@/app/chatgpt-auth')mod=new vm.SyntheticModule(['getChatGPTUser'],function(){this.setExport('getChatGPTUser',async()=>({userId:'web1'}));},{context});
 else if(!path.isAbsolute(file)){const real=await import(file);mod=new vm.SyntheticModule(Object.keys(real),function(){for(const k of Object.keys(real))this.setExport(k,real[k]);},{context});}
 else {const source=await fs.readFile(file,'utf8');mod=new vm.SourceTextModule(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText,{context,identifier:file,importModuleDynamically:async(spec,ref)=>{const m=await resolve(spec,ref.identifier);if(m.status==='linked')await m.evaluate();return m;}});}
 cache.set(file,mod);await mod.link((spec,ref)=>resolve(spec,ref.identifier));return mod;
}
function resolve(spec,parent){return load(spec.startsWith('.')?path.resolve(path.dirname(parent),spec+'.ts'):spec);}
const modules={};for(const name of ['questions','screeners','store','workflow','ambiguous','participants','message-text']){const mod=await load(path.resolve('lib/primtal/'+name+'.ts'));if(mod.status==='linked')await mod.evaluate();modules[name]=mod.namespace;}
assert.equal(modules['message-text'].messageText('```\nPAIR 0123456789ABCDEF\n```'),'PAIR 0123456789ABCDEF');assert.equal(modules['message-text'].messageText('`2`'),'2');assert.equal(modules['message-text'].messageText('**APPROVE**'),'APPROVE');assert.equal(modules['message-text'].messageText('APPROVE\nSKIP'),'APPROVE\nSKIP');
const {normalize}=modules.questions;assert.equal(normalize('mood',1),'concern');assert.equal(normalize('depression',5),'good');assert.equal(normalize('anxiety',5),'concern');assert.throws(()=>normalize('burnout',6));
assert.match(modules.screeners.screenResult('depression',[2,2,2,2,2,2,2,1,0]),/15\/27, moderately severe/);assert.match(modules.screeners.screenResult('anxiety',[3,3,3,3,3,3,3]),/21\/21, severe/);assert.throws(()=>modules.screeners.screenResult('anxiety',[1]));
const c={botKey:'test',openrouterKey:'test',model:'test',botId:'bot',workspaceId:'ws',userId:'u1',channelId:'ch',calendarId:'cal',timezone:'Europe/Madrid',hour:'16:00',enabled:false,consent:true,support:''};
const w=modules.workflow;let s=await w.start('u1',c,true);assert.equal(s.stage,'daily');for(const answer of ['2','4','1','2','2','1'])await w.accept(c,s,answer);assert.equal(s.stage,'note');await w.accept(c,s,'SKIP');assert.equal(s.stage,'proposal');assert.equal(posts,0);await w.accept(c,s,'APPROVE');assert.equal(posts,1);assert.equal(s.proposal.status,'created');await w.accept(c,s,'APPROVE');assert.equal(posts,1);await w.accept(c,s,'UNDO');assert.equal(deletes,1);
modelFail=true;s=await w.start('u1',c,true);const before=calendarReads;await w.accept(c,s,'I want to hurt myself');assert.equal(s.stage,'safety');assert.equal(calendarReads,before);assert.equal(s.safety,'uncertain');
await assert.rejects(()=>modules.ambiguous.events({...c,userId:'u2'},new Date().toISOString(),new Date().toISOString()));group=true;await assert.rejects(()=>modules.ambiguous.assertDM(c));group=false;
assert.equal(await w.getSession('u2'),null);
const code=await modules.participants.pairing('web1');assert.equal(await modules.participants.completePairing(code.command.slice(5),'u1'),true);assert.equal(await modules.participants.completePairing(code.command.slice(5),'u2'),false);assert.equal(await modules.participants.bound('web2'),null);
console.log('Passed: six questions, reverse scales, screening bounds, explicit approval, duplicate approval, undo, API failure safety, cross-user calendar/session isolation, group-DM rejection, single-use pairing.');
