# SanctaMMO Primary Skill Tree Simulator

Public static simulator for the current Fighter, Scout, Mage and Mystic Primary Skill Trees.

The implementation follows **SanctaMMO - Skill Tree Simulator Reference**:

- 20 purchasable investments per class and a maximum allocation of 13 Skill Points;
- vertical tiers with thresholds at 0 / 5 / 9 / 11 learned nodes;
- tier ordering and left-to-right placement are simulator presentation choices, not gameplay rules;
- three Granted/Core family slots per class;
- authored prerequisites and Mage specialization exclusivity;
- node click opens Skill Detail without spending points;
- purchases happen through the Learn button, with confirmation for exclusive specializations;
- one confirmed full-tree reset and no individual refunds;
- square node icons with explicit Available, Locked, Learned and inspected states;
- concrete lock reasons;
- player-facing descriptions, compact technical fields and explicit semantic keyword tags.

## Investments and execution forms

An investment or Granted slot owns one progression identity. It is purchased, learned, reset and counted for tier gates once. Its `forms` array contains the executions selected by authoritative context; forms have no SP cost, learned state, prerequisite or ownership of their own.

Each investment has a stable `investmentId`, and each Granted slot has a stable `grantedSlotId`. Forms carry a stable `id`, display `name`, explicit context selector/capture point, player-facing `description`, independent gameplay `fields`, ordered `effects`, semantic `keywords`, `technicalNotes`, and `presentation` keys. Form IDs use `<stable-parent-id>.<context-slug>` (for example `fighter.shoulder-rush-ii.warrior`). They do not depend on display names. VFX, animation and audio keys are currently `null`; the IDs and key slots exist without assigning assets.

Roman numerals identify base/deepening progression (`Skill I`, `Skill II`, and so on). Context names follow the identity, such as `Ether II — Ally` and `Shoulder Rush II — Tank`. Legacy names remain metadata only. The detail panel lets you inspect each form's description, fields, keywords and presentation keys while keeping a single tree node and one purchase.

The tree's visual ordering is a simulator presentation choice. It is not a gameplay rule. Basic Attack remains a Universal Action and is not counted as an investment.

Run `node qa.mjs` from the repository root. The site uses plain HTML, CSS and JavaScript without a build step.
