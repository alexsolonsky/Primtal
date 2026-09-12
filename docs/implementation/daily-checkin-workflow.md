# Primtal Daily Check-In: Workflow and Demo Scenario

## Goal

Create a daily wellbeing workflow that:

1. Sends the user five Tier 1 questions each day.
2. Uses concerning responses to select the relevant full questionnaire.
3. Reviews the user's answers together with today's calendar.
4. Retrieves wellbeing and calendar history for the previous seven days.
5. Identifies recurring associations between calendar events and wellbeing.
6. Suggests practical schedule changes without automatically changing the calendar.

Questionnaire results must be described as screening results or symptom levels, not medical diagnoses. Calendar patterns must be described as associations, not proof that an event caused a change in wellbeing.

## Questionnaire Domains

The daily check-in covers five domains:

1. Depression -> PHQ-9
2. Anxiety -> GAD-7
3. Burnout -> BAT-12
4. ADHD-related focus difficulties -> ASRS v1.1 6Q
5. Technostress -> selected full technostress questionnaire

Each Tier 1 question is a daily routing and trend signal. It is not a diagnostic instrument and does not replace the corresponding full questionnaire.

## Tier 1 Daily Check-In

Ask all five questions in this order.

### 1. Depression

> How much have you enjoyed the things you normally enjoy today?

- 1 = Not at all
- 2 = A little
- 3 = Somewhat
- 4 = Mostly
- 5 = Just as much as usual

### 2. Anxiety

> How on edge or worried did you feel today?

- 1 = Very calm
- 2 = Mostly calm
- 3 = A bit on edge
- 4 = Quite on edge
- 5 = Very on edge

### 3. Burnout

> How drained or worn out do you feel from work today?

- 1 = Fully recharged
- 2 = Mostly fine
- 3 = A bit drained
- 4 = Quite drained
- 5 = Completely drained

### 4. ADHD-Related Focus

> How hard was it to stay focused or follow through on things today?

- 1 = Easy
- 2 = Mostly easy
- 3 = Somewhat hard
- 4 = Quite hard
- 5 = Very hard

### 5. Technostress

> How overwhelmed did notifications or screens make you feel today?

- 1 = Not at all
- 2 = A little
- 3 = Somewhat
- 4 = Quite a bit
- 5 = Very overwhelmed

## Response Normalization

The depression question runs in the opposite direction from the other four questions.

### Depression

| Score | State |
|---|---|
| 4-5 | Good |
| 3 | Watch |
| 1-2 | Concern |

### Anxiety, Burnout, ADHD-Related Focus and Technostress

| Score | State |
|---|---|
| 1-2 | Good |
| 3 | Watch |
| 4-5 | Concern |

## Daily Workflow

### Step 1: Collect the Daily Answers

Send all five Tier 1 questions.

Collect all five answers before evaluating the daily check-in.

Save each answer under its corresponding domain and retain the original 1-5 value.

### Step 2: Evaluate Each Domain

Evaluate the five domains separately.

A concerning result in one domain must not automatically create a concerning result in another domain.

Possible states are:

- **Good:** The response does not indicate a meaningful current concern.
- **Watch:** The response indicates a moderate difficulty that should be recorded and monitored.
- **Concern:** The response suggests that the user may be struggling and should receive the corresponding full questionnaire.
- **Crisis:** The user reports a possible immediate safety risk, either through a direct statement or through the self-harm question in PHQ-9.

### Step 3: Select the Appropriate Branch

#### Good Branch

If all five responses are good:

1. Acknowledge that the check-in has been completed.
2. Do not send a full questionnaire.
3. Save the Tier 1 answers as part of today's history.
4. End the check-in with a brief neutral response.

#### Watch Branch

If one or more domains receive a watch result:

1. Record the result as part of today's history.
2. Do not immediately send a full questionnaire based on a single watch response.
3. Check whether the same domain has repeatedly received watch results during recent check-ins.
4. If the watch result has become a recurring pattern, treat it as a concern and offer the corresponding full questionnaire.

#### Concern Branch

If one domain receives a concern result:

1. Acknowledge the specific area in which the user appears to be struggling.
2. Explain that a more detailed questionnaire can provide additional context.
3. Send the full questionnaire associated with that domain.
4. Collect all answers.
5. Calculate the questionnaire score according to its official scoring rules.
6. Interpret the result as a screening result or symptom level.
7. Do not present the result as a diagnosis.

Questionnaire routing:

- **Depression concern:** Send PHQ-9.
- **Anxiety concern:** Send GAD-7.
- **Burnout concern:** Send BAT-12.
- **ADHD-related focus concern:** Send ASRS v1.1 6Q if the user has not completed it recently.
- **Technostress concern:** Send the selected full technostress questionnaire.

For an ADHD-related focus concern, explain that the Tier 1 response describes today's focus, while ASRS assesses symptoms over a much longer period. Do not describe a single difficult day as evidence of ADHD.

#### Multiple-Concern Branch

If several domains receive concern results:

1. Identify all triggered domains.
2. Present the corresponding full questionnaires one at a time.
3. Keep all questionnaire results separate.
4. Do not combine the results into one overall mental-health score.
5. Complete the safety evaluation before continuing to calendar analysis.

#### Crisis Branch

The five numerical Tier 1 questions cannot independently identify a crisis.

Start the crisis branch if:

1. The user directly reports an immediate safety concern; or
2. The completed PHQ-9 contains a positive response to its self-harm question.

When the crisis branch is triggered:

1. Stop the ordinary schedule-analysis workflow.
2. Acknowledge the seriousness of the response.
3. Begin the psychologist or crisis-support connection flow.
4. In the hackathon scenario, clearly show that the psychologist connection is simulated.
5. Do not make calendar optimization the primary response.

### Step 4: Interpret the Full Questionnaire

For every completed full questionnaire, record and present:

1. Questionnaire name
2. Completion date
3. Total score
4. Relevant subscale scores, where applicable
5. Screening or symptom-severity interpretation
6. The Tier 1 domain that triggered it
7. A reminder that the result is not a diagnosis

Respect each questionnaire's recall period:

- **PHQ-9:** Reflects depressive symptoms during the preceding two weeks.
- **GAD-7:** Reflects anxiety symptoms during the preceding two weeks.
- **BAT-12:** Reflects burnout complaints related to the user's work experience.
- **ASRS v1.1 6Q:** Reflects adult ADHD-related symptoms over approximately the preceding six months. It must not be interpreted as a measure of today's focus alone.
- **Technostress questionnaire:** Reflects the user's experience of technology-related demands according to the selected questionnaire's instructions.
- **Tier 1 answers:** Reflect the user's current or same-day experience.

### Step 5: Review Today's Calendar

After the relevant questionnaire has been completed, review the user's calendar for the current day.

Consider:

1. Meeting start and end times
2. Early or late meetings
3. Total meeting load
4. Consecutive meetings
5. Missing breaks
6. Events outside normal working hours
7. High-intensity or recurring events
8. Available recovery time
9. Technology-heavy meetings or activities
10. Events that resemble events seen on previous difficult days

Do not assume that an event is harmful solely because it appears on the calendar.

### Step 6: Retrieve the Previous Seven Days

Review the seven complete days immediately preceding today.

For every day, consider:

1. All five Tier 1 answers
2. Their normalized good, watch or concern states
3. Any completed full questionnaires
4. Questionnaire scores and interpretations
5. Calendar events
6. Meeting times and durations
7. Consecutive meetings
8. Events outside normal working hours
9. Available breaks and recovery periods
10. Previously recorded schedule suggestions

Keep daily Tier 1 observations separate from questionnaires that use longer recall periods.

### Step 7: Analyze the Pattern

Compare the user's wellbeing observations with calendar characteristics across the seven-day history and today.

Possible patterns include:

1. Worse daily mood on days with late meetings
2. Greater anxiety on highly fragmented days
3. More exhaustion after consecutive meeting-heavy days
4. Greater focus difficulty after evening work
5. More technostress on days with extensive online meetings or after-hours notifications
6. Better daily responses on days with fewer meetings or more recovery time

Only report a pattern when it appears repeatedly.

Use language such as:

- "This pattern appears several times."
- "Late meetings are associated with worse daily check-in responses during this seven-day period."
- "This schedule pattern may be contributing to the change."
- "There is not enough information to establish causation."

Do not say that a calendar event caused depression, anxiety, ADHD or burnout.

PHQ-9 must not be treated as a same-day stress measure. A late meeting may be associated with worse daily Tier 1 mood or stress responses, while PHQ-9 provides broader information about depressive symptoms during the preceding two weeks.

### Step 8: Suggest Schedule Changes

Suggestions must be directly connected to the observed calendar pattern.

Possible suggestions include:

1. Move a recurring late meeting to an earlier time.
2. Shorten the meeting.
3. Reduce its frequency.
4. Add a recovery period before or after it.
5. Avoid scheduling other demanding events immediately around it.
6. Protect the evening from additional work.
7. Reduce consecutive meetings.
8. Add breaks to meeting-heavy periods.
9. Try the change for several days and compare subsequent daily check-ins.

Do not automatically change the calendar.

Present the proposed changes and ask the user whether they want to apply them.

## Expected Daily Result

The final response should contain:

1. Today's Tier 1 check-in summary
2. The domain that triggered a full questionnaire
3. The questionnaire result and interpretation
4. Relevant events in today's calendar
5. The seven-day pattern
6. The strength and limitations of the observed association
7. Suggested schedule changes
8. A request for the user to approve or reject the suggestions

## Demo Scenario

### Historical Setup

The previous seven days contain several days with a recurring meeting scheduled at 20:00.

On days with the 20:00 meeting:

1. The user reports lower enjoyment on the depression Tier 1 question.
2. The user may report slightly greater anxiety or exhaustion.
3. The daily responses are generally worse than on days without the late meeting.
4. When PHQ-9 is triggered, the result indicates a greater depressive-symptom burden than the user's earlier baseline.

On days without the 20:00 meeting:

1. The user's daily responses are generally better.
2. The user reports more enjoyment and recovery.
3. Anxiety and exhaustion scores are generally lower.

The historical period must contain both late-meeting days and non-late-meeting days so that the agent can compare them.

### Demo Day

Today's calendar also contains the recurring meeting at 20:00.

The workflow proceeds as follows:

1. The bot sends all five Tier 1 questions.
2. The user answers the depression question with a score of 2.
3. The depression result is classified as a concern.
4. The other four Tier 1 answers do not trigger crisis handling.
5. The bot explains that it would like to check the depression domain in more detail.
6. The bot sends the complete PHQ-9.
7. The user completes PHQ-9.
8. The PHQ-9 result falls in an elevated symptom range but does not indicate an immediate crisis.
9. The agent reviews today's calendar and identifies the 20:00 meeting.
10. The agent retrieves the previous seven days of Tier 1 answers, full questionnaire results and calendar events.
11. The agent notices that 20:00 meetings repeatedly co-occur with lower daily enjoyment and worse daily wellbeing responses.
12. The agent compares late-meeting days with non-late-meeting days.
13. The agent explains that PHQ-9 reflects depressive symptoms over the preceding two weeks and cannot attribute the result to today's meeting alone.
14. The agent describes the late-meeting relationship as an association rather than causation.
15. The agent suggests moving the meeting earlier, shortening it or adding protected recovery time.
16. The agent asks whether the user wants to apply any of the proposed changes.

## Example Demo Conclusion

> Your depression check-in was more concerning today, and the follow-up PHQ-9 indicates elevated depressive symptoms over the past two weeks.
>
> Today includes an 8:00 PM meeting. Similar late meetings appeared several times during the previous seven days, and those days also had lower enjoyment and worse daily wellbeing responses than days without late meetings.
>
> This does not prove that the meeting is causing the change. However, the pattern appears repeatedly enough to make the meeting time a reasonable schedule factor to test.
>
> You could move the meeting earlier, shorten it or protect recovery time afterward. We can then compare your daily check-ins over the following week.
>
> Would you like to review these possible schedule changes?
