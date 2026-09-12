# Primtal presentation runbook

For a team member's own account, follow [Team setup](TEAM-SETUP.md). The service runs online; no local server or tunnel is needed.

## Prepare the presentation

1. Open the hosted panel, connect the saved providers and enable background processing.
2. In your own Ambiguous DM, send **Hello**, select **AGREE**, and pair the panel if needed. Share your personal calendar with Primtal as Editor.
3. In **Presentation setup**, acknowledge synthetic data, then select **Prepare 10 past workdays**. Each day is saved separately; rerunning resumes preparation and preserves existing answers and overlapping events.
4. Select **Add work events for today** if you need a populated current calendar.
5. Select **Send check-in to my DM**. Choose the six answers and add a note or continue without one.
6. Show the calendar summary and comparison: five prepared late-meeting days with lower mood/enjoyment and greater fatigue, versus five other workdays. The bot identifies the prepared history and describes association rather than a diagnosis or cause.
7. When a similar late event appears today, inspect its original and proposed times. Choose **Move to working hours** to update that existing event. Open it in Calendar, then use **Restore original time** if you want to demonstrate undo.
8. Purple identifies calendar events created or changed through Primtal. Calendar entries and ordinary check-in cards use clean titles without presentation-mode badges or repeated numbered options.

If today's late event has already passed, the bot cannot propose a future move for it. If the original meeting has other attendees, recurrence, resource bookings or external synchronisation, coordinate in Calendar instead. The bot only moves eligible personal events after confirmation and rechecks both the event and the proposed slot.

## Data and privacy

Synthetic answers are stored separately, labelled in comparisons, and excluded from clinical follow-up decisions. A recorded answer takes precedence for the same day. Removing synthetic answers keeps calendar events. Health answers never enter calendar titles or descriptions. Every action is scoped to the participant's paired account and owned calendar.

A classifier failure or ambiguous note pauses calendar actions. PHQ-9 and GAD-7 are optional follow-ups; the daily questions are wellbeing proxies. No clinical diagnosis is generated and no clinician is automatically contacted.

## Stack and operation

- Ambiguous: private conversations, native choice cards, calendars and automations.
- Primtal Worker + D1: participant isolation, encrypted storage, deterministic questions, history comparison, confirmation and undo.
- OpenRouter: optional text routing and the web assistant. The selected free endpoint is `nex-agi/nex-n2.5-mini:free`; paid fallback is disabled.
- Web panel: setup assistant. It has no calendar action tools; use the bot or panel controls.

The six answer selections and history comparison make zero model calls. Background processing continues with the panel and all local computers closed. External API availability and quotas still affect responsiveness.

## Verification

Run `node --experimental-vm-modules scripts/check-workflow.mjs` in `apps/agent` to exercise actual workflow code with SQLite and simulated providers. It covers isolated votes and history, clean native cards, zero model calls for six answers, synthetic preparation idempotency, pattern sample thresholds, focus creation, confirmed meeting movement, duplicate and stale approvals, undo, and failed-model routing. Live calendar acceptance checks are separate.
