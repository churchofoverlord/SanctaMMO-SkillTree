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
const debuffByTerm = new Map(
  DEBUFFS.flatMap((entry) =>
    [entry.name, ...entry.aliases].map((term) => [term.toLowerCase(), entry]),
  ),
);
const debuffPattern = new RegExp(
  '\\b(' + [...debuffByTerm.keys()].sort((a, b) => b.length - a.length).join('|') + ')\\b',
  'gi',
);

function normalizeDebuffNames(text) {
  return String(text ?? '')
    .replace(debuffPattern, (term) => debuffByTerm.get(term.toLowerCase()).name)
    .replace(/\bSlow\/Slow\b/g, 'Slow');
}

function formatEffectText(text) {
  const normalized = normalizeDebuffNames(text);
  let end = 0;
  const parts = [];
  for (const match of normalized.matchAll(debuffPattern)) {
    parts.push(escapeHtml(normalized.slice(end, match.index)));
    const entry = debuffByTerm.get(match[0].toLowerCase());
    parts.push(
      `<button type="button" class="debuff-term" data-debuff="${entry.name}">${entry.name}</button>`,
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
