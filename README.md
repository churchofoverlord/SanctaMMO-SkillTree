# SanctaMMO Primary Skill Tree Simulator

Public static simulator for the four current SanctaMMO Primary class trees.

Current framework:

- Fighter, Scout, Mage and Mystic
- 20 available investments per Primary
- 13 maximum Skill Points
- Tier thresholds: 0 / 5 / 9 / 11 cumulative SP invested
- Tier pools: 7 / 6 / 4 / 3
- Authored prerequisites and branch exclusions enforced
- Single-click skills to inspect; double-click to learn/refund
- Reset Skill Points clears the current class; Reset all clears all classes
- Locked tiers show the remaining SP needed to unlock
- Conditional effects displayed in labelled description blocks
- No skill icons/images yet

The simulator is a presentation/testing surface for the current design. Canonical project documentation remains authoritative.

Development checks: run `node qa.mjs` from the repository root. The site uses plain HTML, CSS and JavaScript without a build step. Class data lives in `data/`; progression and rendering in `app.js`; conditional description formatting in `description-format.js`.
