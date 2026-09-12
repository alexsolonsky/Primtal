# Primtal demo guide

## Connect once (project owner)

1. Open the hosted Primtal panel and sign in as its owner.
2. Provider connections uses the saved Ambiguous agent key by default. Enter OpenRouter in its password field and select **Validate & save keys**. Validation makes one small model request so it also checks credit/model access. Successfully validated credentials are saved even if the other provider fails.
3. Select **Enable background bot**. This creates one private automation owned by the Primtal agent inside Ambiguous: a schedule calls the protected Primtal runner for reminders. Instant event workflows wake it on new messages. Active native poll cards are checked in short Worker continuations. No health answers appear in the runner response. Keep the automation private: its definition contains a machine credential.

## Any team member

1. In the Primtal workspace in Ambiguous, open a one-to-one DM with **Primtal**, `primtal@primtal.ambi.cc`.
2. Send **DEMO**. Read the consent text and reply **I AGREE DEMO**. Use fictional answers. Each member is bound to the authenticated message sender, not an entered user ID.
3. Select an option on each of the six native question cards. No model is called for these choices. Every question shows your first name and progress. Add an optional note or select **Continue to my calendar**.
4. The daily summary and calendar proposal appear first. Optional PHQ-9/GAD-7 follow-ups are offered after you decide about the calendar. STOP always pauses the check-in and reminders.
5. For calendar analysis, share your **own** calendar with the Primtal agent. Editor permission is necessary for event creation/undo. With exactly one shared calendar that you own, the bot selects it when you consent. With several, select one through your paired web panel.
6. Review the proposed exact hour. **Protect this hour** creates a real private event without invitations; **Keep my calendar** makes no change. **Undo this focus block** deletes only the event from this session. Text commands APPROVE / SKIP / UNDO remain available.

The owner can use **Create pairing command**, send the one-time code in their own Primtal DM, and then use **Send demo check-in to my DM** from the web panel. The code expires in 10 minutes and cannot be reused. Web access to the owner-private panel is separate from using the bot in Ambiguous; all team members can use their own DMs without opening the panel.

## Daily schedule and control

- `CHECKIN`, then `I AGREE`: a real daily check-in.
- `REMIND 16:00 Europe/Madrid`: enable your own daily reminder.
- `STOP`: end the check-in and pause reminders.
- `DELETE MY DATA`: delete your stored Primtal answers, settings and web binding. Existing Ambiguous messages and calendar events are not deleted.

New-message events wake the bot after instant automation activation. Ambiguous currently has no poll-vote EventBus trigger; active cards use bounded Worker continuations with a short polling interval and a single shared lease. The minute schedule remains a fallback and sends daily reminders. External service latency affects response time. The visible owner panel also polls every five seconds while open to make the demo responsive. It is not a replacement for activating the background automation. External service latency and quota may delay processing.

## Suggested live script

Use fictional daily answers `2, 4, 1, 2, 2, 1`, followed by “Today was full of meetings and I feel tired.” This shows low mood without automatically claiming a diagnosis. The live safety classifier decides whether the text can proceed. If cleared, show the count and occupied minutes from the actual shared calendar, approve a suggested hour, open the calendar event and undo it.

For the PHQ-9 branch, change the enjoyment answer to `2`; the bot offers the follow-up. A positive ninth PHQ-9 answer pauses further calendar actions regardless of total score. Existing events are preserved.

## Honest limitations

PHQ-9 and GAD-7 are supported. BAT-12, ASRS and a full technostress instrument are not active. No psychologist or clinician is contacted. Historical pattern statements need repeated observations in both groups; without enough history, the bot says so. Demo records are separated from real daily records. This is a hackathon wellbeing prototype, not a validated clinical service.

## Verification

`node --experimental-vm-modules scripts/check-workflow.mjs` runs actual workflow code against in-memory SQLite and simulated provider responses. It checks six questions, reversed scales, questionnaire scoring, explicit event approval, duplicate approval, undo, failed model safety routing, per-user calendar/session isolation, group-DM rejection and one-time pairing. Live provider and calendar acceptance tests are separate.

## Updated demo controls

- `CALENDAR`: review the completed check-in and current calendar without repeating six questions.
- A single owned calendar shared with Primtal is selected automatically. The Start button saves the calendar shown in the panel.
- Saturday/Sunday focus time is considered for today when the calendar already contains busy events.
- Provider model selection is restricted to free OpenRouter endpoints. Reasoning is disabled, responses are bounded, and provider data collection remains denied. Rate limits or invalid classification responses pause note-based routing; paid fallback is disabled.
- Demo-day seeding adds explicitly labeled private work blocks, skips existing conflicts, and records each write to prevent duplicates. It sends no invitations.

The free model selected and live-tested on 2026-09-12 is `nex-agi/nex-n2.5-mini:free`. A small JSON request took 418 ms. This is one measurement, not a response-time guarantee. The second free candidate returned 429.
