const FORM_LABEL =
  /^(Warrior Stance|Tank Stance|Poison Stance|Bleed Stance|Warrior form|Tank form|Warrior|Tank|Sun Stance|Moon Stance|Sun Aura|Moon Aura|Sun|Moon|Ally|Enemy|Bright Star|Full Moon|Rage|Bulwark|Poison Sac|Hemorrhage|Manifest|Weave|Clarity|Surge|Strain|Fire|Ice|Lightning):\s*(.+)$/i;
const INLINE_FORM =
  /\s+(?=(?:Warrior form|Tank form|Warrior|Tank|Sun|Moon|Ally|Enemy|Bright Star|Full Moon|Rage|Bulwark|Poison Sac|Hemorrhage|Manifest|Weave|Clarity|Surge|Strain|Fire|Ice|Lightning):)/gi;
function formatDescription(text, keywords = []) {
  const paragraphs = String(text || '')
    .replace(INLINE_FORM, '\n')
    .split(/\n+/)
    .filter((p) => p.trim());
  return paragraphs
    .map((paragraph) => {
      const match = paragraph.trim().match(FORM_LABEL);
      if (!match)
        return `<p class="description-paragraph">${formatTaggedText(paragraph, keywords)}</p>`;
      return `<p class="form-block"><span class="form-label">${formatTaggedText(match[1], keywords)}</span><span>${formatTaggedText(match[2], keywords)}</span></p>`;
    })
    .join('');
}
