# Primtal cloud implementation — work in progress

This is the implementation transferred from the initial workspace. The private provider setup page is deployed at https://primtal-agent.aicreatormax.chatgpt.site. The full messaging workflow is not connected yet.

Implemented source: exact six-question bank, reverse-scale normalization, Ambiguous REST adapter, verified one-to-one DM checks, encrypted D1 storage, an initial check-in state machine, OpenRouter support routing, calendar proposal/approval/undo logic.

Pending integration: team identity pairing, multi-user settings (the transferred store is still single-owner), a hosted background scheduler, validated follow-up instruments, live provider validation and end-to-end tests. The current UI validates provider keys and includes CopilotKit setup chat using OpenRouter.

The `screeners` registry is deliberately empty until official instrument text and scoring are verified. Follow-up handling is incomplete and must be implemented before release. Do not describe the follow-up flow as implemented.

Do not use real health data for testing this branch. API secrets and existing private hosting identity are excluded from the repository.

Development: `pnpm install`, `pnpm build`. Deployment configuration must be linked to the intended hosting project before publishing. The existing owner-private setup page is published; it does not yet run the complete bot demo.
