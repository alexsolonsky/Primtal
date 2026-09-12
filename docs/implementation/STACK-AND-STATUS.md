# Primtal stack and status

- Ambiguous provides one-to-one conversations, native choice cards, personal calendars and online automations.
- The hosted Cloudflare Worker and D1 handle deterministic check-ins, encrypted records, participant isolation, single-use web pairing and calendar confirmation/undo.
- OpenRouter processes optional notes and the setup assistant using the free endpoint `nex-agi/nex-n2.5-mini:free`. Paid fallback is disabled.
- The web panel includes a setup chat. It has no calendar action tools; the backend handles bot and panel actions.
- Six daily choices and history comparisons run without model calls. PHQ-9/GAD-7 remain optional, separately scored follow-ups; other full screening instruments are unavailable.
- Purple (`#8B5CF6`) marks events created or changed with Primtal. Native poll messages retain their question and buttons without a repeated numbered answer list.
- Presentation setup prepares up to 10 prior workdays with separate synthetic records and matching private calendar events. It preserves recorded answers, skips calendar conflicts and resumes without duplicate writes. Synthetic records are identified in comparisons and excluded from clinical follow-up decisions.
- History comparisons use up to 28 prior complete days and require at least three days in each group. They compare mood, enjoyment and fatigue averages; they do not establish depression or causation.
- A matching late event can produce a proposal to move that existing meeting into a free weekday slot between 09:00 and 17:00. The duration is preserved. The bot requires confirmation, rechecks the event and target slot, and offers restoration of the original time. Shared, recurring, resource-booked and externally synced events are excluded from automatic movement.

The owner-private panel and Ambiguous bot have separate access. Any member of the Primtal Ambiguous workspace can opt in through their own DM. No team dashboard exposes another participant's answers. The service continues online when the panel and local computers are closed; external API availability and quotas still matter.

TypeScript, build and in-memory SQLite workflow checks cover native cards, isolated votes/history, zero model calls for six choices, synthetic history idempotency, sample thresholds, duplicate/stale approvals, meeting movement/restoration, focus events and failed-model routing. Live calendar checks are performed separately from simulated tests.

Start with [Team setup](TEAM-SETUP.md) and [Presentation runbook](DEMO-GUIDE.md). The application and this document describe the implemented Ambiguous flow.
