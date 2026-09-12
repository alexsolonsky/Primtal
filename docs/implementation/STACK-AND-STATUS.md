# Primtal implementation agreement

Updated 12 September 2026 from Alex’s implementation instructions.

## Current target

- Messaging and personal calendars: Ambiguous, replacing the earlier Slack flow for this demo.
- Model gateway: OpenRouter.
- Agent interface: CopilotKit. Setup chat and OpenRouter runtime integrated; demo controls pending.
- Hosting: a remote service with durable storage, independent of a developer laptop.
- Participants: any of the five team members in the Primtal Ambiguous workspace.
- Six daily questions, in order: mood, enjoyment, anxiety, exhaustion, focus, technostress. Collect all six before evaluating domain scores. An immediate safety statement interrupts at any point.
- Mood and enjoyment: higher answers are better. The remaining four scales run in the opposite direction. Never combine them into a clinical score.
- Daily scheduled check-in plus a separate authenticated “Run demo check-in” action.
- Real calendar modification only after the recipient confirms the exact proposed hour; undo removes only that created event.

## Team account binding

Target design: one server-side bot identity and model key. Each participant proves control of their own Ambiguous account by sending a one-time pairing code in their DM with Primtal. Bind the sender’s stable workspace/user IDs to the authenticated web account. A participant can then trigger only their own DM. Calendar access is separately authorized and scoped to that participant’s selected calendar. Knowledge of a user ID or email is not sufficient proof.

The current source still has single-owner configuration. Team pairing is a required acceptance gate before release, not an already-completed feature.

## Existing documents

`../BRD.me` and `../TRD.me` describe the original Slack/Python design. Preserve their business privacy requirements. This agreement records the newer implementation direction; the original documents remain intact for the team to reconcile in review.

## Current status

Source lives in `apps/agent`. Initial integration code and the question bank have been transferred. No bot key or OpenRouter key is committed. The setup page is deployed. Remote trigger, scheduler and a successful live bot run remain pending. Full follow-up instruments and their handling are incomplete.

## Release gates

1. Both credentials validated on the server; bot has access only to authorized resources.
2. Two different team accounts complete pairing and receive separate DMs.
3. Six questions and original scale labels work through Ambiguous replies.
4. OpenRouter errors and uncertain safety responses stop calendar optimization.
5. Follow-up instruments use verified text, recall periods and scoring; the technostress instrument must be selected explicitly.
6. Demo trigger works remotely and duplicate clicks resume rather than duplicate the session.
7. A hosted scheduler processes replies and sends daily prompts with the browser closed.
8. Approval creates one real event; undo removes it; changed availability is handled.
9. Cross-user reads, triggers, approvals and undo requests are denied.
10. Source, release URL and demonstrated limitations are documented for the team.

## Personal repository copy

Alex requested a personal copy under alexsolonsky on 12 September 2026. The upstream base and MIT license are preserved. Latest local source includes a private provider-key setup form and a CopilotKit runtime/chat adapter using OpenRouter. The setup application is deployed; live provider connections remain to be verified. Team pairing, demo actions, scheduling and full follow-up instruments remain unfinished. No API keys or existing hosting project identifier are included.

## Published setup application

https://primtal-agent.aicreatormax.chatgpt.site is the owner-private setup page. It contains authenticated encrypted provider-key storage and a CopilotKit/OpenRouter setup assistant. Production deployment succeeded; build and TypeScript checks passed. Live credential entry and model requests still require the owner. This supersedes the earlier statement that no page was deployed. Remote bot launch, multi-user pairing and background operation remain pending.
