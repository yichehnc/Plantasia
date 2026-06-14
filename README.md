# Plantasia

Plantasia is a mobile-first plant care archive inspired by the mood of the original *Mother Earth's Plantasia* cover. It combines a curated visual tone with practical plant tracking: status filters, watering cues, journal notes, image upload, and responsive plant cards designed for phone-sized screens first.

![Plantasia landing page](docs/screenshot.png)

## What It Does

- Opens with a Plantasia-inspired cover-led hero instead of a text-heavy landing block.
- Seeds the archive with 11 houseplants and local pixel-plant artwork.
- Lets users browse the collection through status filters: `All`, `Needs Attention`, `Thriving`, and `Alive`.
- Stores plant updates in `localStorage`, so watering and journal changes survive refreshes.
- Supports adding a plant with either a generated pixel placeholder or an uploaded photo.
- Includes plant detail views for care information, watering actions, and journal history.
- Prioritizes calmer interaction design with reduced hover motion and cleaner mobile spacing.

## Current UX Direction

- No irrelevant stock photography in the product experience.
- Original Plantasia cover mood in the hero, but a cleaner modern archive below it.
- Mobile usability first: simplified sections, persistent add action, and tighter card layouts.
- Consistent status color system across filters and plant cards.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion
- Tone.js
- Lucide React

## Run Locally

Prerequisite: Node.js

```bash
npm install
npm run dev
```

Default local URL:

```text
http://127.0.0.1:3000
```

## Useful Commands

```bash
npm run lint
npm run build
```

## Notes

- Uploaded plant photos are read locally in the browser and stored in app state / browser storage for the current user.
- Seeded plants still default to deterministic pixel illustrations until a user uploads their own image.
- The project is currently optimized around the frontend archive experience rather than a backend data service.
