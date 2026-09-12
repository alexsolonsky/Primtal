# Connect your own Primtal account

[Documentation home](../README.md) · [Panel guide](PANEL-GUIDE.md)

Every participant uses their own Ambiguous account, direct conversation, answers and personal calendar. The shared bot runs online. You do not need to clone GitHub, copy the owner's API keys or leave a laptop running.

## 1. Join the Ambiguous workspace

Open [Ambiguous](https://app.ambiguous.ai/chat), select the **Primtal** workspace and find the Primtal agent, `primtal@primtal.ambi.cc`. Ask the workspace owner for an invitation if the workspace is missing.

Open a direct conversation containing exactly you and Primtal. Group channels and another person's conversation are not supported for check-ins.

## 2. Start with Hello

Send:

```text
Hello
```

Primtal greets you by name and explains answer storage, optional-note processing and calendar access. Select **AGREE** to start, or **Maybe later** to stop onboarding.

Answer six questions using the labelled choices. You can add a short note or choose **Continue to my calendar**. Low daily answers are not diagnoses, and answering the questions does not itself authorise a calendar change.

The owner must have connected the providers and enabled background processing. If the bot stays silent, contact the owner rather than obtaining a separate model key.

## 3. Share your calendar

In [Ambiguous Calendar](https://app.ambiguous.ai/calendar), share the personal calendar you own with **Primtal** as **Editor**.

If exactly one owned calendar is shared, the bot can select it automatically. If several are shared, choose the intended one in your paired panel or leave only the intended calendar shared. A colleague's calendar is not eligible, even when you can see it in Ambiguous.

After the questions, Primtal can show a focus proposal or an eligible meeting move. Confirm the exact action and time before it is written. Shared meetings, recurring events and external calendar events are excluded from automatic movement.

## 4. Set a daily reminder

For a 16:00 check-in in Spain, send:

```text
REMIND 16:00 Europe/Madrid
```

Choose the appropriate IANA time zone for yourself. The current reminder schedule runs every day, including weekends. A reminder is eligible at or after the selected local time; network or provider delays may affect delivery. An active check-in is not replaced by a new daily reminder.

| Command | Purpose |
| --- | --- |
| `Hello` | Begin onboarding or start/resume a check-in. |
| `REMIND 16:00 Europe/Madrid` | Save and enable a personal daily reminder. |
| `CALENDAR` | Review the calendar after six completed answers, when safety routing permits it. |
| `STOP` | Stop the current flow and disable daily reminders. |
| `DELETE MY DATA` | Remove stored answers, the current session, participant preferences and web pairing. Existing Ambiguous messages and calendar events remain. |

After `STOP`, send `Hello` to start again. Set `REMIND` again when you want scheduled check-ins to resume.

## Optional: connect the web panel

The [hosted panel](https://primtal-agent.aicreatormax.chatgpt.site) has a separate site access policy and currently admits only the owner. To present through the panel, ask the site owner to invite the email you use for ChatGPT. A GitHub invitation or Ambiguous workspace invitation does not grant this access.

Once admitted:

1. Sign in with your own invited account and check the displayed identity.
2. Select **Create pairing command**.
3. Send the generated `PAIR …` command in your own private Primtal conversation within 10 minutes.
4. Wait for the pairing confirmation, then choose your calendar and **Save preferences**.
5. Use **Send check-in to my DM** for an immediate launch.

The hosted release provides the shared setup assistant to paired teammates and reserves provider controls for the connection owner. Presentation preparation applies to the panel's paired participant. There is no “send to any user” selector.

If you cannot open the panel, you can still use the bot and calendar workflow in your own Ambiguous DM. See [access and troubleshooting](OPERATIONS.md#troubleshooting).
