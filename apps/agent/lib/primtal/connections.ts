import {db, seal, unseal, runtime} from './store';
import {DEFAULT_MODEL} from './openrouter';
export type Connection = {botKey:string;openrouterKey:string;botId:string;workspaceId:string;botName:string;checkedAt:string;model?:string};
export async function connection() {
  const row=await db().prepare('SELECT owner,value FROM settings WHERE id=?').bind('connections').first<{owner:string;value:string}>();
  return row?{owner:row.owner,data:await unseal<Connection>(row.value)}:null;
}
export async function saveConnection(owner:string,data:Connection) {
  const r=await db().prepare('INSERT INTO settings(id,owner,value) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value WHERE settings.owner=excluded.owner').bind('connections',owner,await seal(data)).run();
  if(!r.meta.changes)throw new Error('Only the connection owner can change these keys.');
}
export async function providers() {
  const row=await connection();
  if(!row?.data.botId||!row.data.openrouterKey)throw new Error('Save and validate both provider keys first.');
  return {...row.data,model:row.data.model?.endsWith(':free')?row.data.model:DEFAULT_MODEL};
}
export function availableBotKey(c?:Connection|null){return c?.botKey||runtime('AMBIGUOUS_BOT_TOKEN');}
