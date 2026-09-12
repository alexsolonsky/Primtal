import {connection, type Connection} from './connections';
import {bound, person} from './participants';

export async function copilotAccess(viewerId: string): Promise<{provider: Connection | null; help: string}> {
  const shared = await connection();
  if (!shared?.data.openrouterKey) {
    return {provider: null, help: 'Ask the project owner to connect OpenRouter and Ambiguous in Provider connections. Never paste API keys into this chat.'};
  }
  if (shared.owner === viewerId) return {provider: shared.data, help: ''};
  const id = await bound(viewerId);
  const participant = id ? await person(id) : null;
  if (!participant || participant.workspaceId !== shared.data.workspaceId) {
    return {provider: null, help: 'Select Create pairing command above, then send that one-time command in your own private Primtal conversation in Ambiguous. Once paired, this assistant uses the team connection; you do not need your own API keys.'};
  }
  return {provider: shared.data, help: ''};
}
