# Product

## Register

brand

## Users

Costa Rican secondary-school students and recent graduates. Two preparation
options share this marketing site: Estandarizadas and Admisión. Most visitors
arrive on mobile devices, sometimes over slow or metered connections.

Secondary audience: parents and guardians who need to understand the scope of
each option and, for Admisión, its paid plan.

## Product Purpose

This Astro site helps students choose their preparation and enter the right app.
The shared home presents both options with comparable visibility. Estandarizadas
comes first and receives modest emphasis as the newer offering.

- **Estandarizadas** (`/estandarizadas`): a Mathematics pilot for secondary
  academic day schools, at estandarizadas.ubotcr.com. Topic practice, tutoring,
  daily exams, materials and results depend on the available catalog. Do not
  promise complete syllabus coverage, other subjects, full mock exams, prices
  or Admisión Premium benefits. Ubot practice results are not official MEP results.
- **Admisión** (`/admision`): preparation for UCR, UNA and TEC, at chat.ubotcr.com.
  The admission season has ended; diagnostic assessments, mock exams, AI chat,
  games and practice remain available. Existing free and Premium plans belong
  to Admisión and are described on `/pricing`.

Use Costa Rican Spanish and student-facing labels such as “¿Para qué te estás
preparando?” and “Elegí tu preparación”. Name each option directly rather than
calling them “programas”. Keep both information pages and app entry points easy
to find. The calendar retains admission dates; seasonal copy changes manually.

## Brand Personality

Confident, motivating, expert. Ubot is a coach that believes in the student —
direct and encouraging, never lecturing or corporate. The voice is Costa Rican
Spanish, plain and warm, the kind of tone a good study partner uses: "you've got
this, here's the next rep." Emotionally the goal is confidence plus momentum —
lower exam anxiety by making progress visible and practice feel repeatable, not
by hyping the AI.

## Anti-references

What this must NOT look like.

- **Generic SaaS / AI-tool landing.** No indigo-to-violet gradient blobs, no
  glassmorphism cards as decoration, no hero-metric template (big number, tiny
  uppercase label, supporting stats), no endless identical icon-card grids. These
  read as template, not as a product made for Costa Rican students.
- **Dark-mode cliché / neon AI.** No "dark because tools look cool," no neon glow,
  no trendy AI aesthetic that trades legibility for mood. The dark theme is a
  deliberate choice to serve night-time, low-data, mobile study sessions — not a
  vibe.
- **Stiff corporate / formal.** No university-brochure formality, no corporate
  stiffness, no stock-photo earnestness. This is a coach, not an institution.

## Design Principles

1. **Practice what you preach.** Ubot sells an intelligent, well-crafted study
   tool; the landing page must itself feel intelligent and well-crafted. Generic
   template moves undermine the product promise. The craft is the proof.
2. **Coach, don't lecture.** Every section should push the student forward — show
   momentum, ranking, streaks, the next rep — rather than lecture about features.
   Confidence comes from visible progress, not from adjectives.
3. **Show, don't tell.** Show the product in action (real exam formats, the chat,
   the ranking) instead of asserting "AI-powered learning." Specifics beat
   abstractions; real university names and real prices in colones beat buzzwords.
4. **Accessibility is access.** The product's entire promise is access to exam
   prep for every Costa Rican student. The site must work on the devices and
   connections those students actually have: fast on mobile, legible at WCAG AA,
   graceful on slow networks. Performance and accessibility are brand promises,
   not checkboxes.
5. **Expert confidence, not hype.** Earn trust through clarity and specificity —
   the three universities, the real exam models, the actual price in colones —
   not through gradient spectacle or AI buzzwords. Calm authority.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body and placeholder text must meet 4.5:1 contrast against
their background; large text and UI boundaries 3:1. Full keyboard support for
navigation, dropdowns, the gallery lightbox, and the FAQ accordion (the latter
already uses native `<details>`). Every animation needs a
`prefers-reduced-motion` alternative. Icons are decorative unless they carry
meaning, in which case they get an accessible label. Language is Costa Rican
Spanish throughout (`lang="es"`).

Because the audience is on mixed mobile devices and sometimes slow or metered
connections, performance is an accessibility concern: defer non-critical work,
lazy-load below-the-fold media, and keep the page usable before JavaScript runs.
