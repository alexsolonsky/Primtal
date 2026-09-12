# Team demo runbook

Status: target runbook; remote control is not live yet. Do not present this as a working endpoint.

## One-time setup

1. Workspace owner creates a **Member** agent named Primtal in Ambiguous.
2. Owner creates the OpenRouter key. Store both keys only in the hosted service’s secret configuration.
3. Each participant signs in to the Primtal control panel and completes the one-time DM pairing challenge with their own Ambiguous account.
4. Each participant authorizes their own calendar and consents to note processing. No team reporting.
5. Configure a hosted scheduler for proactive check-ins and reply processing. Verify it works with the panel closed.

## Live demo

1. Sign in as any paired team member. Open their Ambiguous DM alongside the panel.
2. Click **Run demo check-in**. The target is the signed-in participant, never a free-form recipient field.
3. Answer mood **2**, enjoyment **4**, anxiety **2**, exhaustion **3**, focus **3**, technostress **2** for the basic calendar scenario. Use a fresh demo session without a recurring-watch fixture to avoid triggering follow-up instruments.
4. Add: “Today was full of meetings. I could use some time to focus.”
5. Show today’s actual calendar counts. Historical sample data must be labeled DEMO and separated from personal history. Do not claim a recurring pattern without enough observations.
6. Review the exact one-hour proposal and approve it.
7. Open the newly created event in Ambiguous. The write is real, even in demo mode.
8. Select **Undo** and verify only the new event is removed.
9. Repeat using a second team account; confirm the first account’s answers are inaccessible.

For the PHQ-9 scenario in the supplied workflow, use enjoyment **2** only after the follow-up instrument has been verified and activated. The current branch pauses this branch because the instrument registry is empty.

## Remote request contract to implement

`POST /api/demo/start` uses an authenticated participant session or a participant-scoped server credential. It must not accept an arbitrary `user_id` as authorization. A repeated request with the same idempotency key returns the existing session. Return session ID, delivery status and the participant’s DM link. Never return answers or provider keys.

Document an executable curl example only after the real hosting URL and authentication method have been verified. Do not distribute the common provider keys to trigger a demo.

## Troubleshooting

- No DM: validate bot access, pairing and exact two-member DM membership.
- First prompt works but replies do not: check the hosted reply-processing job.
- OpenRouter failure: show the fixed support route; calendar actions stay paused.
- Calendar permission error: the participant must grant access to the selected personal calendar.
- Uncertain write result: inspect the calendar or DM before retrying; avoid duplicates.
- Multiple participants: use separate authenticated sessions, not one shared presenter login.
