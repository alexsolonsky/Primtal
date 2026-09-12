# Primtal demo guide

## Connect once (project owner)

1. Open the hosted Primtal panel and sign in as its owner.
2. Provider connections uses the saved Ambiguous agent key by default. Enter OpenRouter in its password field and select **Validate & save keys**. Validation makes one small model request so it also checks credit/model access. Successfully validated credentials are saved even if the other provider fails.
3. Select **Enable background bot**. This creates one private automation owned by the Primtal agent inside Ambiguous: once per minute it calls the protected Primtal runner. No health answers appear in the runner response. Keep the automation private: its definition contains a machine credential.

## Any team member

1. In the Primtal workspace in Ambiguous, open a one-to-one DM with **Primtal**, `primtal@primtal.ambi.cc`.
2. Send **DEMO**. Read the consent text and reply **I AGREE DEMO**. Use fictional answers. Each member is bound to the authenticated message sender, not an entered user ID.
3. Reply to all six questions with a number from 1 to 5. The scales are shown each time. Add a short note or send **SKIP**.
4. If PHQ-9/GAD-7 is offered, send **YES** to complete it or **SKIP** to decline. Other follow-up instruments explicitly show that they are unavailable; reply **SKIP** or **STOP**.
5. For calendar analysis, share your **own** calendar with the Primtal agent. Editor permission is necessary for event creation/undo. With exactly one shared calendar that you own, the bot selects it when you consent. With several, select one through your paired web panel.
6. Review the proposed exact hour. **APPROVE** creates a real private event without invitations; **SKIP** makes no change. **UNDO** deletes only the event from this session.

The owner can use **Create pairing command**, send the one-time code in their own Primtal DM, and then use **Send demo check-in to my DM** from the web panel. The code expires in 10 minutes and cannot be reused. Web access to the owner-private panel is separate from using the bot in Ambiguous; all team members can use their own DMs without opening the panel.

## Daily schedule and control

- `CHECKIN`, then `I AGREE`: a real daily check-in.
- `REMIND 16:00 Europe/Madrid`: enable your own daily reminder.
- `STOP`: end the check-in and pause reminders.
- `DELETE MY DATA`: delete your stored Primtal answers, settings and web binding. Existing Ambiguous messages and calendar events are not deleted.

Background replies are checked every minute after automation activation. The visible owner panel also polls every five seconds while open to make the demo responsive. It is not a replacement for activating the background automation. External service latency and quota may delay processing.

## Suggested live script

Use fictional daily answers `2, 4, 1, 2, 2, 1`, followed by “Today was full of meetings and I feel tired.” This shows low mood without automatically claiming a diagnosis. The live safety classifier decides whether the text can proceed. If cleared, show the count and occupied minutes from the actual shared calendar, approve a suggested hour, open the calendar event and undo it.

For the PHQ-9 branch, change the enjoyment answer to `2`; the bot offers the follow-up. A positive ninth PHQ-9 answer pauses calendar optimization regardless of total score.

## Honest limitations

PHQ-9 and GAD-7 are supported. BAT-12, ASRS and a full technostress instrument are not active. No psychologist or clinician is contacted. Historical pattern statements need repeated observations in both groups; without enough history, the bot says so. Demo records are separated from real daily records. This is a hackathon wellbeing prototype, not a validated clinical service.

## Verification

`node --experimental-vm-modules scripts/check-workflow.mjs` runs actual workflow code against in-memory SQLite and simulated provider responses. It checks six questions, reversed scales, questionnaire scoring, explicit event approval, duplicate approval, undo, failed model safety routing, per-user calendar/session isolation, group-DM rejection and one-time pairing. Live provider and calendar acceptance tests are separate.
