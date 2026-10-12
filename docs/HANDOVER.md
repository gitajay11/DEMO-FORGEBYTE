# Redesign — handover note

Branch: `redesign`. Production (`main`, www.forgebyte.online) is untouched.
A full copy of the pre-redesign project is at `C:\Users\ajaya\Projects\backup forgebyte`.

## Confirm before merging — facts I assumed

| Item | What the site says now | Where to change |
| --- | --- | --- |
| Founder name | Ajay Kumar | `lib/content.ts` → `studio.founder` |
| City / coordinates | Chennai · 13.08°N 80.27°E | `studio.city`, `studio.coords` |
| Founded | Est. 2026 | `studio.est` |
| Availability | Accepting projects · Q4 2026 | `studio.availability` |
| Reply time | Within 1 working day | `studio.replyWithin` |
| Project years / role | 2026 · Design & development, for all four | `caseStudies[].year`, `.role` |
| Élaré Beauty | Shown as a client project, "In progress" | `caseStudies` |
| AI service line | "Smart assistants (AI)" is sold as a service | `services` |
| Services list | Websites & web apps · Online stores & payments · Quick first versions · Smart assistants (AI) · Care after launch. "Online stores" replaced the old "APIs & backend" line, based on the Sri Cauvery and Élaré work | `services` |

## Confirm before merging — policies I wrote

These read as commitments to clients. Each is plausible for a small studio,
but none existed before. Keep, edit or delete:

- **FAQ:** "Code, accounts and IP transfer to you on final payment." · "Yes,
  we sign NDAs." · "Every project includes a support window."
- **Durations:** websites 6–12 weeks, online stores 4–10, first versions 4–6,
  AI assistants 2–6; process steps 1–3 days, 2–5 days, about a week.
- **Engagement:** discovery call "No obligation"; support at a "Monthly rate".
- **Budget ranges in the form:** Under ₹1 lakh · ₹1–3 lakh · ₹3–8 lakh · ₹8 lakh +.
- **About page** (`app/studio/page.tsx`): five beliefs and four "what working
  with us is like" promises (plain English, fixed price, weekly updates, help
  after launch).
- **Privacy page** (`app/privacy/page.tsx`): a plain-language draft.

## Still missing (placeholders by design, nothing invented)

1. Written consent from Loopa/Nutriyah, Sri Cauvery Electronics and Élaré to
   be shown as case studies (they were already public on the old site).
2. Testimonials — the Proof section shows a worked example instead.
3. Any measured outcome — every case study is labelled "Qualitative · no
   metrics recorded".
4. A booking link (Cal.com etc.) — WhatsApp stands in.
5. A founder photo — the dithered "AK" is a typographic stand-in.

## Deployment notes

- **Preview builds are off** in the Vercel project: every deployment on record
  is Production from `main`, so pushing `redesign` produced no preview URL.
  To get one: Vercel → Project → Settings → Git → enable deployments for
  non-production branches (or run `vercel` from the CLI). Then every push to
  `redesign` gets its own URL.
- **Vercel Analytics custom events** (`cta_click`, `form_start`,
  `form_submit`, `booking_click`, `case_study_depth`) need Web Analytics
  enabled on the project; custom events require a Pro plan. Page views work
  on Hobby.
- Environment variables are unchanged: `GROQ_API_KEY`, `SMTP_HOST`,
  `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.

## Deliberate deviations from the brief

- **Blue instead of violet, plus a light theme** — owner request.
- **ABI intro kept** (owner request) ahead of the hero's own opening
  sequence; it still plays on every full load.
- **three.js without React Three Fiber / Drei; no Lenis, no Framer Motion** —
  see `docs/AUDIT.md` → Technology decisions. Keeps bundles small and every
  GPU resource on one explicit dispose path.
- **Projects show real screenshots, not animated worlds** — owner request;
  each sits in a browser frame with its real address. Only the hero uses 3D.
- **Gyroscope tilt not implemented** — it needs an iOS permission prompt;
  touch gets tap pulses instead.
- **Sticky navbar** — owner request: always visible (no hide-on-scroll). Past
  the hero it turns solid and shows "We build things. We question things.";
  its button turns lime only then, so the hero's lime button is never doubled.
  Between 1024 and 1179px wide the tagline is hidden to leave room for links.
- **Plain language** — owner request: copy rewritten for non-technical
  visitors; coordinates, tech stacks and the tools map removed from the main
  text (stacks remain as one small "Built with" line per case study).

## Not verified here

Lighthouse, real iOS Safari / Android Chrome devices, VoiceOver and NVDA.
Run them against a preview deployment before merging to `main`.
