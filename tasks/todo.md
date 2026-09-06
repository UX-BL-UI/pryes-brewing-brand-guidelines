# Concept generator - growth pass (2026-09-06)

Agreed with Ben 2026-09-06: clear the ground first, then more beer patterns, then new poster types. Every verified step is pushed to GitHub immediately.

## Phase 1 - clear the ground

- [x] 1. Per-type descriptor in the engine (fields, reels, color list, default words, label, renderer). Board and editor read it; the if/else ladders go away.
- [x] 2. Shape placements become first-class elements in the editor (reset, change list, migration, panel share one path).
- [x] 3. Shared page furniture: password gate, toast, custom dropdown in one `pryes-ui.js` + `pryes-ui.css`, loaded by board and editor.
- [x] 4. Beer list as defaults-plus-overrides; per-beer signature pattern slot.
- [x] 5. Deliver to Ben: the laurel pattern template file + Illustrator export steps.

## Phase 2 - beer patterns

- [x] Pattern becomes a choice: Laurels (house) or the beer's own pattern. Board reel + overlay select + editor select + recipe row.
- [ ] Wire each beer's pattern SVG as Ben supplies it (file in `assets/patterns/svg/BEIGE/`, one row per beer).

## Phase 3 - new poster types

- [ ] Ben picks the first type and supplies a reference poster; build, tune, bake (same loop as concepts 1-4).

## Review (2026-09-06)

Phase 1 complete and live (commits db8b9e0, 7728a5a, 058afde; review fixes in 7969446). Phase 2 switch built and proven with a stand-in pattern, reverted; waiting on pattern SVGs from Ben. Phase 3 waiting on Ben's first type + reference poster. Full transfer note: vault "Concept tools V2 - carry-forward" (compact transfer section).
