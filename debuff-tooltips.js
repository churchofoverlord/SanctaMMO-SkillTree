const STATUS_CATALOG = {
  Buff: {
    category: 'buff',
    effect: 'A positive effect. Its name and hover text identify the benefit.',
  },
  Debuff: {
    category: 'debuff',
    effect: 'A harmful effect that weakens a stat and can be removed by Cleanse.',
  },
  CC: {
    category: 'cc',
    effect: 'Persistent Crowd Control restricts movement, actions or target control.',
  },
  DoT: { category: 'dot', effect: 'Damage over time deals damage at fixed intervals.' },
  HoT: { category: 'hot', effect: 'Healing over time restores HP at fixed intervals.' },
  Shield: {
    category: 'shield',
    aliases: ['Shields', 'Shielded', 'Shielding'],
    effect: 'Absorbs incoming damage before HP is lost.',
  },
  'physical damage': { category: 'physical', effect: 'Damage mitigated by Physical Defense.' },
  'magical damage': { category: 'magical', effect: 'Damage mitigated by Magical Defense.' },
  Might: { category: 'buff', effect: 'Increases Physical Attack.' },
  Empower: { category: 'buff', effect: 'Increases Magical Attack.' },
  Fortified: { category: 'buff', effect: 'Increases Physical Defense.' },
  Warded: { category: 'buff', effect: 'Increases Magical Defense.' },
  Haste: { category: 'buff', effect: 'Increases Attack Speed.' },
  Acumen: { category: 'buff', effect: 'Increases Cast Speed.' },
  Focus: { category: 'buff', effect: 'Increases Physical and Magical Critical Rate.' },
  Fierce: { category: 'buff', effect: 'Increases Physical and Magical Critical Power.' },
  Vigor: { category: 'buff', effect: 'Increases Stamina regeneration.' },
  Swiftness: { category: 'buff', effect: 'Increases Movement Speed.' },
  Precision: { category: 'buff', effect: 'Increases Accuracy.' },
  Elusive: { category: 'buff', effect: 'Increases Evasion.' },
  Resolve: {
    category: 'buff',
    effect: 'Increases Tenacity, reducing the duration of newly applied Debuffs and persistent CC.',
  },
  Regeneration: { category: 'buff', effect: 'Increases natural HP regeneration.' },
  Clarity: { category: 'buff', effect: 'Increases natural MP regeneration.' },
  Grace: { category: 'buff', effect: 'Increases healing received.' },
  Aegis: { category: 'buff', effect: 'Increases Shield received.' },
  Omnivamp: {
    category: 'buff',
    effect: 'Restores HP from eligible Physical and Magical Damage dealt.',
  },
  Rewind: { category: 'buff', effect: 'Increases cooldown reduction.' },
  Enmity: { category: 'buff', effect: 'Increases Threat generation.' },
  Surge: { category: 'buff', effect: 'Increases outgoing damage by 100%.' },
  Strain: { category: 'buff', effect: 'Increases MP costs by 100%.' },
  Brittle: { category: 'debuff', effect: 'Reduces Physical Defense.' },
  Sapped: { category: 'debuff', effect: 'Reduces Magical Defense.' },
  Weakened: { category: 'debuff', effect: 'Reduces Physical Attack.' },
  Dulled: { category: 'debuff', effect: 'Reduces Magical Attack.' },
  Wounded: {
    category: 'debuff',
    effect: 'Reduces healing received from direct heals, HoT and Omnivamp.',
  },
  Withering: { category: 'debuff', effect: 'Reduces MP regeneration.' },
  Hindered: { category: 'debuff', effect: 'Reduces Attack Speed.' },
  Dazed: { category: 'debuff', effect: 'Reduces Cast Speed.' },
  Slow: { category: 'debuff', effect: 'Reduces Movement Speed.' },
  Blind: { category: 'debuff', effect: 'Sets Accuracy to 0 while active.' },
  Stun: {
    category: 'cc',
    aliases: ['Stuns', 'Stunned'],
    effect: 'Prevents voluntary movement and ordinary actions.',
  },
  Root: {
    category: 'cc',
    aliases: ['Roots', 'Rooted'],
    effect: 'Prevents voluntary movement, facing and movement skills.',
  },
  Silence: {
    category: 'cc',
    aliases: ['Silenced'],
    effect: 'Prevents Skills and interrupts casts or channels in progress.',
  },
  Fear: {
    category: 'cc',
    aliases: ['Fears', 'Feared'],
    effect: 'Forces movement away from the caster and prevents ordinary actions.',
  },
  Sleep: {
    category: 'cc',
    effect: 'Prevents actions and voluntary control; received damage breaks it.',
  },
  Taunt: {
    category: 'cc',
    aliases: ['Taunts', 'Taunted', 'Taunting'],
    effect: 'Forces the target to select the caster and changes its combat behaviour.',
  },
  Interrupt: {
    category: 'utility',
    aliases: ['Interrupts', 'Interrupted', 'Interrupting'],
    effect: 'Instantly cancels an active cast, channel or Basic Attack.',
  },
  'Forced Displacement': {
    category: 'utility',
    effect: 'Forced movement such as Push, Pull or Shove.',
  },
  Poison: { category: 'dot', effect: 'A stacking damage-over-time effect.' },
  Bleed: { category: 'dot', effect: 'A stacking damage-over-time effect.' },
  Burn: { category: 'dot', effect: 'A damage-over-time effect applied by Fire Skills.' },
  Curse: { category: 'dot', effect: 'A magical damage-over-time effect.' },
  Bliss: {
    category: 'hot',
    effect: 'A healing-over-time effect produced by Connection and Ritual.',
  },
};
const CATEGORY_LABELS = {
  buff: 'Buff',
  hot: 'HoT',
  shield: 'Shield',
  dot: 'DoT',
  debuff: 'Debuff',
  cc: 'CC',
  utility: 'Combat action',
  physical: 'Physical damage',
  magical: 'Magical damage',
};

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char],
  );
}
function capitalizeDescription(text) {
  return String(text ?? '').replace(
    /(^|[.!?]\s+|:\s+|\n\s*)([a-z])/g,
    (_, prefix, letter) => prefix + letter.toUpperCase(),
  );
}
function formatTaggedText(text, explicitKeywords = []) {
  const source = capitalizeDescription(text);
  const allowed = explicitKeywords
    .map((name) => [name, STATUS_CATALOG[name]])
    .filter(([, entry]) => entry);
  if (!allowed.length) return escapeHtml(source);
  const aliases = allowed.flatMap(([name, entry]) =>
    [name, ...(entry.aliases || [])].map((term) => ({ term, name, entry })),
  );
  aliases.sort((a, b) => b.term.length - a.term.length);
  const pattern = new RegExp(
    `(?<![A-Za-z])(${aliases.map(({ term }) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![A-Za-z])`,
    'gi',
  );
  let end = 0,
    html = '';
  for (const match of source.matchAll(pattern)) {
    const found = aliases.find(({ term }) => term.toLowerCase() === match[0].toLowerCase());
    if (!found) continue;
    html += escapeHtml(source.slice(end, match.index));
    html += `<button type="button" class="keyword ${found.entry.category}-term" data-keyword="${escapeHtml(found.name)}" aria-label="${escapeHtml(match[0])} — ${CATEGORY_LABELS[found.entry.category]}">${escapeHtml(match[0])}</button>`;
    end = match.index + match[0].length;
  }
  return html + escapeHtml(source.slice(end));
}

const keywordTooltip = document.createElement('div');
keywordTooltip.id = 'keyword-tooltip';
keywordTooltip.className = 'keyword-tooltip';
keywordTooltip.role = 'tooltip';
keywordTooltip.hidden = true;
document.body.appendChild(keywordTooltip);
let activeKeyword = null,
  hideTimer;
function hideKeywordTooltip() {
  clearTimeout(hideTimer);
  activeKeyword?.removeAttribute('aria-describedby');
  activeKeyword = null;
  keywordTooltip.hidden = true;
}
function showKeywordTooltip(button) {
  const entry = STATUS_CATALOG[button.dataset.keyword];
  if (!entry) return;
  hideKeywordTooltip();
  activeKeyword = button;
  button.setAttribute('aria-describedby', keywordTooltip.id);
  keywordTooltip.dataset.category = entry.category;
  keywordTooltip.textContent = `${button.dataset.keyword} — ${CATEGORY_LABELS[entry.category]}: ${entry.effect}`;
  keywordTooltip.hidden = false;
  const rect = button.getBoundingClientRect(),
    tip = keywordTooltip.getBoundingClientRect(),
    below = rect.bottom + 8;
  keywordTooltip.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - tip.width - 8))}px`;
  keywordTooltip.style.top = `${Math.max(8, below + tip.height <= innerHeight - 8 ? below : rect.top - tip.height - 8)}px`;
}
function scheduleHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hideKeywordTooltip, 150);
}
document.addEventListener('pointerover', (e) => {
  const b = e.target.closest('.keyword');
  if (b) showKeywordTooltip(b);
  else if (keywordTooltip.contains(e.target)) clearTimeout(hideTimer);
});
document.addEventListener('pointerout', (e) => {
  if (e.target.closest('.keyword') || keywordTooltip.contains(e.target)) scheduleHide();
});
document.addEventListener('focusin', (e) => {
  const b = e.target.closest('.keyword');
  if (b) showKeywordTooltip(b);
});
document.addEventListener('focusout', (e) => {
  if (e.target.closest('.keyword')) scheduleHide();
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('.keyword');
  if (b) showKeywordTooltip(b);
  else hideKeywordTooltip();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideKeywordTooltip();
});
window.addEventListener('resize', hideKeywordTooltip);
document.addEventListener('scroll', hideKeywordTooltip, true);
