# Primtal cloud application

Ambiguous DMs + personal calendars, OpenRouter, CopilotKit and encrypted D1 storage.

Read [Demo guide](docs/DEMO-GUIDE.md) for setup, per-person consent, pairing, remote launch, background activation and event approval/undo. [Screeners](docs/SCREENERS.md) records verified sources and remaining questionnaire limitations.

Development: `pnpm install`, `pnpm exec tsc --noEmit`, `node --experimental-vm-modules scripts/check-workflow.mjs`, `pnpm build`.

The existing setup application is published privately. This copy deliberately omits its private hosting project identity and every provider secret. Configure your intended hosting project and runtime values before deploying a separate copy.
