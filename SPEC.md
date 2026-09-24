# Primary Skill Tree — In-Game Implementation Reference

This simulator is the reference for the in-game Primary Skill Tree. The data in `data/` is the source of truth for content and layout; this document fixes the rules, interactions and visuals the game should reproduce. Reference resolution is **1920×1080**, where the tree and the Skill Detail panel sit side by side.

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

- Four horizontal **tier rows**, Tier I on top. Each row has a tier rail on the left (label, Roman numeral, Open/Locked chip, SP still needed, investment count).
- Each investment sits in the cell (`tier`, `column`) authored in its data. `column` is 1-based; the tree is as wide as its largest `column` (7–10 per class).
- **Prerequisite lines** leave the bottom centre of the source slot and enter the top centre of the target slot with an arrowhead. Lines run vertically; when source and target columns differ, the line turns horizontally halfway between the two rows. Lines never pass through another slot (validated by `qa.mjs`).
- **Exclusive pairs** are joined above the slots by a dashed gold bracket with a `CHOOSE ONE` chip, which becomes `CHOICE MADE` (cyan dashes) once either side is learned.
- Line colour: grey `#7f8a94` until the source is learned, then gold `#f2cf73` with a soft glow.

## 3. Interactions

The Skill Tree is mouse-only: there is no gamepad or keyboard navigation between slots.

| Input | Result |
|---|---|
| Click a slot | Opens Skill Detail for it; never spends SP |
| Learn button (in Skill Detail) | Buys the investment if Available |
| Double-click an Available slot | Shortcut for Learn |
| Learn on an exclusive investment | Confirmation dialog: "This choice locks X until you reset the entire Skill Tree." |
| Reset Skill Tree | Confirmation dialog, then clears the build |
| Form tabs (in Skill Detail) | Switch the inspected form; purchase stays on the parent investment |
| × | Closes Skill Detail (the simulator also accepts Escape as a convenience) |

Skill Detail shows: slot art, tier and state chip, name, prerequisite note, form tabs (each with its form icon), description with keyword tooltips, execution fields, technical notes, presentation keys, exclusivity warning, Cooldown / Cast Time / Range / Resource Cost / Charges, and the Learn button with the lock reason when it is disabled.

## 4. Slot states

Tree slots reuse the action-bar slot: a square icon with a thin edge and a key chip centred on its bottom edge. The simulator shows all states in its **Node states** panel.

| State | Edge | Chip | Art | HUD equivalent |
|---|---|---|---|---|
| Available | 1px gold `#c89a52` | `1 SP` | full colour | Normal |
| Hover | 1px light gold `#f2cf73` + inner gold line | unchanged | full colour | Hover |
| Learned | 2px bright gold `#f2cf73` + 16px gold halo; 350ms pulse when learned | `✓` in gold | full colour | Pronto |
| Selected (open in detail) | 2px cyan `#35c7d4` + cyan glow | unchanged | unchanged | Selecionado |
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
