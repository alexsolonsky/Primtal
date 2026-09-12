import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

let shared = {owner: 'owner', data: {openrouterKey: 'fake-test-key', workspaceId: 'team'}};
let binding = null;
let participant = null;
const code = ts.transpileModule(await fs.readFile('lib/primtal/copilot-access.ts', 'utf8'), {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
}).outputText;
const output = {exports: {}};
vm.runInNewContext(code, {
  exports: output.exports,
  require(name) {
    if (name === './connections') return {connection: async () => shared};
    if (name === './participants') return {bound: async () => binding, person: async () => participant};
    throw new Error(`Unexpected dependency: ${name}`);
  },
});
const {copilotAccess} = output.exports;
assert.equal((await copilotAccess('owner')).provider, shared.data);
assert.equal((await copilotAccess('teammate')).provider, null, 'An unpaired viewer cannot use the shared provider');
binding = 'paired-person';
participant = {workspaceId: 'another-team'};
assert.equal((await copilotAccess('teammate')).provider, null, 'A binding from another workspace is excluded');
participant = {workspaceId: 'team'};
assert.equal((await copilotAccess('teammate')).provider, shared.data, 'A paired teammate uses the server connection');
participant = null;
assert.equal((await copilotAccess('teammate')).provider, null, 'A deleted participant loses access');
shared = null;
assert.equal((await copilotAccess('owner')).provider, null, 'Missing configuration is handled without a model call');
console.log('Passed: owner, paired teammate, unpaired viewer, foreign workspace, deleted participant, missing provider.');
