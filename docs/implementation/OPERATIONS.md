# Operations and development

[Documentation home](../README.md) · [Architecture](ARCHITECTURE.md)

## Hosted release and repository

The panel at [primtal-agent.aicreatormax.chatgpt.site](https://primtal-agent.aicreatormax.chatgpt.site) runs online. Participants do not need a local server or tunnel.

Documentation was reviewed against hosted source `975fab63e5166004c4b4dc80550c3b68555a3062` on **12 September 2026**. The application snapshot inspected in this GitHub repository was [d692e4f](https://github.com/alexsolonsky/Primtal/commit/d692e4faa45670e92d72b3ca8d53b12a9ec99d68).

The hosted release is ahead around role-aware panel controls and shared setup-assistant access for paired teammates. Those changes are not included in this documentation-only update to application source. Do not assume a fresh deployment of the repository will exactly reproduce that portion of the hosted panel. The core question, pairing, calendar and history rules described here were checked against the application code.

The live site currently has owner-only access. Hosting access must be granted separately from Ambiguous workspace membership and GitHub access. Publishing a GitHub change is not, by itself, proof that the hosted application has changed.

## Owner setup

1. Ensure the hosted Worker has its D1 database and required runtime configuration.
2. Open **Provider connections**, validate the Ambiguous agent key and OpenRouter key, and keep those credentials out of GitHub and assistant conversations.
3. Press **Enable background bot**. This creates or reuses the private Ambiguous runner schedule and supported message-event automations.
4. Pair your own account, grant calendar Editor permission, save preferences and complete a check-in.
5. Verify the heartbeat and a real DM response. Only test calendar writes on an account/calendar whose owner has authorised them.

The bot remains online when the owner's computer is off. Minute scheduling, message events and active-card polling still depend on provider availability, request quotas and successful server authentication. Daily reminders include weekends and are not a hard real-time delivery guarantee.

## Configuration contract

| Name or setting | Purpose |
| --- | --- |
| `DB` | Cloudflare D1 binding containing the generated schema/migrations. |
| `PRIMTAL_ENCRYPTION_KEY` | Server-side base64-encoded AES key used to encrypt application payloads. Preserve it when deploying over existing encrypted data. |
| `SITES_DISPATCH_TOKEN` | Server credential used by the online runner calls and hosting access. Keep it secret. |
| `AMBIGUOUS_BOT_TOKEN` | Optional runtime fallback agent credential; a validated stored connection can supply the key instead. |
| Stored provider connection | Agent identity/workspace, encrypted provider keys, validation metadata and optional chosen model. |
| Participant preferences | Calendar ID, time zone, reminder time, enabled state, consent and private conversation binding. |

OpenRouter credentials are entered through the owner form; the application reads the encrypted stored connection. There is no participant requirement to supply a separate key.

The configured default model is `nex-agi/nex-n2.5-mini:free`; the source also defines `google/gemma-4-26b-a4b-it:free` as a candidate for the owner's model-selection routine. This is a source configuration, not a claim that either endpoint is currently available. The saved model may differ from the default. Calls enforce zero-price provider limits, disable reasoning and have a 12-second request timeout; there is no paid fallback. The panel currently has no end-user model picker.

## Contributor commands

Use the declared Node.js requirement (`>=22.13.0`) and the package-manager version in `apps/agent/package.json`.

```sh
cd apps/agent
pnpm install
pnpm exec tsc --noEmit
node --experimental-vm-modules scripts/check-workflow.mjs
pnpm build
```

These are contributor checks, not user installation instructions. `pnpm dev` starts local development and `pnpm start` previews the built Worker; neither publishes the existing hosted site. Authentication headers and D1 bindings are supplied by the supported hosting/development environment, not by hardcoded browser identities.

The workflow script exercises application modules with in-memory SQLite and simulated providers. It covers choice isolation, zero model calls for the six answers, historical thresholds, preparation idempotency, calendar confirmation, stale/duplicate actions, undo and failed-model routing. Passing it does not prove that live Ambiguous permissions, automation triggers or OpenRouter are healthy. This documentation update does not claim a fresh live end-to-end test.

## Deployment

The repository copy intentionally omits the existing private project's identity and runtime secrets. A separate deployment needs its own hosting configuration, database/migrations, trusted authentication gateway and provider setup. Do not treat a local `.env` file or a GitHub push as a complete online deployment.

For the existing hosted project, use its supported hosting workflow: build the intended source, save that exact version, publish it, and confirm successful deployment. Preserve the site's current audience. If the database schema changes, include migrations; if the encryption key changes, previously encrypted data needs an explicit migration plan.

Changing the runner credential requires updating the corresponding private Ambiguous automation headers. Do not publish those headers in logs or documentation.

## Troubleshooting

| Symptom | Check and next action |
| --- | --- |
| Panel access denied | Request a site invitation for the ChatGPT identity you actually use. GitHub and Ambiguous invitations are separate. |
| Pairing code rejected | Create a new command and send it within 10 minutes in your own two-member Primtal DM. A code is single-use. |
| Bot is silent | Check owner provider status, **Enable background bot**, runner heartbeat and the private automation status in Ambiguous. |
| Questions advance slowly | Check Ambiguous requests and active-card/background processing. Daily choice selection does not call the model. Free text and setup chat do. |
| Calendar missing | Share a calendar you own in the same workspace with Primtal as Editor, then refresh/select it. |
| No historical comparison | At least three usable late days and three other days are required within the prior 28 days. Prepared days may be skipped for existing answers or calendar conflicts. |
| Focus offered instead of a meeting move | Check the historical match, a future late event, attendee list, recurrence/external flags, duration and a free working-hours destination. A bot attendee also prevents the current move filter from accepting the event. |
| “Time has passed” or “now occupied” | Refresh calendar review and approve a new proposal; an old approval cannot reserve a slot. |
| Calendar write is unconfirmed | Inspect the actual event before another write. Do not repeatedly press the action hoping to fix a lost response. |
| Note pauses calendar actions | The routing result was non-clear or unavailable. Read the support response; do not treat failure as clearance. |
| Preparation stopped partway | Completed days remain saved. Inspect any unconfirmed calendar write, then resume preparation. |
| Clearing history left calendar events | Expected: **Remove synthetic answers** deletes answer records only. Manage remaining events in Ambiguous. |
| Reminders stopped | `STOP` and **Stop check-in** disable them. Enable and save the reminder again when wanted. |
