# Primtal

Personal wellbeing check-ins in Ambiguous, with OpenRouter for model access and CopilotKit for the companion interface. Built for the Valencia AI Tinkerers hackathon.

## Current status

[Private setup page](https://primtal-agent.aicreatormax.chatgpt.site) — published for the owner. It validates and encrypts provider keys and includes a CopilotKit chat backed by OpenRouter once credentials are saved.

The cloud application includes per-person check-ins in Ambiguous, one-time web pairing, an authenticated remote demo button, a private Ambiguous automation for background processing, PHQ-9/GAD-7 follow-ups, calendar approval and undo, and the team logo. Build, TypeScript and workflow tests passed. Live operation still requires saved OpenRouter credentials and an activated runner; calendar writes require participant-granted Editor access. Live end-to-end acceptance testing is still pending. BAT-12, ASRS and the full technostress instrument are not active.

## Code and docs

- [Application source](apps/agent)
- [Implementation status and stack](docs/implementation/STACK-AND-STATUS.md)
- [Team demo runbook](docs/implementation/DEMO-GUIDE.md)
- [Daily question workflow](docs/implementation/daily-checkin-workflow.md)

The six daily questions cover mood, enjoyment, anxiety, exhaustion, focus and technostress. Mood and enjoyment have reversed scale direction. Domains remain separate; results are not diagnoses.

Provider keys, personal answers and private calendar data are excluded from this repository.

## Development

```sh
cd apps/agent
pnpm install
pnpm exec tsc --noEmit
pnpm build
```

Cloud runtime: Cloudflare Workers + D1. The hosting manifest deliberately excludes the existing private project identity; configure the intended hosting project and its runtime secrets before deploying a separate copy.

## Origin

Based on [DMercedesGarcia/Primtal](https://github.com/DMercedesGarcia/Primtal). Original MIT license and early Slack-oriented BRD/TRD are retained. The implementation agreement records the newer Ambiguous direction.
