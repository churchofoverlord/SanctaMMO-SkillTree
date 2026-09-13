// Player-facing Debuff vocabulary: 03 - Game Systems Design, Status Effect Contract.
// Source: https://docs.google.com/document/d/1CDItLiI3h9DLRtviggErN5GIxodeYKFbfuZrQGeWmzk/edit
const DEBUFFS = [
  {
    name: 'Brittle',
    aliases: ['PhysicalDefenseDown', 'Physical Defense Down'],
    effect: 'Reduces Physical Defense.',
  },
  {
    name: 'Sapped',
    aliases: ['MagicalDefenseDown', 'Magical Defense Down'],
    effect: 'Reduces Magical Defense.',
  },
  {
    name: 'Weakened',
    aliases: ['PhysicalAttackDown', 'Physical Attack Down'],
    effect: 'Reduces Physical Attack.',
  },
  {
    name: 'Dulled',
    aliases: ['MagicalAttackDown', 'Magical Attack Down'],
    effect: 'Reduces Magical Attack.',
  },
  {
    name: 'Wounded',
    aliases: ['HealingReceivedDown', 'Healing Received Down'],
    effect:
      'Reduces healing received, including direct heals, healing over time and lifesteal. Does not reduce natural HP or MP regeneration.',
  },
  {
    name: 'Breached',
    aliases: ['ShieldReceivedDown', 'Shield Received Down'],
    effect: 'Reduces the amount of newly received Shields. Does not change Shields already active.',
  },
  {
    name: 'Sickened',
    aliases: ['HPRegenDown', 'HP Regen Down', 'HP Regeneration Down'],
    effect: 'Reduces HP regeneration.',
  },
  {
    name: 'Withering',
    aliases: ['MPRegenDown', 'MP Regen Down', 'MP Regeneration Down'],
    effect: 'Reduces MP regeneration.',
  },
  {
    name: 'Exhausted',
    aliases: ['StaminaRegenDown', 'Stamina Regen Down', 'Stamina Regeneration Down'],
    effect: 'Reduces Stamina regeneration.',
  },
  {
    name: 'Hindered',
    aliases: ['AttackSpeedDown', 'Attack Speed Down'],
    effect: 'Reduces Attack Speed.',
  },
  {
    name: 'Dazed',
    aliases: ['CastingSpeedDown', 'Casting Speed Down', 'CastSpeedDown', 'Cast Speed Down'],
    effect: 'Reduces Casting Speed.',
  },
  {
    name: 'Slow',
    aliases: ['MovementSpeedDown', 'Movement Speed Down'],
    effect: 'Reduces Movement Speed. Slow is a Debuff, not Crowd Control.',
  },
  {
    name: 'Blind',
    aliases: ['AccuracyDown', 'Accuracy Down'],
    effect: 'Sets final Accuracy to 0 while active, after ordinary Accuracy modifiers.',
  },
];
const BUFFS = [
  {
    name: 'Might',
    aliases: ['P.Atk Up', 'P.AtkUp', 'Physical Attack Up', 'PhysicalAttackUp'],
    effect: 'Increases Physical Attack.',
    kind: 'buff',
  },
  {
    name: 'Empower',
    aliases: ['M.Atk Up', 'M.AtkUp', 'Magical Attack Up', 'MagicalAttackUp'],
    effect: 'Increases Magical Attack.',
    kind: 'buff',
  },
  {
    name: 'Fortified',
    aliases: ['P.Def Up', 'P.DefUp', 'Physical Defense Up', 'PhysicalDefenseUp'],
    effect: 'Increases Physical Defense.',
    kind: 'buff',
  },
  {
    name: 'Warded',
    aliases: ['M.Def Up', 'M.DefUp', 'Magical Defense Up', 'MagicalDefenseUp'],
    effect: 'Increases Magical Defense.',
    kind: 'buff',
  },
  {
    name: 'Haste',
    aliases: ['Attack Speed Up', 'AttackSpeedUp'],
    effect: 'Increases Attack Speed.',
    kind: 'buff',
  },
  {
    name: 'Acumen',
    aliases: ['Cast Speed Up', 'Casting Speed Up', 'CastSpeedUp', 'CastingSpeedUp'],
    effect: 'Increases Casting Speed.',
    kind: 'buff',
  },
  {
    name: 'Focus',
    aliases: [
      'P./M. Crit Rate Up',
      'P. Crit Rate Up',
      'M. Crit Rate Up',
      'Physical Crit Rate Up',
      'Magical Crit Rate Up',
      'PhysicalCritRateUp',
      'MagicalCritRateUp',
      'Critical Rate Up',
      'Crit Rate Up',
      'CritRateUp',
    ],
    effect: 'Increases Physical and Magical Critical Rate.',
    kind: 'buff',
  },
  {
    name: 'Fierce',
    aliases: [
      'P./M. Crit Power Up',
      'P. Crit Power Up',
      'M. Crit Power Up',
      'Physical Crit Power Up',
      'Magical Crit Power Up',
      'PhysicalCritPowerUp',
      'MagicalCritPowerUp',
      'Critical Power Up',
      'Critical Damage Up',
      'Crit Power Up',
      'Crit Damage Up',
      'CritPowerUp',
      'CritDamageUp',
    ],
    effect: 'Increases Physical and Magical Critical Power.',
    kind: 'buff',
  },
  {
    name: 'Vigor',
    aliases: [
      'Stamina Regen Up',
      'Stamina Regeneration Up',
      'StaminaRegenUp',
      'StaminaRegenerationUp',
    ],
    effect: 'Increases Stamina regeneration.',
    kind: 'buff',
  },
  {
    name: 'Swiftness',
    aliases: ['Movement Speed Up', 'MovementSpeedUp'],
    effect: 'Increases Movement Speed.',
    kind: 'buff',
  },
  {
    name: 'Precision',
    aliases: ['Accuracy Up', 'AccuracyUp'],
    effect: 'Increases Accuracy.',
    kind: 'buff',
  },
  {
    name: 'Elusive',
    aliases: ['Evasion Up', 'EvasionUp'],
    effect: 'Increases Evasion.',
    kind: 'buff',
  },
  {
    name: 'Resolve',
    aliases: ['Tenacity Up', 'TenacityUp'],
    effect:
      'Increases Tenacity, reducing the duration of newly applied Debuffs and persistent Crowd Control. Does not shorten DoTs or Forced Displacement.',
    kind: 'buff',
  },
  {
    name: 'Regeneration',
    aliases: ['HP Regen Up', 'HP Regeneration Up', 'HPRegenUp', 'HPRegenerationUp'],
    effect: 'Increases natural HP regeneration.',
    kind: 'buff',
  },
  {
    name: 'Clarity',
    aliases: ['MP Regen Up', 'MP Regeneration Up', 'MPRegenUp', 'MPRegenerationUp'],
    effect: 'Increases natural MP regeneration.',
    kind: 'buff',
  },
];
const STATUS_EFFECTS = [
  ...BUFFS,
  ...DEBUFFS,
  ...[
    {
      name: 'Stun',
      aliases: [],
      effect:
        'Blocks voluntary movement, facing and ordinary actions, and interrupts actions in progress. Personal Cleanse/CC-break remains available. Does not cancel Forced Displacement.',
    },
    {
      name: 'Root',
      aliases: [],
      effect:
        'Blocks voluntary movement and facing, Dodge, Sprint and starting movement skills. Blocks teleport relocation while active. Ordinary non-movement skills, Basic Attacks and Guard remain available. Does not cancel a dash or leap already underway, or prevent Forced Displacement.',
    },
    {
      name: 'Silence',
      aliases: [],
      effect:
        'Blocks skills and interrupts skills, casts and channels in progress. Basic Attacks, movement, Guard, Dodge and Sprint remain available. Personal Cleanse/CC-break remains available.',
    },
    {
      name: 'Disarm',
      aliases: [],
      effect:
        'Blocks Basic Attacks and Guard, and interrupts a Basic Attack in progress. Skills and ordinary movement remain available.',
    },
    {
      name: 'Fear',
      aliases: [],
      effect:
        'Forces movement and facing away from the caster, blocks ordinary other actions and interrupts active casts and channels. Personal Cleanse/CC-break remains available.',
    },
    {
      name: 'Sleep',
      aliases: [],
      effect:
        'Blocks actions and voluntary control like Stun. Any received damage, including a DoT tick, breaks Sleep. Personal Cleanse/CC-break remains available.',
    },
    {
      name: 'Taunt',
      aliases: [],
      effect:
        'Forces the target to select the caster. In PvE, also greatly increases threat. In PvP, forces Basic Attack attempts in range and movement toward the caster out of range, subject to other active control effects.',
    },
    {
      name: 'Interrupt',
      aliases: [],
      effect:
        'Instantly cancels an active cast, channel or Basic Attack and clears the current selected target. Has no duration and does not erase PvE threat.',
    },
    {
      name: 'Forced Displacement',
      aliases: ['ForcedDisplacement'],
      effect:
        'Forced movement such as Push, Pull or Shove. Blocks voluntary control and ordinary actions while active; personal Cleanse/CC-break remains available. Cleanse cancels it. It is not persistent CC and is not shortened by Tenacity.',
    },
    {
      name: 'CC',
      aliases: ['Crowd Control'],
      effect:
        'Crowd Control: Stun, Root, Silence, Disarm, Fear, Sleep and Taunt restrict actions or control. Cleanse removes persistent CC and Tenacity shortens its duration. Same-type reapplication does not extend active CC. Slow and Blind are Debuffs instead.',
    },
    {
      name: 'DoT',
      aliases: ['DoTs', 'Damage over Time'],
      effect:
        'Damage over time: deals damage at fixed intervals, using current relevant stats at each tick. Ticks cannot critically hit. Not removed by Cleanse or shortened by Tenacity.',
    },
    {
      name: 'HoT',
      aliases: ['HoTs', 'Healing over Time', 'Heal over Time'],
      effect:
        'Healing over time: restores HP at fixed intervals, using current relevant stats at each tick. Cannot critically heal. Wounded reduces the healing received. Not removed by Cleanse or shortened by Tenacity.',
    },
    {
      name: 'Bleed',
      aliases: [],
      effect:
        'Damage-over-time effect. Uses authored damage, duration and stacks; ticks cannot critically hit. Not removed by Cleanse or shortened by Tenacity.',
    },
    {
      name: 'Poison',
      aliases: [],
      effect:
        'Damage-over-time effect. Uses authored damage, duration and stacks; ticks cannot critically hit. Not removed by Cleanse or shortened by Tenacity.',
    },
    {
      name: 'Burn',
      aliases: [],
      effect:
        'Damage-over-time effect applied by eligible Fire skills in Manifest. Uses authored damage, duration and stacks; ticks cannot critically hit. Not removed by Cleanse or shortened by Tenacity.',
    },
    {
      name: 'Bliss',
      aliases: [],
      effect:
        'Healing-over-time effect produced by Connection and Ritual. Restores HP periodically; Wounded reduces the healing received. Connection ends its own effect if the tether breaks.',
    },
    {
      name: 'Curse',
      aliases: [],
      effect:
        'Magical damage-over-time effect produced by Connection and Ritual. Deals periodic Magical Damage. Connection ends its own effect if the tether breaks.',
    },
  ],
];
const debuffByTerm = new Map(
  STATUS_EFFECTS.flatMap((entry) =>
    [entry.name, ...entry.aliases].map((term) => [term.toLowerCase(), entry]),
  ),
);
const debuffPattern = new RegExp(
  '\\b(' +
    [...debuffByTerm.keys()]
      .sort((a, b) => b.length - a.length)
      .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|') +
    ')\\b',
  'gi',
);

function statusEntry(term) {
  const entry = debuffByTerm.get(term.toLowerCase());
  if (
    entry?.kind === 'buff' &&
    term.toLowerCase() === entry.name.toLowerCase() &&
    term !== entry.name
  )
    return null;
  return entry;
}

function capitalizeDescription(text) {
  return text.replace(
    /(^|[.!?]\s+|:\s+|\n\s*)([a-z])/g,
    (_, prefix, letter) => prefix + letter.toUpperCase(),
  );
}

function normalizeDebuffNames(text) {
  return String(text ?? '')
    .replace(/\b([Ee]nemies) already Slowed\b/g, '$1 with Slow')
    .replace(/\b(was|were) already Slowed\b/g, 'had Slow')
    .replace(/\balready Slowed\b/g, 'with Slow')
    .replace(/\bSlowed\b/g, 'affected by Slow')
    .replace(/\bSlows\b/g, 'applies Slow to')
    .replace(/\bStuns\b/g, 'applies Stun to')
    .replace(/\bRoots\b/g, 'applies Root to')
    .replace(/\bInterrupts\b/g, 'applies Interrupt to')
    .replace(/\bBlinds\b/g, 'applies Blind to')
    .replace(/\benemies already Silenced\b/g, 'enemies with Silence')
    .replace(/\balready Stunned\b/g, 'affected by Stun')
    .replace(/\bpre-Stunned\b/g, 'pre-existing Stun')
    .replace(/\bis Rooted\b/g, 'has Root')
    .replace(/\bare Rooted\b/g, 'receive Root')
    .replace(/\bare Silenced\b/g, 'receive Silence')
    .replace(/\bthe Rooted target\b/g, 'the target with Root')
    .replace(/\ba Sleeping enemy\b/g, 'an enemy with Sleep')
    .replace(debuffPattern, (term) => statusEntry(term)?.name || term)
    .replace(/\bSlow\/Slow\b/g, 'Slow');
}

function formatEffectText(text) {
  const normalized = capitalizeDescription(normalizeDebuffNames(text));
  let end = 0;
  const parts = [];
  for (const match of normalized.matchAll(debuffPattern)) {
    const entry = statusEntry(match[0]);
    if (!entry) continue;
    parts.push(escapeHtml(normalized.slice(end, match.index)));
    parts.push(
      `<button type="button" class="debuff-term${entry.kind === 'buff' ? ' buff-term' : ''}" data-debuff="${entry.name}">${entry.name}</button>`,
    );
    end = match.index + match[0].length;
  }
  parts.push(escapeHtml(normalized.slice(end)));
  return parts.join('');
}

// A single floating tooltip avoids clipping inside the scrollable skill inspector.
const debuffTooltip = document.createElement('div');
debuffTooltip.id = 'debuff-effect-tooltip';
debuffTooltip.className = 'debuff-effect-tooltip';
debuffTooltip.setAttribute('role', 'tooltip');
debuffTooltip.hidden = true;
document.body.appendChild(debuffTooltip);
let activeDebuff = null;
let hideDebuffTimer;
function hideDebuffTooltip() {
  clearTimeout(hideDebuffTimer);
  activeDebuff?.removeAttribute('aria-describedby');
  activeDebuff = null;
  debuffTooltip.hidden = true;
}
function showDebuffTooltip(button) {
  const entry = debuffByTerm.get(button.dataset.debuff.toLowerCase());
  if (!entry) return;
  hideDebuffTooltip();
  activeDebuff = button;
  button.setAttribute('aria-describedby', debuffTooltip.id);
  debuffTooltip.textContent = `${entry.name}: ${entry.effect}`;
  debuffTooltip.hidden = false;
  const rect = button.getBoundingClientRect();
  const tip = debuffTooltip.getBoundingClientRect();
  debuffTooltip.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - tip.width - 8))}px`;
  const below = rect.bottom + 8;
  debuffTooltip.style.top = `${Math.max(8, below + tip.height <= innerHeight - 8 ? below : rect.top - tip.height - 8)}px`;
}
function scheduleDebuffHide() {
  clearTimeout(hideDebuffTimer);
  hideDebuffTimer = setTimeout(hideDebuffTooltip, 150);
}
document.addEventListener('pointerover', (event) => {
  const button = event.target.closest('.debuff-term');
  if (button) showDebuffTooltip(button);
  else if (debuffTooltip.contains(event.target)) clearTimeout(hideDebuffTimer);
});
document.addEventListener('pointerout', (event) => {
  if (event.target.closest('.debuff-term') || debuffTooltip.contains(event.target))
    scheduleDebuffHide();
});
document.addEventListener('focusin', (event) => {
  const button = event.target.closest('.debuff-term');
  if (button) showDebuffTooltip(button);
});
document.addEventListener('focusout', (event) => {
  if (event.target.closest('.debuff-term')) scheduleDebuffHide();
});
document.addEventListener('click', (event) => {
  const button = event.target.closest('.debuff-term');
  if (button) showDebuffTooltip(button);
  else hideDebuffTooltip();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') hideDebuffTooltip();
});
window.addEventListener('resize', hideDebuffTooltip);
document.addEventListener('scroll', hideDebuffTooltip, true);
