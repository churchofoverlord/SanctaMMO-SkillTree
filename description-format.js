const colonLabelPattern =
  /^(Warrior Stance|Tank Stance|Warrior(?:\s+—\s+[^:]+)?|Tank(?:\s+—\s+[^:]+)?|Sun Stance|Moon Stance|Sun Aura|Moon Aura|Sun|Moon|Ally|Enemy|Bright Star|Full Moon|Rage|Bulwark|Manifest|Weave|Tick|Tack|Clarity|Surge|Strain|Ice|Lightning|(?:Fire|Ice|Lightning) \+ (?:Fire|Ice|Lightning)):\s*(.+)$/i;

function formatConditionalDescription(text) {
  return String(text || '')
    .split(/\n+/)
    .filter((paragraph) => paragraph.trim())
    .map((paragraph) => {
      const match = paragraph.trim().match(colonLabelPattern);
      if (!match) return `<p class="effect-common">${formatEffectText(paragraph)}</p>`;
      return `<p class="effect-variant"><span class="effect-label">${formatEffectText(match[1])}</span><span>${formatEffectText(match[2])}</span></p>`;
    })
    .join('');
}

