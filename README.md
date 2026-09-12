# Primtal

Primtal helps people check in with themselves and make one practical change to their working day. It combines a private conversation in Ambiguous, six quick wellbeing questions, a personal calendar review, and calendar actions that require confirmation.

Built for the Valencia AI Tinkerers hackathon. The application runs online; users do not need to install software or keep a computer running.

**[Open the hosted panel](https://primtal-agent.aicreatormax.chatgpt.site)** · **[Documentation](docs/README.md)** · **[Connect your account](docs/implementation/TEAM-SETUP.md)**

The panel currently has owner-only access. Joining the Ambiguous workspace or this GitHub repository does not grant access to the panel. Team members can use their own Primtal DM without opening it.

## What the product does

1. A participant sends `Hello` to Primtal and selects **AGREE**.
2. Primtal asks six questions using selectable answers and the participant's first name.
3. The participant can add a note or continue directly to the calendar review.
4. Primtal shows today's busy events, occupied minutes, and any supported comparison with previous check-ins.
5. It offers a free focus hour or, when the conditions are met, a working-hours alternative for a specific personal meeting.
6. The participant confirms the action, opens the real calendar event, and can undo the change when the required conditions still hold.

The six answer selections and calendar comparisons run in application code without model calls. OpenRouter processes optional free text and powers the panel's setup assistant. The setup assistant answers questions about using Primtal; calendar changes are performed through the workflow controls.

## What the panel adds

The panel connects the providers, pairs a web account with its own Ambiguous conversation, configures reminders, starts a check-in remotely, displays the current question and calendar proposal, and prepares synthetic presentation history. See the [button-by-button panel guide](docs/implementation/PANEL-GUIDE.md).

Presentation preparation writes **real events into the selected calendar** alongside synthetic answer records. Removing synthetic answers does not delete those events.

## Read the documentation

| Goal | Guide |
| --- | --- |
| Understand each panel control | [Panel guide](docs/implementation/PANEL-GUIDE.md) |
| Connect a teammate's own account | [Team setup](docs/implementation/TEAM-SETUP.md) |
| Understand the questions and decision rules | [Daily workflow](docs/implementation/daily-checkin-workflow.md) |
| Understand the system and data flow | [Architecture](docs/implementation/ARCHITECTURE.md) |
| Review access, consent and deletion | [Privacy and data](docs/implementation/PRIVACY-AND-DATA.md) |
| Maintain or deploy the application | [Operations and development](docs/implementation/OPERATIONS.md) |
| Prepare a presentation | [Presentation runbook](docs/implementation/DEMO-GUIDE.md) |
| Separate current capabilities from future work | [Implementation status](docs/implementation/STACK-AND-STATUS.md) |

## Scope

Daily answers are wellbeing signals, not diagnoses. PHQ-9 and GAD-7 are available as optional follow-ups; other full questionnaires are unavailable. A concerning or unassessable free-text safety signal pauses schedule suggestions. Primtal does not provide continuous crisis monitoring or automatically contact a clinician.

Meeting moves cover a narrow class of personal events. They do not renegotiate group meetings, move recurring series, book PTO, or reorganise an entire calendar. Historical associations do not establish that meetings cause a health condition.

## Code and deployment

The application is in [apps/agent](apps/agent). The stack uses React, TypeScript, a hosted Cloudflare Worker, D1 storage, Ambiguous APIs and OpenRouter.

The panel guide describes the hosted release reviewed on **12 September 2026**. Its latest team-specific panel controls and shared setup-assistant access are ahead of the application snapshot in this repository. See [release provenance](docs/implementation/OPERATIONS.md#hosted-release-and-repository) before deploying a separate copy.

Provider credentials, personal answers and private calendar exports must stay out of GitHub. The repository's hosting manifest deliberately omits the identity of the existing private deployment.

## Origin

Based on [DMercedesGarcia/Primtal](https://github.com/DMercedesGarcia/Primtal). The original MIT license is retained.
