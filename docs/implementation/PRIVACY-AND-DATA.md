# Privacy, consent and data handling

[Documentation home](../README.md)

This describes current application behaviour, not a certification or a promise of end-to-end confidentiality.

## Consent and access

- Onboarding explains storage, optional-note processing and calendar reading before **AGREE**.
- The participant separately grants the bot access to an owned calendar in Ambiguous.
- Ordinary calendar proposals require confirmation of the specific action and time.
- Presentation preparation has its own synthetic-data acknowledgement and explicitly writes example calendar events when launched.
- Web actions resolve the signed-in account's binding. DM actions resolve the participant in an exact two-person conversation with Primtal.
- There is no participant-facing query for another user's answers and no manager analytics dashboard.

The owner operates shared provider credentials, but the panel does not expose an account switcher for reading other participants' answers. Infrastructure operators with database access and the server encryption key remain part of the trust boundary.

## Where data goes

| Data | Handling |
| --- | --- |
| Provider credentials | Validated with the respective provider and stored in an encrypted server payload; not returned by the connection-status route. |
| Daily answers and current workflow | Encrypted application payloads in D1, with participant/day indexes outside the payload. |
| Free text | Sent through OpenRouter for safety routing when required; a user note can also be stored with the check-in. This includes non-command text during the flow. |
| Setup-assistant conversation | Sent to OpenRouter for a help reply. It is not a tool for reading live calendar or answer history. |
| Calendar context | Retrieved from the selected owned calendar by server code for counting, comparison and slot search. The current calendar analysis does not send these events to the model. |
| Calendar writes | Event time, neutral title/description and colour go to Ambiguous. Wellbeing answers are not placed in titles or descriptions. |
| Messages and choice cards | Remain in the participant's Ambiguous conversation under that service's access and retention behaviour. |

AES-GCM protects selected server payloads with `PRIMTAL_ENCRYPTION_KEY`. Participant IDs, dates, hashed pairing codes, automation identifiers, heartbeats and write-journal metadata are not all encrypted. Anyone controlling both the database and key can decrypt stored payloads.

OpenRouter requests ask for providers that deny data collection and for zero-price inference. Those request options are not a guarantee that data never leaves the service or that no provider processing occurs.

## Synthetic and recorded data

Presentation answers use separate synthetic record identifiers. A recorded answer takes precedence for the same day in pattern comparisons. The displayed comparison discloses synthetic days. Synthetic records are excluded from optional-follow-up history.

Prepared calendar entries are real objects, not a visual overlay. They can affect the busy-time total until removed from Ambiguous. **Remove synthetic answers** deletes answer records only; it does not undo calendar preparation.

## Stop and deletion

| Action | Removes or changes | Keeps |
| --- | --- | --- |
| `STOP` or **Stop check-in** | Stops the current flow and disables personal reminders. | Stored answers, pairing, consent and calendar events. |
| **Remove synthetic answers** | Prepared synthetic check-in records for the paired participant. | Recorded answers, calendar events and operational write journals. |
| `DELETE MY DATA` | Participant record/preferences, web binding, current session and completed check-in rows, including synthetic answers. | Ambiguous messages, calendar events, shared provider configuration and operational records in `settings`. |
| Revoke calendar sharing in Ambiguous | Removes the bot's access to that calendar. | Previously stored check-ins and events already created. |

The application does not implement comprehensive timed retention or erase every operational trace with `DELETE MY DATA`. Backups and the external providers' retained data are outside this command. Deleting the participant record permits a new opt-in later; it is not a permanent blocklist.

## Support behaviour

Daily answers are proxies and are not combined into a diagnostic score. Uncertain or failed note assessment pauses schedule suggestions. A positive PHQ-9 self-harm-item response also pauses suggestions, without establishing immediate danger by itself.

The support response does not contact a therapist, manager, EAP or emergency service. Primtal does not continuously monitor the conversation. Do not present the prototype as clinical care or as a guaranteed crisis detector.
