export const questions = [
  {
    "id": "daily_mood",
    "construct": "mood",
    "question": "How are you feeling today?",
    "scale_labels": {
      "1": "Very low",
      "2": "Low",
      "3": "Okay",
      "4": "Good",
      "5": "Very good"
    }
  },
  {
    "id": "depression_proxy",
    "construct": "depression",
    "question": "How much have you enjoyed the things you normally enjoy today?",
    "scale_labels": {
      "1": "Not at all",
      "2": "A little",
      "3": "Somewhat",
      "4": "Mostly",
      "5": "Just as much as usual"
    }
  },
  {
    "id": "anxiety_proxy",
    "construct": "anxiety",
    "question": "How on edge or worried did you feel today?",
    "scale_labels": {
      "1": "Very calm",
      "2": "Mostly calm",
      "3": "A bit on edge",
      "4": "Quite on edge",
      "5": "Very on edge"
    }
  },
  {
    "id": "burnout_proxy",
    "construct": "burnout",
    "question": "How drained or worn out do you feel from work today?",
    "scale_labels": {
      "1": "Fully recharged",
      "2": "Mostly fine",
      "3": "A bit drained",
      "4": "Quite drained",
      "5": "Completely drained"
    }
  },
  {
    "id": "adhd_proxy",
    "construct": "adhd",
    "question": "How hard was it to stay focused or follow through on things today?",
    "scale_labels": {
      "1": "Easy",
      "2": "Mostly easy",
      "3": "Somewhat hard",
      "4": "Quite hard",
      "5": "Very hard"
    }
  },
  {
    "id": "technostress_proxy",
    "construct": "technostress",
    "question": "How overwhelmed did notifications or screens make you feel today?",
    "scale_labels": {
      "1": "Not at all",
      "2": "A little",
      "3": "Somewhat",
      "4": "Quite a bit",
      "5": "Very overwhelmed"
    }
  }
] as const;
export type Domain = typeof questions[number]["construct"];
export type State = "good" | "watch" | "concern";
export function normalize(domain: Domain, value: number):State { if (!Number.isInteger(value)||value<1||value>5) throw new Error("Choose 1–5"); const severity = domain === "mood" || domain === "depression" ? 6-value : value; return severity >= 4 ? "concern" : severity===3 ? "watch" : "good"; }
export function promptQuestion(index:number){const q=questions[index];return `**${index+1} of 6 · Daily check-in**\n${q.question}\n\n${Object.entries(q.scale_labels).map(([n,label])=>`${n}. ${label}`).join("\n")}\n\nReply with one number (1–5). Type STOP to end.`;}
