# SanctaMMO Primary Skill Tree Simulator

Public static simulator for the current Fighter, Scout, Mage and Mystic Primary Skill Trees.

The implementation follows **SanctaMMO - Skill Tree Simulator Reference**:

- 20 purchasable investments per class and a maximum allocation of 13 Skill Points;
- vertical tiers with thresholds at 0 / 5 / 9 / 11 learned nodes;
- canonical left-to-right order within each tier;
- three Granted/Core family slots per class;
- authored prerequisites and Mage specialization exclusivity;
- node click opens Skill Detail without spending points;
- purchases happen through the Learn button, with confirmation for exclusive specializations;
- one confirmed full-tree reset and no individual refunds;
- square node icons with explicit Available, Locked, Learned and inspected states;
- concrete lock reasons;
- player-facing descriptions, compact technical fields and explicit semantic keyword tags.

Run `node qa.mjs` from the repository root. The site uses plain HTML, CSS and JavaScript without a build step.
