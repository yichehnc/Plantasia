# Plantasia TODO

Plantasia already has a strong first prototype: poster-style plant cards, a detail modal, watering/misting interactions, journal entries, and generative audio. The next work should turn that prototype into a dependable care tool without losing the editorial "living archive" personality.

## Phase 1: Stabilize the Prototype

- [ ] Install dependencies and verify the app with `npm run lint` and `npm run build`.
- [ ] Rename the package from the placeholder `react-example` to `plantasia`.
- [ ] Replace the generic AI Studio README with project-specific setup, development, and product notes.
- [ ] Remove or justify unused AI Studio/Gemini configuration if the app is not using AI features yet.
- [ ] Remove or justify unused backend dependencies such as `express` and `better-sqlite3`.
- [ ] Fix plant status typing and display mismatches:
  - Normalize `Dead` vs `DEAD`.
  - Normalize `Needs Attention` vs `Not okay`.
  - Decide whether CSV statuses such as `Meh`, `Under Watch`, and `Propogated` become first-class statuses.
- [ ] Fix mojibake in environmental labels so Chinese text renders correctly.
- [ ] Check mobile layout behavior for the poster header, plant grid, and detail modal.

## Phase 2: Import the Real Plant Collection

- [ ] Convert the full 23-plant CSV into structured seed data.
- [ ] Preserve CSV fields: pet friendly, name, status, light, water, watering frequency, notes, temperature/environment, common issues, repotted date, and purchase date.
- [ ] Clean CSV values during import:
  - Trim plant names.
  - Correct obvious typos such as `Propogated` to `Propagated`.
  - Map water values like `💧<300ml`, `💧💧600ml`, `💧💧💧1.2L`, `Bath`, and `mist`.
  - Map light values like `Direct`, `Moderate`, and `Indirect Bright Light`.
- [ ] Decide how to handle incomplete plants with blank care fields.
- [ ] Keep placeholder image URLs only temporarily; mark plants that need real photos.

## Phase 3: Add Persistence

- [ ] Save plant state to `localStorage` so updates survive refresh.
- [ ] Persist watering, misting, vibrancy, and journal entries.
- [ ] Add a safe reset/import path for returning to seed data during development.
- [ ] Add a small schema version so future data migrations are not painful.

## Phase 4: Build Real Care Scheduling

- [ ] Parse watering frequencies such as `1/week`, `2/week`, `3/week`, and `1/10days`.
- [ ] Add `nextWatering` calculation from `lastWatered`.
- [ ] Mark plants as due today, overdue, recently watered, or unscheduled.
- [ ] Make the main poster grid surface care urgency without becoming visually noisy.
- [ ] Add a Today view or Today section for plants that need attention now.
- [ ] Add care-history journal entries automatically when a plant is watered.

## Phase 5: Complete Core CRUD

- [ ] Make the `Add Plant` button open a real add-plant form.
- [ ] Add edit support for plant name, species, status, light, water amount, frequency, notes, pet safety, and dates.
- [ ] Add delete/archive support with a confirmation step.
- [ ] Add validation for required fields and unknown watering frequencies.
- [ ] Support plants with multiple pots or grouped names, such as air plants A/B/C/D/E.

## Phase 6: Improve Discovery and Daily Use

- [ ] Add search by plant name/species.
- [ ] Add filters for status, light, pet friendly, watering frequency, and due/overdue.
- [ ] Add quick actions from cards: watered, misted, add note.
- [ ] Highlight under-watch or not-okay plants more clearly.
- [ ] Add a pet-safety view for quickly finding unsafe plants.

## Phase 7: Deepen the Living Archive

- [ ] Make journal photo upload work.
- [ ] Show growth history through dated photos and notes.
- [ ] Add care event tags for repotted, fertilized, pest treatment, pruned, watered, misted, and note.
- [ ] Add plant timeline summaries: last watered, last repotted, last issue, newest leaf, recovery progress.
- [ ] Consider an optional "sick plant mode" for isolating issues and recording treatment steps.

## Phase 8: Polish the Experience

- [ ] Replace placeholder Unsplash photos with real plant photos or curated cutout assets.
- [ ] Preserve the existing editorial direction: paper texture, giant green typography, asymmetric grid, botanical labels, and archive-like details.
- [ ] Tune audio so it feels optional and delightful rather than surprising or intrusive.
- [ ] Add a visible audio toggle/preference.
- [ ] Improve accessibility for buttons, modal focus, reduced motion, contrast, and keyboard navigation.
- [ ] Test on desktop and mobile breakpoints.

## Later Ideas

- [ ] Browser notifications for watering reminders.
- [ ] Seasonal watering adjustments.
- [ ] Export/import plant data as JSON or CSV.
- [ ] AI-assisted plant diagnosis from journal photos, only after the core tracker is reliable.
- [ ] Multi-device sync, if local-only storage becomes limiting.

## Suggested Next Implementation Order

1. Stabilize type/status model.
2. Import the full CSV plant collection.
3. Add local persistence.
4. Implement watering schedule calculations.
5. Add Today/due-state UI.
6. Make add/edit plant real.
