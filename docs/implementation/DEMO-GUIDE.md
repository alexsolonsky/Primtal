# Primtal presentation runbook

[Documentation home](../README.md) · [Panel guide](PANEL-GUIDE.md)

## One complete story

“Primtal turns a private daily check-in into one small, confirmed schedule change. The participant can see the evidence, decide whether to act, open the real event and undo the change.”

The panel and bot are hosted online. Use a presenter's own authorised account and calendar. No laptop server is required. Panel access needs a separate site invitation; any workspace participant can use their own bot DM when the shared backend is enabled.

## Prepare before the session

1. Confirm provider connections and background processing.
2. Pair the presenter's web account with their own Primtal DM. Share their own calendar with the bot as Editor.
3. Send `Hello`, select **AGREE**, and check that labelled answers advance correctly.
4. Open **Presentation setup**, acknowledge synthetic data and choose **Prepare 10 past workdays**. Check the prepared-day count; conflicts and existing recorded answers may reduce it.
5. If wanted, select **Add work events for today**. This writes real private purple events, including blocks at fixed local times. It does not guarantee a future eligible meeting at presentation time.
6. Reserve enough time to verify the intended calendar branch before presenting. A private-looking event may be rejected for movement if its returned attendee list includes the bot.

Prepared history deliberately demonstrates five late-meeting days with less favourable answers and five other days with more favourable answers. The bot identifies it as synthetic. Do not describe it as a discovered fact about the presenter.

## Live walkthrough

| Moment | Action | Explain |
| --- | --- | --- |
| Start | Press **Send check-in to my DM** or send `Hello`. | The backend reaches the participant's own conversation. |
| Questions | Select the six labelled choices. | These are deterministic cards; no model call is needed for each answer. |
| Context | Add a short ordinary note or choose **Continue to my calendar**. | Text uses OpenRouter for routing; calendar calculations run in application code. |
| Evidence | Show busy-event count, occupied minutes and the historical averages. | Overlaps count once; prepared history is labelled and association is not causation. |
| Decision | Review the exact proposal and confirm it. | Consent is attached to a specific action and time. |
| Outcome | Open the actual event in Ambiguous Calendar. | Purple marks a Primtal-created or changed event. |
| Control | Use the offered undo action when its conditions still hold. | The participant can reverse the supported change. |

The reliable main story is **Protect this hour → real focus event → undo**. Show a meeting move only after verifying that a matching, future, eligible event exists and there is an alternative free slot. If the bot offers focus time instead, present that actual result rather than claiming a meeting was moved.

## Setup assistant

Ask **Primtal assistant** “How do I connect my calendar?” to show contextual setup help. Explain that the chat provides instructions; workflow buttons perform actions. Do not claim the help chat itself edited the calendar.

## Finish and clean up

Use **Finish for today** to end the interaction. Use `STOP` if you also want reminders disabled. Undo a supported current calendar change if desired. **Remove synthetic answers** removes prepared answer records only; remove unwanted prepared calendar events separately in Ambiguous.

## Describe the scope accurately

- PHQ-9 and GAD-7 are optional follow-ups; the six daily questions do not diagnose a condition.
- There is no real therapist/EAP dispatch or continuous crisis monitoring.
- Meeting movement is limited to eligible personal events; it does not renegotiate group meetings or recurring series.
- The prototype does not book PTO, shorten meetings or optimise an entire organisation's calendar.
- A simulated-provider workflow check is different from a successful live provider demonstration.
