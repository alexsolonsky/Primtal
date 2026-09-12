# Primtal panel guide

[Documentation home](../README.md) · [Team setup](TEAM-SETUP.md)

The [Primtal panel](https://primtal-agent.aicreatormax.chatgpt.site) is a personal setup and control page. It lets you connect your conversation, choose your calendar, schedule check-ins, launch one immediately, respond to the current question, and review calendar proposals.

It is not a manager dashboard: there is no control for browsing another participant's answers or selecting someone else's account.

## Access and page layout

As reviewed on 12 September 2026, the site admits only its owner. A teammate needs a separate site invitation to open it. The Ambiguous bot can be used without panel access.

Sign in with the invited ChatGPT account. The page displays the signed-in identity and a **Sign out** link. Pairing connects this web identity to one Ambiguous participant; signing in alone does not establish that link.

The hosted page has three main areas:

1. **Your check-in**: account pairing, preferences, the current workflow and presentation preparation.
2. **Provider connections** for the connection owner, or a **Team connection** explanation for other admitted users.
3. **Primtal assistant**: setup help through the shared model connection, available to the owner and appropriately paired teammates.

## Provider connections: owner setup

| Control | What it does |
| --- | --- |
| **Ambiguous agent key** | Connects the Primtal agent that can participate in DMs and access calendars shared with it. Use an agent key, not a personal account password. |
| **OpenRouter API key** | Enables optional text routing and the setup assistant. The six choice questions do not need a model call. |
| Consent checkbox | Authorises server storage and validation of the entered provider credentials. |
| **Validate & save keys** | Calls both providers, checks the agent identity, and encrypts successfully validated credentials on the server. |
| **Use saved key / Replace key** | Keeps an existing agent credential or supplies a replacement. Saved credentials are not returned to the page. |

Leave a saved OpenRouter key blank to keep it. If one service fails validation, the page reports the error; a credential successfully validated for the other service may already have been saved. Fix the failing connection and validate again.

The saved validation date is the last check, not continuous proof that a provider is currently available. Model quotas, permissions and service availability can change.

## Your check-in: pairing and preferences

First, open a private conversation containing exactly you and Primtal in Ambiguous.

| Control | What it does |
| --- | --- |
| **Open Ambiguous** | Opens the messenger in a separate tab. |
| **Enable background bot** | Owner control that enables the hosted processing schedule and supported message-event automations. |
| **Create pairing command** | Generates a single-use `PAIR …` command. Send it in your own Primtal DM within 10 minutes. It is not an API key. |
| **Your calendar** | Lists calendars owned by your paired participant and visible to Primtal in the same workspace. Share the intended calendar with Primtal as Editor. |
| **Daily time / Time zone** | Selects the reminder time in an IANA zone such as `Europe/Madrid`. |
| **Send me a daily check-in** | Enables the personal daily schedule when saved. |
| Personal-data consent checkbox | Records agreement to private answer storage, optional-note processing and calendar reading. Approval of a particular calendar change is separate. |
| **Save preferences** | Saves the calendar selection, time, zone, reminder setting and consent. |
| **Send check-in to my DM** | Starts a check-in immediately for the paired participant, or resumes the existing unfinished one. This sends a real message. |

Use **Save preferences** before relying on changed reminder settings. Pressing **Send check-in to my DM** is an immediate launch, not a substitute for saving the daily schedule.

If no calendar is shared, the questions can still run; calendar review will explain the missing connection. The selector's **Check-in without calendar** option does not revoke an Ambiguous permission. The backend can automatically choose a sole shared, owned calendar; to remove calendar access, revoke the calendar share in Ambiguous.

**Background last checked** shows the most recent runner heartbeat. The visible panel also refreshes approximately every five seconds. Neither indicator guarantees a response-time deadline. Once background processing is enabled, closing the panel or the owner's computer does not stop the hosted bot.

## Current question and calendar controls

After launch, the panel mirrors the current question and answer buttons. You can select an answer there or in the paired DM; both operate on the same session. An old question or stale approval is rejected.

| Control | Result |
| --- | --- |
| A labelled answer | Saves the selection and advances the workflow without a model call for a daily choice. |
| **Review my calendar** | After all six answers, refreshes the calendar analysis when safety routing permits it. It does not itself create or move an event. |
| **Protect this hour** | Confirms creation of the proposed one-hour private focus event. |
| **Keep my calendar** | Declines the focus proposal. |
| **Move to working hours** | Confirms the specific meeting move shown in the proposal. |
| **Keep this meeting** | Declines that meeting move. |
| **Open calendar event** | Opens the actual event in Ambiguous. |
| **Undo this focus block** | Removes the focus event created by this check-in. |
| **Restore original time** | Restores the moved meeting if the original time remains usable and the event still passes validation. |
| **Stop check-in** | Stops the current flow and disables this participant's daily reminders. |

The page also supports fallback approval/undo buttons when a session has a proposal without a choice card. The normal flow uses the labelled choices above. Purple identifies events created or changed through Primtal.

## Presentation setup

This expandable area appears for a paired account. It prepares data only for that account, not for an arbitrary teammate.

| Control | Writes and limits |
| --- | --- |
| **Prepare 10 past workdays** | Attempts to add synthetic answers and a matching private calendar event for each of the previous 10 weekdays: five late-meeting examples and five other workdays. Existing recorded answers and conflicting calendar slots are preserved, so fewer than 10 days may be prepared. |
| **Add work events for today** | Attempts to add eight fictional work blocks to today's real calendar. Existing or conflicting blocks are skipped. |
| **Remove synthetic answers** | Deletes the prepared answer records. It keeps calendar events and recorded answers. |

The checkbox explicitly acknowledges synthetic preparation. Calendar writes happen when you press a preparation button; they do not wait for a later focus/meeting approval. Preparation runs day by day, so completed work is retained if a request fails. Resume when safe; inspect the calendar first if a write is reported as unconfirmed.

The comparison labels prepared history as synthetic. It demonstrates the algorithm and must not be presented as evidence about a person's real wellbeing.

## Primtal assistant

Ask questions such as “How do I connect my calendar?” or “How do I turn on reminders?” The assistant provides setup guidance through OpenRouter. It has no action tools and cannot start check-ins, read your live calendar or create events through the chat. Use the corresponding panel controls or DM choices to perform those actions. Do not paste credentials into the chat.

## A first successful run

1. The owner saves both provider credentials and enables background processing.
2. You pair your web account with your own Primtal DM.
3. Share your own calendar as Editor, select it, set consent and save preferences.
4. Press **Send check-in to my DM** and answer all six questions.
5. Add a short note or select **Continue to my calendar**.
6. Review the evidence and proposed time. Confirm only the action you want.
7. Open the event and, if appropriate, demonstrate the available undo action.

For errors, use [troubleshooting](OPERATIONS.md#troubleshooting).
