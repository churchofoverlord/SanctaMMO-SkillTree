(() => {
  const TARGET_NAME = "Manifest / Weave";
  const PATCHED_ATTR = "manifestWeaveIcons";
  const DATA = window.MANIFEST_WEAVE_ICON_DATA || {};
  const VARIANTS = [
    { label: "Manifest", src: DATA.manifest },
    { label: "Weave", src: DATA.weave },
  ].filter((variant) => variant.src);

  if (VARIANTS.length !== 2) return;

  function iconStyle(src) {
    return `background-image:url('${src}');background-size:cover;background-position:center;`;
  }

  function createDualArt() {
    const art = document.createElement("span");
    art.className = "skill-art multi";
    art.setAttribute("aria-hidden", "true");

    for (const variant of VARIANTS) {
      const layer = document.createElement("i");
      layer.setAttribute("style", iconStyle(variant.src));
      art.append(layer);
    }

    return art;
  }

  function patchFrame(frame) {
    if (!frame || frame.dataset[PATCHED_ATTR] === "true") return;
    frame.classList.add("has-skill-art");
    frame.replaceChildren(createDualArt());
    frame.dataset[PATCHED_ATTR] = "true";
  }

  function patchFormLabels(description) {
    if (!description) return;
    const labels = [...description.querySelectorAll(".form-label")];

    VARIANTS.forEach((variant, index) => {
      const label = labels[index];
      if (!label || label.querySelector(".form-skill-icon")) return;
      const icon = document.createElement("i");
      icon.className = "form-skill-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.setAttribute("style", iconStyle(variant.src));
      label.prepend(icon);
    });
  }

  function patchCoreCard() {
    if (document.body.dataset.class !== "mage") return;

    for (const card of document.querySelectorAll("#grantedGrid .core-card")) {
      const title = card.querySelector("strong")?.textContent?.trim();
      if (title !== TARGET_NAME) continue;
      patchFrame(card.querySelector(".core-icon"));
    }
  }

  function patchInspector() {
    const hero = document.querySelector("#inspectorContent .detail-hero");
    const title = hero?.querySelector("h2")?.textContent?.trim();
    if (title !== TARGET_NAME) return;

    patchFrame(hero.querySelector(".detail-icon"));
    patchFormLabels(document.querySelector("#inspectorContent .skill-description"));
  }

  function patchManifestWeave() {
    patchCoreCard();
    patchInspector();
  }

  const observer = new MutationObserver(patchManifestWeave);
  observer.observe(document.body, { childList: true, subtree: true });
  patchManifestWeave();
})();
