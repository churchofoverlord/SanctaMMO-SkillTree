const colonLabelPattern =
  /^(Warrior Stance|Tank Stance|Warrior(?:\s+—\s+[^:]+)?|Tank(?:\s+—\s+[^:]+)?|Sun Stance|Moon Stance|Sun Aura|Moon Aura|Sun|Moon|Ally|Enemy|Bright Star|Full Moon|Manifest|Weave|Tick|Tack):\s*(.+)$/i;

function splitSentences(text) {
  return capitalizeDescription(normalizeDebuffNames(text))
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function parseConditionalSentence(sentence) {
  const colonMatch = sentence.match(colonLabelPattern);
  if (colonMatch) {
    return { label: colonMatch[1], text: colonMatch[2].trim() };
  }

  const auraMatch = sentence.match(/^(Sun Aura|Moon Aura)\s+(.+)$/i);
  if (auraMatch) {
    return { label: auraMatch[1], text: auraMatch[2].trim() };
  }

  const sunStanceMatch = sentence.match(/^Beneficial Skills while in Sun Stance\s+(.+)$/i);
  if (sunStanceMatch) {
    return { label: 'Sun Stance', text: `Beneficial Skills ${sunStanceMatch[1].trim()}` };
  }

  const moonStanceMatch = sentence.match(/^Hostile Skills while in Moon Stance\s+(.+)$/i);
  if (moonStanceMatch) {
    return { label: 'Moon Stance', text: `Hostile Skills ${moonStanceMatch[1].trim()}` };
  }

  return null;
}

function formatConditionalDescription(text) {
  const sentences = splitSentences(text);
  const labelled = sentences
    .map((sentence, index) => ({ index, parsed: parseConditionalSentence(sentence) }))
    .filter((entry) => entry.parsed);

  if (labelled.length < 2) {
    return `<p class="effect-common">${formatEffectText(text)}</p>`;
  }

  const firstIndex = labelled[0].index;
  const lastIndex = labelled[labelled.length - 1].index;
  const intro = sentences.slice(0, firstIndex);
  const outro = sentences.slice(lastIndex + 1);

  const variants = labelled.map((entry, position) => {
    const nextIndex = labelled[position + 1]?.index ?? entry.index + 1;
    const continuation =
      position < labelled.length - 1 ? sentences.slice(entry.index + 1, nextIndex) : [];
    return {
      label: entry.parsed.label,
      text: [entry.parsed.text, ...continuation].join(' ').trim(),
    };
  });

  return [
    intro.length ? `<p class="effect-common">${formatEffectText(intro.join(' '))}</p>` : '',
    `<div class="effect-variants">${variants
      .map(
        (variant) => `
      <p class="effect-variant">
        <span class="effect-label">${escapeHtml(variant.label)}</span>
        <span>${formatEffectText(variant.text)}</span>
      </p>`,
      )
      .join('')}</div>`,
    outro.length
      ? `<p class="effect-common effect-common-after">${formatEffectText(outro.join(' '))}</p>`
      : '',
  ].join('');
}
