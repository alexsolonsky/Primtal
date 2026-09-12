# Connect your own Primtal bot conversation

Primtal runs online in Ambiguous. Each team member uses their own account, private conversation, answers and calendar. You can close your browser or turn off your computer; the hosted service continues processing check-ins and reminders.

## 1. Join the workspace

Open [Ambiguous](https://app.ambiguous.ai/chat) and select the **Primtal** workspace. Ask your workspace owner for an invitation if it is missing. A GitHub collaborator invitation is separate from Ambiguous workspace membership.

Find **Primtal**, `primtal@primtal.ambi.cc`, and open a direct conversation. It must contain exactly two members: you and Primtal. Use your own conversation, rather than another team member's chat or a group channel.

## 2. Connect your calendar

Open [Calendar](https://app.ambiguous.ai/calendar). Open the sharing settings for your personal calendar, such as **My Calendar**, and share it with **Primtal** as **Editor**.

Share the one personal calendar you want Primtal to use. The bot selects it automatically when it is the only shared calendar you own. Calendars owned by other people are excluded. If you have already shared several owned calendars, leave just the intended calendar shared with Primtal or select one in your paired setup panel if you have panel access.

Editor permission lets the bot carry out a calendar change after your confirmation. It does not allow the bot to read another participant's answers.

## 3. Start your first check-in

Send this in your private Primtal conversation:

```text
Hello
```

Primtal replies **Hello, [your name]** and explains how your answers, optional note and shared calendar are used. Select **AGREE** to start question 1. Select **Maybe later** to leave onboarding without enabling check-ins.

Choose a button for each of the six questions. Primtal uses your display name. You can add a short note or select **Continue to my calendar**. The six choices run without model calls; optional text goes through OpenRouter for support routing.

The bot then shows your answers and the current calendar. With enough history, it compares days with late calendar activity against other days. An association in these answers is not a medical diagnosis or proof of cause.

- **Protect this hour** creates the proposed private focus event.
- **Move to working hours** moves the specific meeting shown in the proposal.
- **Keep this meeting** leaves it at the original time.
- **Restore original time** reverses the confirmed move, if that time is still available.
- **Undo this focus block** removes the focus event created by this check-in.

Purple marks events created or changed through Primtal. Meeting moves currently cover private, non-recurring events you control, without other attendees or resource bookings. Shared, recurring and externally synced meetings stay under their organiser's control.

## 4. Set your daily reminder

For a reminder at 16:00 in Spain, send:

```text
REMIND 16:00 Europe/Madrid
```

Use an IANA time zone such as `Europe/London` for another location. The bot confirms your schedule. To pause reminders and stop the current check-in, send `STOP`. To restart later, send `Hello`; set `REMIND` again if you want reminders.

To review the calendar after completing all six answers, send `CALENDAR`. To delete your stored Primtal answers, settings and web pairing, send `DELETE MY DATA`. Messages already in Ambiguous and calendar events remain under your control.

## Optional: use the setup panel

The [hosted Primtal panel](https://primtal-agent.aicreatormax.chatgpt.site) currently has separate owner-only access. Team members can use the Ambiguous bot without opening this panel. No teammate needs to copy the project owner's API keys, run a server, clone GitHub or keep a laptop online.

If the site owner grants you panel access, sign in with your own account, select **Create pairing command**, and send that one-time command in your own Primtal DM. Then you can select your calendar and send a check-in from the panel. A pairing code expires in 10 minutes and works once.

**Presentation setup** prepares synthetic answers and matching private calendar events for the previous 10 workdays. It applies only to the account paired with that panel. The comparison identifies synthetic history; real answers are preserved. **Remove synthetic answers** removes those prepared answer records while keeping calendar events.

## If something is missing

| Problem | Action |
| --- | --- |
| Primtal workspace or bot is missing | Ask the workspace owner to add you to the Ambiguous workspace. |
| No calendar proposal | Share your own calendar as Editor, finish the six questions and optional-note step, then send `CALENDAR`. |
| No historical pattern | Collect repeated check-ins, or use the panel's clearly marked presentation history. At least three days per comparison group are required. |
| A meeting is left in place | It may have other attendees, recur, come from an external calendar, or have no free alternative. Open the event to coordinate with its organiser. |
| Bot stays silent | Ask the project owner to check background processing and provider status in the hosted panel. Closing the owner's computer has no effect on the hosted bot. |
| A note pauses calendar actions | Follow the support message. Ambiguous or failed safety checks pause changes. |

## Project owner: one-time online setup

The shared deployment needs saved Ambiguous and OpenRouter credentials and **Enable background bot** activated in the panel. Credentials are encrypted on the server and stay out of GitHub. Ambiguous message automations and a minute schedule call the hosted Worker. Active choice cards use bounded background polling; no local tunnel or computer process is involved. API quotas and provider availability can still affect response times.

CopilotKit powers **Primtal assistant** in the web panel. Ambiguous provides the direct-message interface; the Primtal backend handles check-ins, storage and calendar actions.
