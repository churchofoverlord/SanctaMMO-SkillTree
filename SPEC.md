# Primary Skill Tree — In-Game Implementation Reference

This simulator is the reference for the in-game Primary Skill Tree. The data in `data/` is the source of truth for content and layout; this document fixes the rules, interactions and visuals the game should reproduce. Reference resolution is **1920×1080**, where the whole tree fits the screen width.

## 1. Progression rules

| Rule | Value |
|---|---|
| Investments per class | 20 (7 / 6 / 4 / 3 across Tiers I–IV) |
| Skill Points | 13, all available by level 15; every investment costs 1 SP |
| Tier thresholds | Tier I 0 · Tier II 5 · Tier III 9 · Tier IV 11 learned investments |
| Granted slots | 3 per class, always available, 0 SP, not investments |
| Universal Actions | Basic Attack; never costs SP, never counts toward tiers |
| Prerequisites | `requires` — every listed investment must be learned first |
| Exclusivity | `exclusiveWith` — reciprocal; learning one locks the other until reset |
| Refunds | None per investment; one confirmed full-tree reset returns all 13 SP |
| Forms | Execution variants of one investment; no SP cost, learned state or prerequisites of their own |

### Lock evaluation

An investment's state is resolved in this order; the first match wins and its reason is shown to the player:

1. **Learned**: it is in the build.
2. **Locked (tier)**: fewer learned investments than the tier threshold. Reason: `Spend N more SP to unlock Tier X`.
3. **Locked (requires)**: a prerequisite is missing. Reason: `Requires <names>`.
4. **Excluded**: an exclusive alternative is learned. Reason: `Cannot be learned with <names>`.
5. **Locked (cap)**: 13 SP already spent. Reason: `Maximum 13 Skill Points reached`.
6. **Available**: otherwise.

## 2. Layout

Page order, top to bottom: a header frame with the class tabs (selected class emblem on their left) above the three Granted slots; Universal Actions when the class has any; the tree; and a build bar with the SP progress rail and tier milestones, the `N/13 Skill Points` counter and Reset Skill Tree.

- Four horizontal **tier rows**, Tier I on top. Each row has a tier rail on the left (label, Roman numeral, Open/Locked chip, SP still needed).
- Each investment sits in the cell (`tier`, `column`) authored in its data. `column` is 1-based; the tree is as wide as its largest `column` (7–10 per class).
- **Prerequisite lines** leave the bottom centre of the source slot and enter the top centre of the target slot with an arrowhead. Lines run vertically; when source and target columns differ, the line turns horizontally halfway between the two rows. Lines never pass through another slot (validated by `qa.mjs`).
- **Exclusive pairs** are joined above the slots by a dashed gold bracket with a `CHOOSE ONE` chip, which becomes `CHOICE MADE` (cyan dashes) once either side is learned.
- Line colour: grey `#7f8a94` until the source is learned, then gold `#f2cf73` with a soft glow.

## 3. Interactions

The Skill Tree is mouse-only: there is no gamepad or keyboard navigation between slots.

| Input | Result |
|---|---|
| Hover a slot (tree, Granted or Universal Action) | Shows the skill tooltip beside the slot; leaving the slot hides it |
| Click an Available slot | Learns it (1 SP) |
| Click a Locked or Excluded slot | Nothing is spent; the lock reason is shown |
| Click an exclusive investment | Confirmation dialog first: "This choice locks X until you reset the entire Skill Tree." |
| Reset Skill Tree | Confirmation dialog, then clears the build |

There is no separate Skill Detail panel: everything a player needs is in the tooltip.

### Skill tooltip

Placed to the right of the slot (to the left when there is no room), top-aligned with it and kept inside the screen. Uses the standard bronze frame; 380px wide, 760px with forms in two columns when the slot has more than three forms (Arcane Burst). Contents, top to bottom:

1. Slot art (64px), tier or `Granted Core` / `Universal Action`, state chip (Available, Learned, Locked, Excluded, Always available) and name.
2. `Requires:` note when the investment has prerequisites.
3. One block per form: form icon and name (only when there are several forms), description with coloured keywords, and the Cooldown / Cast Time / Range / Resource Cost / Charges that apply.
4. Synthesis preview (Mage Weaver), exclusivity warning, Severing stage progress where relevant.
5. Footer: `Click to learn · 1 SP`, `Learned`, the lock reason, or `Granted · 0 SP`.

Execution fields, technical notes and presentation keys are not player-facing; they live in the data files only.

## 4. Slot states

Tree slots reuse the action-bar slot: a square icon with a thin edge and a key chip centred on its bottom edge.

| State | Edge | Chip | Art | HUD equivalent |
|---|---|---|---|---|
| Available | 1px gold `#c89a52` | `1 SP` | full colour | Normal |
| Hover | 1px light gold `#f2cf73` + inner gold line | unchanged | full colour | Hover |
| Learned | 2px bright gold `#f2cf73` + 16px gold halo; 350ms pulse when learned | `✓` in gold | full colour | Pronto |
| Locked (tier / requires / cap) | 1px grey `#39414a` | lock, grey | greyscale, 45% brightness | Não comprada (without the red X) |
| Excluded | 1px red `#d4453f` | lock, red | greyscale, 45% brightness | Fora de alcance |

Split slots (Warrior/Tank, Sun/Moon, Ally/Enemy, Manifest/Weave) show the two `iconKeys` side by side, divided by a 1px dark line.

## 5. Visual tokens

| Token | Value | Use |
|---|---|---|
| Page | `#0e1118` | background |
| Panel | `#0d161c` | frame fill |
| Frame | 3px bronze gradient `#d2a45a → #875e2c → #b98a42`, 12px chamfered corners, 1px black inner line | every panel |
| Stud | gold diamond, 12px | top centre of panels; left/right on the top bars |
| Slot edge (default) | `#5e4520` Granted slots · `#c89a52` detail art | non-tree slots |
| Key chip | 16px tall, radius 4px, 1px `#8e6432` edge, `#1a232b → #0b1115` fill, white 10px bold | under every tree slot |
| Class accent | Fighter `#e0864c` · Scout `#6fd39c` · Mage `#66b0ff` · Mystic `#bb8cf5` | page glow and class emblem only |
| Type | Inter (Segoe UI fallback); captions 11px uppercase `#8b939d`, +0.08em tracking | all text |
| Slot size | tree 60px · Granted 52px · detail 88px | at 1920×1080 |

Keyword colours: Buff `#8de8b6`, HoT `#fff0a3`, Shield `#e4e6ee`, DoT `#ff8f8a`, Debuff `#cda8ff`, CC `#ffb872`.

## 6. Data contract

| Field | Where | Meaning |
|---|---|---|
| `id`, `investmentId` / `grantedSlotId` | slot | stable identity; never derived from display names |
| `tier`, `order`, `column` | investment | tier row, canonical order inside the tier, authored column |
| `requires`, `exclusiveWith` | investment | progression edges |
| `iconKeys` | slot | 0–2 keys into `data/icons.js`; two keys draw a split slot |
| `forms[].presentation.iconKey` | form | the form's own icon (form tabs, and the HUD slot while that form is active) |
| `forms[].presentation.vfxKey` / `animationKey` / `audioKey` | form | reserved; currently `null` |
| `icons[key]` | `data/icons.js` | `{ "sprite": n }` (cell of the 10×9 `assets/skill-icons.webp` sheet, row-major) or `{ "src": path }` |
| `classEmblems[class]` | `data/icons.js` | class emblem shown in the header |

## 7. Open items

- Numeric values (Cooldown, Range, Resource Cost) are still placeholders (`X seconds`, `X m`, `X MP`).
