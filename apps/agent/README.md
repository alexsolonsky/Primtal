# Primtal cloud application

React/TypeScript web panel and hosted Worker for private Ambiguous check-ins, OpenRouter text processing and encrypted D1 payload storage.

Start with the [project documentation](../../docs/README.md).

- [Panel controls](../../docs/implementation/PANEL-GUIDE.md)
- [Team onboarding](../../docs/implementation/TEAM-SETUP.md)
- [Architecture](../../docs/implementation/ARCHITECTURE.md)
- [Daily workflow](../../docs/implementation/daily-checkin-workflow.md)
- [Operations and development](../../docs/implementation/OPERATIONS.md)
- [Questionnaire sources](docs/SCREENERS.md)

## Contributor checks

From this directory:

```sh
pnpm install
pnpm exec tsc --noEmit
node --experimental-vm-modules scripts/check-workflow.mjs
pnpm build
```

Use the Node.js and package-manager versions declared in `package.json`. These commands do not publish the hosted application. A separate deployment needs its own hosting identity, authentication, D1 migrations and runtime secrets. The checked-in hosting manifest omits the existing private project's identity.

The hosted panel contains newer team-specific controls and shared setup-assistant access than this application snapshot. Read [release provenance](../../docs/implementation/OPERATIONS.md#hosted-release-and-repository) before assuming an independently deployed copy matches the current site.
