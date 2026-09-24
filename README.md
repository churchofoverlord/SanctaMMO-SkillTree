# SanctaMMO Primary Skill Tree Simulator

Public static simulator for the current Fighter, Scout, Mage and Mystic Primary Skill Trees.

The implementation follows **SanctaMMO - Skill Tree Simulator Reference**:

- 20 purchasable investments per class and a maximum allocation of 13 Skill Points;
- vertical tiers with thresholds at 0 / 5 / 9 / 11 learned nodes;
- tier rows and authored `column` positions define the layout; placement is presentation, not a gameplay rule;
- three Granted/Core family slots per class;
- authored prerequisites and Mage specialization exclusivity;
- hovering a slot shows its skill tooltip;
- clicking an Available slot learns it, with confirmation for exclusive specializations;
- one confirmed full-tree reset and no individual refunds;
- action-bar style square slots with explicit Available, Hover, Learned, Locked and Excluded states;
- concrete lock reasons;
- player-facing descriptions, compact technical fields and explicit semantic keyword tags.

## Investments and execution forms

An investment or Granted slot owns one progression identity. It is purchased, learned, reset and counted for tier gates once. Its `forms` array contains the executions selected by authoritative context; forms have no SP cost, learned state, prerequisite or ownership of their own.

Each investment has a stable `investmentId`, and each Granted slot has a stable `grantedSlotId`. Forms carry a stable `id`, display `name`, explicit context selector/capture point, player-facing `description`, independent gameplay `fields`, ordered `effects`, semantic `keywords`, `technicalNotes`, and `presentation` keys. Form IDs use `<stable-parent-id>.<context-slug>` (for example `fighter.shoulder-rush-ii.warrior`). They do not depend on display names. VFX, animation and audio keys are currently `null`; the IDs and key slots exist without assigning assets.

Roman numerals identify base/deepening progression (`Skill I`, `Skill II`, and so on). Context names follow the identity, such as `Ether II — Ally` and `Shoulder Rush II — Tank`. Legacy names remain metadata only. The tooltip lists every form's description and stats while keeping a single tree node and one purchase.

Basic Attack remains a Universal Action and is not counted as an investment.

## Layout and icons

Each investment stores its `tier` and a 1-based `column`. Linked investments share a column across tiers so prerequisite lines stay vertical, and unrelated investments reuse a column when their tier spans do not overlap. `qa.mjs` rejects two investments in one cell and any prerequisite line that passes through another investment.

Every Granted slot, investment and Universal Action lists `iconKeys` (one key, or two for a split Warrior/Tank, Sun/Moon or Ally/Enemy slot), and every form names its own `presentation.iconKey`. Keys such as `fighter/shoulder_rush_warrior` resolve through `data/icons.js`, which maps each key to a cell of the shared sprite sheet or to a standalone asset, and also lists the class emblems.

See [SPEC.md](SPEC.md) for the in-game implementation reference: progression rules, interactions, slot states and visual tokens.

Run `node qa.mjs` from the repository root. The site uses plain HTML, CSS and JavaScript without a build step.
