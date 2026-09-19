(() => {
  const CLASS_ICONS = {
    fighter: "assets/class-fighter.webp?v=class-emblems-1",
    scout: "assets/class-scout.webp?v=class-emblems-1",
    mage: "assets/class-mage.webp?v=class-emblems-1",
    mystic: "assets/class-mystic.webp?v=class-emblems-1",
  };

  const CLASS_NAMES = {
    fighter: "Fighter",
    scout: "Scout",
    mage: "Mage",
    mystic: "Mystic",
  };

  function currentClassKey() {
    const bodyClass = String(document.body.dataset.class || "").toLowerCase();
    if (CLASS_ICONS[bodyClass]) return bodyClass;

    const activeLabel = document
      .querySelector("#classTabs .class-tab.active span")
      ?.textContent?.trim()
      .toLowerCase();
    return CLASS_ICONS[activeLabel] ? activeLabel : "fighter";
  }

  function removeTabIcons() {
    document
      .querySelectorAll("#classTabs .class-tab-icon")
      .forEach((icon) => icon.remove());
  }

  function updateBrandMark() {
    const mark = document.querySelector(".brand-mark");
    if (!mark) return;

    const classKey = currentClassKey();
    let icon = mark.querySelector("img");

    if (!icon) {
      mark.textContent = "";
      icon = document.createElement("img");
      icon.id = "brandClassIcon";
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      mark.append(icon);
    }

    const source = CLASS_ICONS[classKey];
    if (icon.getAttribute("src") !== source) icon.setAttribute("src", source);
    mark.setAttribute("title", `${CLASS_NAMES[classKey]} class emblem`);
  }

  function syncClassHeader() {
    removeTabIcons();
    updateBrandMark();
  }

  const observer = new MutationObserver(syncClassHeader);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-class"],
  });

  syncClassHeader();
})();
