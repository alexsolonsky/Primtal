# Primtal stack and status

- Ambiguous: private DMs, participant-owned calendars, private per-minute automation.
- OpenRouter: model connection test, fail-closed support routing and CopilotKit assistant.
- CopilotKit: actual runtime and chat interface in the personal web panel.
- Cloudflare Workers + D1: cloud execution, encrypted settings/answers, per-participant locks, single-use pairing.
- Six exact daily questions. PHQ-9/GAD-7 are optional and separately scored. BAT-12/ASRS/technostress full instruments remain unavailable and require an explicit skip or stop.
- Remote launch, calendar approval/undo, preferences and daily reminders are implemented.

Build, TypeScript and in-memory SQLite workflow tests passed. Live end-to-end verification is pending valid saved OpenRouter credentials, runner activation and user-authorized calendar sharing. Do not present these remaining live checks as completed.

The owner-private panel and the Ambiguous bot have separate access: any team member can opt in within their own DM; the panel binds to its signed-in owner through a single-use code sent from that same DM. No team dashboard exposes other users’ answers.

See DEMO-GUIDE.md for exact setup. Original upstream BRD/TRD are retained under docs and describe the earlier Slack direction; this status records the implemented Ambiguous direction.
