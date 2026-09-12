# Implementation status

[Documentation home](../README.md)

Reviewed against the hosted panel and application source on **12 September 2026**. See [release provenance](OPERATIONS.md#hosted-release-and-repository) for the hosted/repository difference.

| Capability | Current behaviour |
| --- | --- |
| Online service | Hosted Worker and D1; Ambiguous schedule/events and active-card polling. No participant laptop process required. |
| Daily check-in | Six named choice questions with first-name greeting and progress; no model call for a daily choice. |
| Team participation | Own two-member DM, explicit opt-in, personal schedule and owned shared calendar. |
| Web access | Site access is separate and currently owner-only; an admitted teammate still pairs their own account. |
| Provider setup | Owner validation and encrypted credential storage. |
| Setup assistant | OpenRouter help replies; no calendar action tools. Hosted release supports the shared connection for paired teammates. |
| Calendar evidence | Busy-event count, occupied minutes with overlaps counted once, and a 28-day late-event comparison with minimum sample sizes. |
| Calendar actions | Confirmed one-hour focus event or an eligible personal meeting move, with validation and conditional undo. |
| Presentation preparation | Up to 10 synthetic historical workdays and eight current-day work blocks; calendar events are real. |
| Optional questionnaires | PHQ-9 and GAD-7 implemented; other full questionnaires unavailable. |
| Safety routing | Non-clear or failed free-text assessment pauses suggestions; fixed support response; no clinician contacted. |

## Not implemented

Group meeting negotiation, recurring-series changes, meeting shortening, PTO booking, external resource booking, a manager wellbeing dashboard, real therapist dispatch and a comprehensive retention/deletion policy are not implemented. The configured free model's availability is not guaranteed.

## Current limitations that affect a presentation

The late-event comparison is a rule-based association, not a causal or clinical conclusion. Fewer than three usable days in either group produces no match. A matching pattern does not ensure a movable event: future timing, attendee restrictions and a free destination still matter. In particular, an event listing the bot as an attendee is excluded by the current filter.

The [workflow script](../../apps/agent/scripts/check-workflow.mjs) covers core behaviour with simulated providers. Live credentials, sharing, automation delivery and event changes require their own observed acceptance check. This documentation update does not claim new live tests.
