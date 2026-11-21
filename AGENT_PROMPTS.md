# Agent prompt pack

Copy each prompt into an agent. Replace the bracketed inputs. If the agent cannot browse Pinterest, tell it to ask you for a pasted export instead of guessing.

## 1. Demand harvest

```text
You are a niche research assistant.

Niche: [NICHE]
Audience: [AUDIENCE]
Country: [COUNTRY]
Competitor boards or accounts: [LIST]

Task:
1. Using Pinterest search autocomplete, related searches, "more ideas" labels, board titles and Google autocomplete, list 30 search phrases people in this niche actually type.
2. Group the phrases into 8 topic clusters. Name each cluster.
3. For each phrase, mark commercial intent as low, medium or high, with a 4-word reason.
4. Mark any metric you cannot verify as "unknown". Do not invent search volumes.

Output a CSV with columns: phrase, cluster, intent, evidence, confidence.
```

## 2. Score and shortlist

```text
Input: the CSV from prompt 1.

Score each cluster 1-5 on: demand evidence, buying intent, content gap, evergreen potential, monetization fit.
Use this formula and show your arithmetic:
Opportunity = demand × intent × (6 - competition) × monetization / 25

Output:
- Top 10 clusters, each with a one-line rationale and a recommended page angle.
- 3 clusters to drop, each with one reason.
```

## 3. Topic page copy

```text
Input:
Title: [TITLE]
Audience: [AUDIENCE]
Facts: [FIVE FACTS]
CTA URL: [URL]

Write:
- SEO title, maximum 60 characters
- Meta description, maximum 155 characters
- A 2-sentence lede
- 5 bullets, each maximum 12 words, practical rather than hype
- CTA label, maximum 25 characters
- 3 Pinterest headline variants, each maximum 40 characters

Tone: calm, specific, useful. No exclamation marks. No claims you cannot support.
```

## 4. Pin variants

```text
Input: the 3 headlines from prompt 3, the topic angle, base URL [BASE_URL] and slug [SLUG].

Generate 10 Pin concepts. For each give:
- Overlay text, maximum 40 characters
- Visual direction in 8 words
- UTM link: [BASE_URL]/topics/[SLUG]/?utm_source=pinterest&utm_medium=organic&utm_campaign=[SLUG]
- Label: test or reuse

A human reviews every concept before anything is published.
```

## 5. Weekly analyzer

```text
Input: analytics export with columns topic, date, clicks, signups, utm_campaign, and optional impressions and spend.

Compute signup rate = signups / clicks. If impressions exist, compute click rate = clicks / impressions.
Rank topics by signup rate first, then volume.

Output:
- 3 topics to scale, with reasons
- 3 topics to kill, with reasons
- 3 next-week experiments, each naming the exact headline, image or CTA to change
- One paragraph on what the data does NOT tell you
```

## How to chain them

1. Run prompts 1 and 2 to pick topics.
2. Put the winners into `topics.json`, then run `node build.js`.
3. Run prompts 3 and 4 to write copy and Pin concepts.
4. Publish Pins manually or with native Pinterest scheduling.
5. Run prompt 5 every 7 days. Feed its winners back into prompt 1.

## Guardrails

- Never let an agent invent metrics.
- Never auto-post to Pinterest without approval; its publishing API is gated.
- Disclose affiliate links on every page and Pin.
- Keep a human in the loop for copy and images.
