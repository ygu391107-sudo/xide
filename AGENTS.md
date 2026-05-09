# AGENTS.md

## Product Taste
This project is not a generic reading app. It is an AI learning coach that turns books into ability through active recall, spaced repetition, feedback, and real-world application.

Never optimize for displaying more information. Optimize for reducing cognitive load and guiding the user to the next useful action.

The user-facing hierarchy is:
Ability Modules > Learning Tasks > Books > Knowledge Points

Books and knowledge points are backend materials. Ability modules and daily actions are frontend experience.

## UI Direction
Use a clean Apple-inspired style:
- white and very light gray backgrounds
- soft blue accent color
- rounded 2xl cards
- generous spacing
- subtle shadows
- minimal icons
- concise Chinese copy
- no cluttered dashboards
- no gamified cartoon style
- no dense knowledge graph spider webs

## Tech
Use React and Tailwind CSS.
Use shadcn/ui if available.
Use lucide-react for icons.
Use mock data for now.
Do not add authentication, payments, backend, or database unless explicitly requested.

## Commands
After changes, run:
npm install if needed
npm run lint if available
npm run build

## Quality Bar
The prototype must be clickable, not only static.
Core flow must work:
Book → Learning Session → Blank Recall → AI Feedback → Review Schedule → Application Task

Prefer simple, readable code over over-engineering.
