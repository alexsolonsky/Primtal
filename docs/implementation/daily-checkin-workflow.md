# Daily check-in and calendar workflow

[Documentation home](../README.md) · [Architecture](ARCHITECTURE.md)

This document describes the implemented flow: **six** daily questions, an optional note, a calendar review, an approved action and optional follow-up questionnaires. It replaces the earlier five-question proposal.

## Daily questions

Primtal presents each question as a native choice card, includes the participant's first name and progress, and stores the corresponding value from 1 to 5. Users select labels; they do not need to type numbers.

| Order | Display area | Question | Choices, in stored order 1 → 5 |
| --- | --- | --- | --- |
| 1 | Mood | How are you feeling today? | Very low · Low · Okay · Good · Very good |
| 2 | Enjoyment | How much have you enjoyed the things you normally enjoy today? | Not at all · A little · Somewhat · Mostly · Just as much as usual |
| 3 | Calm | How on edge or worried did you feel today? | Very calm · Mostly calm · A bit on edge · Quite on edge · Very on edge |
| 4 | Energy | How drained or worn out do you feel from work today? | Fully recharged · Mostly fine · A bit drained · Quite drained · Completely drained |
| 5 | Focus | How hard was it to stay focused or follow through on things today? | Easy · Mostly easy · Somewhat hard · Quite hard · Very hard |
| 6 | Digital balance | How overwhelmed did notifications or screens make you feel today? | Not at all · A little · Somewhat · Quite a bit · Very overwhelmed |

Mood and enjoyment have the opposite scale direction from the other four areas. For internal routing, values 4–5 are favourable for mood/enjoyment; values 1–2 are favourable for the other areas. A value of 3 is a watch signal. The remaining end of each scale is a concern signal. These are application routing states, not clinical thresholds or diagnoses.

The six choice selections, normalisation, history comparison and slot search make **zero model calls**. Native card creation and reading votes still require Ambiguous network requests.

## Flow and persistence

1. `Hello` offers consent. **AGREE** creates the first question; **Maybe later** stops onboarding.
2. Each valid choice is stored in the participant's current session and the next card is delivered. Votes from another participant and stale cards cannot advance it.
3. After question six, **Add a short note** accepts text; **Continue to my calendar** skips it.
4. Free text is routed through OpenRouter for possible safety concerns. A non-clear or failed assessment pauses schedule suggestions and displays the fixed support response. A clear or skipped note permits the ordinary calendar flow.
5. Completed answers are saved, follow-up candidates are queued and the calendar review runs.
6. The participant confirms or declines a proposal. Confirmed writes return an event link and, when available, an undo choice.
7. Optional follow-ups can be chosen after the calendar review. Finishing saves the check-in.

Only one current session exists per participant. An unfinished check-in is resumed. A manually launched panel check-in can be repeated for presentation; completed records use a per-person, per-day key within the relevant manual/scheduled lane, so these records are not an immutable history of every attempt. Synthetic history is stored separately.

## Today's calendar summary

The review reads the selected owned calendar and reports the count of busy events and occupied minutes. Cancelled and transparent/free events are excluded. Overlapping occupied intervals are counted once; personal blocks are included, so the total must not be described as “meeting hours” alone.

The participant sees the actual answer labels next to this summary. A missing calendar or API error is shown as a calendar issue; it does not discard the saved answers.

## Historical comparison

The implemented comparison is specifically about late calendar activity:

- Examine complete check-ins from the **28 previous calendar days**, excluding today and non-clear safety records.
- Keep one usable record per date. Recorded answers take precedence over synthetic history for the same date.
- An event is late when it ends **after 18:00** in the participant's time zone or extends overnight. All-day events do not define late days.
- Compare days with late events against days without them. At least **three days in each group** are required.
- Show each group's average mood, enjoyment and work-fatigue answers.
- A match requires at least a **one-point adverse difference** in one of those averages: lower mood/enjoyment or higher fatigue on late days.

This is a deterministic comparison, not a model inference, statistical significance test or causal finding. “Other days” means days without late activity; they can still contain meetings. The history uses the calendar's currently available event records, not an immutable snapshot of each past day.

Prepared records are linked to their example events and explicitly identified in the comparison. They are suitable for illustrating behaviour, not for conclusions about the participant's health.

## Calendar proposals

### Move one eligible meeting

When a historical match exists, Primtal looks for a similar late event on the check-in day that starts more than five minutes in the future. It proposes the first eligible event for which a free working-hours slot can be found.

The event must belong to the selected calendar, have no other participant in its attendee list, and be created by the participant or the bot. All-day, recurring, externally synced, task and resource-booked events are excluded. Duration must be greater than zero and no more than two hours.

The destination preserves duration and is searched in 15-minute increments between **09:00 and 17:00 on weekdays**, over today and the following seven dates. **Move to working hours** confirms the proposal. Before writing, the backend rechecks ownership, event contents, timing and destination conflicts. Undo restores the original time and colour only if the event and original slot remain eligible.

An event that looks private can still be ineligible if Ambiguous reports the bot itself as an attendee. The current attendee filter accepts only the participant's own user ID. A synthetic late meeting therefore does not guarantee a move proposal.

### Protect a focus hour

If no eligible move is found, Primtal can offer a free 60-minute block. The same working-hours search is used; a focus proposal may also use the current weekend day when it already contains busy events. The user confirms with **Protect this hour**. The backend checks conflicts again and creates a private purple event named **Primtal · Focus time**.

The application requests no invitees, conference or meeting notes. Health answers never enter the event title or description. Undo removes the event only after checking its calendar and Primtal session reference.

An interrupted write is recorded as uncertain. The user must inspect the calendar before retrying; the workflow does not blindly repeat a potentially successful write.

## Optional follow-ups and safety routing

Follow-up routing is separate from calendar pattern analysis. For each area except general mood, a concern answer queues a follow-up. A watch answer can also queue one when at least two prior check-ins in the preceding seven days have non-favourable answers in that area. Synthetic records are excluded from this routing.

PHQ-9 and GAD-7 are implemented. Other requested full questionnaires are explicitly unavailable and generate no invented score. See [questionnaire sources and limitations](../../apps/agent/docs/SCREENERS.md).

A positive response to PHQ-9 item 9 pauses calendar suggestions regardless of total score. It does not itself establish immediate danger. Primtal gives a support message; it does not automatically contact a clinician. A calendar action already completed before an optional follow-up is not automatically undone by a later safety flag.

Source: [questions](../../apps/agent/lib/primtal/questions.ts), [workflow](../../apps/agent/lib/primtal/workflow.ts), [patterns](../../apps/agent/lib/primtal/patterns.ts), [calendar actions](../../apps/agent/lib/primtal/calendar-actions.ts).
