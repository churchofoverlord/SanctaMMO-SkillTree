window.SKILL_TREE_DATA["Mystic"] = {
  "name": "Mystic",
  "role": "Astral support/controller: Sun/Moon Charges, persistent Spirits, tether support and spatial utility.",
  "maxSp": 13,
  "totalInvestments": 20,
  "thresholds": {
    "1": 0,
    "2": 5,
    "3": 9,
    "4": 11
  },
  "tierCounts": {
    "1": 7,
    "2": 6,
    "3": 4,
    "4": 3
  },
  "notes": [
    "Spirits are persistent until killed, removed/replaced, relevant respec, host life end, or loss of Player Group eligibility.",
    "Bright Star and Full Moon share cooldown; Eclipse has its own cooldown."
  ],
  "core": [
    {
      "id": "core-cleanse",
      "name": "Cleanse",
      "iconKeys": [
        "mystic/cleanse"
      ],
      "description": "Remove all Debuffs and persistent CC from yourself or an eligible ally and break current Forced Displacement.",
      "keywords": [
        "Forced Displacement",
        "Debuff",
        "CC"
      ],
      "fields": {
        "Acquisition": "Granted",
        "Activation Type": "Click to Cast",
        "Target Type": "Targeted",
        "Target Relation": "Self / Ally",
        "Travel Type": "Instant",
        "Movement Type": "None",
        "Effect Type": "Single Target",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "X m"
      },
      "forms": [
        {
          "id": "mystic.granted.cleanse.default",
          "name": "Cleanse",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "Remove all Debuffs and persistent CC from yourself or an eligible ally and break current Forced Displacement.",
          "fields": {
            "Acquisition": "Granted",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Self / Ally",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Single Target",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Remove all Debuffs and persistent CC from yourself or an eligible ally and break current Forced Displacement."
          ],
          "keywords": [
            "Forced Displacement",
            "Debuff",
            "CC"
          ],
          "technicalNotes": null,
          "presentation": {
            "iconKey": "mystic/cleanse",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "grantedSlotId": "mystic.granted.cleanse"
    },
    {
      "id": "core-sun-moon-stance",
      "name": "Sun / Moon Stance",
      "iconKeys": [
        "mystic/sun_stance",
        "mystic/moon_stance"
      ],
      "description": "Sun Stance: Beneficial Skills can generate Sun Charges.\nMoon Stance: Hostile Skills can generate Moon Charges.",
      "keywords": [],
      "fields": {
        "Acquisition": "Granted",
        "Activation Type": "Click to Cast",
        "Target Type": "Self",
        "Target Relation": "Self",
        "Travel Type": "Instant",
        "Movement Type": "None",
        "Effect Type": "Single Target",
        "Resource Cost": "None",
        "Cooldown": "X seconds",
        "Range": "Self"
      },
      "forms": [
        {
          "id": "mystic.granted.sun-moon-stance.sun",
          "name": "Sun Stance",
          "context": {
            "selector": "stance-swap",
            "value": "Sun",
            "capture": "state"
          },
          "description": "Beneficial Skills can generate Sun Charges.",
          "fields": {
            "Acquisition": "Granted",
            "Activation Type": "Click to Cast",
            "Target Type": "Self",
            "Target Relation": "Self",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Single Target",
            "Resource Cost": "None",
            "Cooldown": "X seconds",
            "Range": "Self"
          },
          "effects": [
            "Set stance to Sun.",
            "Eligible beneficial Skills can generate Sun Charges."
          ],
          "keywords": [],
          "technicalNotes": null,
          "presentation": {
            "iconKey": "mystic/sun_stance",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        },
        {
          "id": "mystic.granted.sun-moon-stance.moon",
          "name": "Moon Stance",
          "context": {
            "selector": "stance-swap",
            "value": "Moon",
            "capture": "state"
          },
          "description": "Hostile Skills can generate Moon Charges.",
          "fields": {
            "Acquisition": "Granted",
            "Activation Type": "Click to Cast",
            "Target Type": "Self",
            "Target Relation": "Self",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Single Target",
            "Resource Cost": "None",
            "Cooldown": "X seconds",
            "Range": "Self"
          },
          "effects": [
            "Set stance to Moon.",
            "Eligible hostile Skills can generate Moon Charges."
          ],
          "keywords": [],
          "technicalNotes": null,
          "presentation": {
            "iconKey": "mystic/moon_stance",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "grantedSlotId": "mystic.granted.sun-moon-stance"
    },
    {
      "id": "core-bright-star-full-moon",
      "name": "Bright Star / Full Moon",
      "iconKeys": [
        "mystic/bright_star",
        "mystic/full_moon"
      ],
      "description": "Bright Star: At maximum Sun Charges, consume them and grant a Shield to allies around you.\nFull Moon: At maximum Moon Charges, consume them and launch a ground-point projectile for X Magical Damage and Silence in an area.",
      "keywords": [
        "Shield",
        "magical damage",
        "Silence"
      ],
      "fields": {
        "Acquisition": "Granted — contextual payoff",
        "Activation Type": "Click to Cast",
        "Target Type": "Self / Ground Point",
        "Target Relation": "Player Group / Enemy",
        "Travel Type": "Instant (Bright Star) / Projectile (Full Moon)",
        "Movement Type": "None",
        "Effect Type": "AoE",
        "Resource Cost": "All corresponding Charges",
        "Cooldown": "X seconds",
        "Range": "X m"
      },
      "forms": [
        {
          "id": "mystic.granted.bright-star-full-moon.sun",
          "name": "Bright Star",
          "context": {
            "selector": "stance-and-max-resource",
            "value": "Sun",
            "capture": "admission"
          },
          "description": "At maximum Sun Charges, consume them and grant a Shield to allies around you.",
          "fields": {
            "Acquisition": "Granted — contextual payoff",
            "Activation Type": "Click to Cast",
            "Target Type": "Self / Ground Point",
            "Target Relation": "Player Group / Enemy",
            "Travel Type": "Instant (Bright Star) / Projectile (Full Moon)",
            "Movement Type": "None",
            "Effect Type": "AoE",
            "Resource Cost": "All corresponding Charges",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Validate Sun stance and Max Sun Charges at admission.",
            "Atomically consume eligible Sun Charges.",
            "Grant a Shield to eligible nearby allies."
          ],
          "keywords": [
            "Shield"
          ],
          "technicalNotes": null,
          "presentation": {
            "iconKey": "mystic/bright_star",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        },
        {
          "id": "mystic.granted.bright-star-full-moon.moon",
          "name": "Full Moon",
          "context": {
            "selector": "stance-and-max-resource",
            "value": "Moon",
            "capture": "admission"
          },
          "description": "At maximum Moon Charges, consume them and launch a ground-point projectile for X Magical Damage and Silence in an area.",
          "fields": {
            "Acquisition": "Granted — contextual payoff",
            "Activation Type": "Click to Cast",
            "Target Type": "Self / Ground Point",
            "Target Relation": "Player Group / Enemy",
            "Travel Type": "Instant (Bright Star) / Projectile (Full Moon)",
            "Movement Type": "None",
            "Effect Type": "AoE",
            "Resource Cost": "All corresponding Charges",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Validate Moon stance and Max Moon Charges at admission.",
            "Atomically consume eligible Moon Charges.",
            "Launch a ground-point projectile.",
            "Deal Magical Damage and apply Silence in the area."
          ],
          "keywords": [
            "magical damage",
            "Silence"
          ],
          "technicalNotes": null,
          "presentation": {
            "iconKey": "mystic/full_moon",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "grantedSlotId": "mystic.granted.bright-star-full-moon"
    }
  ],
  "nodes": [
    {
      "id": "ether",
      "name": "Ether I",
      "iconKeys": [
        "mystic/ether_ally",
        "mystic/ether_enemy"
      ],
      "tier": 1,
      "cost": 1,
      "fields": {
        "Acquisition": "1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Targeted",
        "Target Relation": "Ally",
        "Travel Type": "Projectile",
        "Movement Type": "None",
        "Effect Type": "Single Target Heal",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "X m"
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 1,
      "column": 1,
      "description": "Ether I — Ally: Launch a targeted projectile that heals one ally for X.\nEther I — Enemy: Launch a targeted projectile that deals X Magical Damage to one enemy.",
      "keywords": [
        "Heal",
        "magical damage"
      ],
      "forms": [
        {
          "id": "mystic.ether-i.ally",
          "name": "Ether I — Ally",
          "context": {
            "selector": "target-relation",
            "value": "Ally",
            "capture": "activation"
          },
          "description": "Launch a targeted projectile that heals one ally for X.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Ally",
            "Travel Type": "Projectile",
            "Movement Type": "None",
            "Effect Type": "Single Target Heal",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Resolve Ally relation.",
            "Launch the projectile.",
            "Heal the valid ally."
          ],
          "keywords": [
            "Heal"
          ],
          "technicalNotes": null,
          "presentation": {
            "iconKey": "mystic/ether_ally",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        },
        {
          "id": "mystic.ether-i.enemy",
          "name": "Ether I — Enemy",
          "context": {
            "selector": "target-relation",
            "value": "Enemy",
            "capture": "activation"
          },
          "description": "Launch a targeted projectile that deals X Magical Damage to one enemy.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Enemy",
            "Travel Type": "Projectile",
            "Movement Type": "None",
            "Effect Type": "Single Target Damage",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Resolve Enemy relation.",
            "Launch the projectile.",
            "Deal Magical Damage to the valid enemy."
          ],
          "keywords": [
            "magical damage"
          ],
          "technicalNotes": null,
          "presentation": {
            "iconKey": "mystic/ether_enemy",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.ether-i"
    },
    {
      "id": "spirit-of-the-orbit",
      "name": "Spirit of the Orbit",
      "iconKeys": [
        "mystic/spirit_of_the_orbit_sun",
        "mystic/spirit_of_the_orbit_moon"
      ],
      "tier": 1,
      "cost": 1,
      "fields": {
        "Acquisition": "1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Targeted",
        "Target Relation": "Player Group",
        "Travel Type": "Instant",
        "Movement Type": "None",
        "Effect Type": "Persistent Spirit / conditional AoE",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "X m placement; X m proc radius",
        "Technical Notes": "Stance is captured at cast. Require an eligible Player Group host in the same life/incarnation. Resolve host slot (Host, base SpiritType) before owner-capacity eviction. Same owner + same variant refreshes without healing or ownership transfer and preserves HP/proc counter/Pending. Opposite Sun/Moon variant by same owner replaces in the same slot, preserves HP, resets proc counter and clears variant-specific Pending. Another owner cannot replace this SpiritType on the host. Remove it when host leaves the Player Group or life/incarnation ends."
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 2,
      "column": 2,
      "description": "Spirit of the Orbit — Sun: Place the Sun Spirit on an eligible Player Group host. At cadence, grant or refresh Shield when its nearby-enemy condition is met.\nSpirit of the Orbit — Moon: Place the Moon Spirit on an eligible Player Group host. At cadence, apply AoE Slow around the host.",
      "keywords": [
        "Shield",
        "Slow"
      ],
      "forms": [
        {
          "id": "mystic.spirit-of-the-orbit.sun",
          "name": "Spirit of the Orbit — Sun",
          "context": {
            "selector": "stance",
            "value": "Sun",
            "capture": "cast"
          },
          "description": "Place the Sun Spirit on an eligible Player Group host. At cadence, grant or refresh Shield when its nearby-enemy condition is met.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Player Group",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Persistent Spirit / conditional AoE",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m placement; X m proc radius"
          },
          "effects": [
            "Place the Sun Spirit on an eligible Player Group host. At cadence, grant or refresh Shield when its nearby-enemy condition is met."
          ],
          "keywords": [
            "Shield"
          ],
          "technicalNotes": "Stance is captured at cast. Require an eligible Player Group host in the same life/incarnation. Resolve host slot (Host, base SpiritType) before owner-capacity eviction. Same owner + same variant refreshes without healing or ownership transfer and preserves HP/proc counter/Pending. Opposite Sun/Moon variant by same owner replaces in the same slot, preserves HP, resets proc counter and clears variant-specific Pending. Another owner cannot replace this SpiritType on the host. Remove it when host leaves the Player Group or life/incarnation ends.",
          "presentation": {
            "iconKey": "mystic/spirit_of_the_orbit_sun",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        },
        {
          "id": "mystic.spirit-of-the-orbit.moon",
          "name": "Spirit of the Orbit — Moon",
          "context": {
            "selector": "stance",
            "value": "Moon",
            "capture": "cast"
          },
          "description": "Place the Moon Spirit on an eligible Player Group host. At cadence, apply AoE Slow around the host.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Player Group",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Persistent Spirit / conditional AoE",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m placement; X m proc radius"
          },
          "effects": [
            "Place the Moon Spirit on an eligible Player Group host. At cadence, apply AoE Slow around the host."
          ],
          "keywords": [
            "Slow"
          ],
          "technicalNotes": "Stance is captured at cast. Require an eligible Player Group host in the same life/incarnation. Resolve host slot (Host, base SpiritType) before owner-capacity eviction. Same owner + same variant refreshes without healing or ownership transfer and preserves HP/proc counter/Pending. Opposite Sun/Moon variant by same owner replaces in the same slot, preserves HP, resets proc counter and clears variant-specific Pending. Another owner cannot replace this SpiritType on the host. Remove it when host leaves the Player Group or life/incarnation ends.",
          "presentation": {
            "iconKey": "mystic/spirit_of_the_orbit_moon",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.spirit-of-the-orbit"
    },
    {
      "id": "cosmic-ray",
      "name": "Cosmic Ray I",
      "iconKeys": [
        "mystic/cosmic_ray"
      ],
      "tier": 1,
      "cost": 1,
      "fields": {
        "Acquisition": "1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Targeted",
        "Target Relation": "Ally",
        "Travel Type": "Projectile",
        "Movement Type": "None",
        "Effect Type": "Single Target",
        "Resource Cost": "X MP",
        "Cooldown": "Charge-based",
        "Range": "X m",
        "Technical Notes": "Cast on an ally. At fixed ResolveAt after X seconds, heal X HP. The manifestation may visually track the target, but movement/teleport cannot delay resolution. If the bound life/incarnation dies before ResolveAt, the cast is lost."
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 3,
      "column": 3,
      "description": "Launch an astral projectile at an ally. After X seconds, Heal that ally if they are still alive.",
      "keywords": [],
      "forms": [
        {
          "id": "mystic.cosmic-ray-i.default",
          "name": "Cosmic Ray I",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "Launch an astral projectile at an ally. After X seconds, Heal that ally if they are still alive.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Ally",
            "Travel Type": "Projectile",
            "Movement Type": "None",
            "Effect Type": "Single Target",
            "Resource Cost": "X MP",
            "Cooldown": "Charge-based",
            "Range": "X m"
          },
          "effects": [
            "Launch an astral projectile at an ally. After X seconds, Heal that ally if they are still alive."
          ],
          "keywords": [],
          "technicalNotes": "Cast on an ally. At fixed ResolveAt after X seconds, heal X HP. The manifestation may visually track the target, but movement/teleport cannot delay resolution. If the bound life/incarnation dies before ResolveAt, the cast is lost.",
          "presentation": {
            "iconKey": "mystic/cosmic_ray",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.cosmic-ray-i"
    },
    {
      "id": "connection",
      "name": "Connection I",
      "iconKeys": [
        "mystic/connection_ally",
        "mystic/connection_enemy"
      ],
      "tier": 1,
      "cost": 1,
      "fields": {
        "Acquisition": "1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Targeted",
        "Target Relation": "Ally",
        "Travel Type": "Instant",
        "Movement Type": "None",
        "Effect Type": "Single Target / Persistent Tether — Heal",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "X m maximum tether",
        "Technical Notes": "An activation creates a Connection only if its own initial main-target Bliss application succeeds. Invalid target, PvP ineligibility, first-source exclusivity or any normal application failure creates no tether, completion or ChargeGrantEvent; committed cooldown/resource is not refunded unless explicitly authored. Successful creation is the only ChargeGrantEvent for the activation. Each Connection has one concrete instance/source/target execution and one terminal reason. Range checks may break early. At natural-expiry deadline, revalidate original target/life, branch validity and Mystic-target distance within MaxConnectionRange; failure ends Broken/Invalid with no completion. Success runs the authored completion once. Early break removes only this Connection contributions using provenance-safe removal."
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 4,
      "column": 4,
      "description": "Connection I — Ally: Apply Bliss and periodic Heal to an ally. The tether ends if maximum range is broken.\nConnection I — Enemy: Apply Curse and periodic X Magical Damage to an enemy. The tether ends if maximum range is broken.",
      "keywords": [
        "Bliss",
        "Heal",
        "Curse",
        "magical damage"
      ],
      "forms": [
        {
          "id": "mystic.connection-i.ally",
          "name": "Connection I — Ally",
          "context": {
            "selector": "target-relation",
            "value": "Ally",
            "capture": "activation"
          },
          "description": "Apply Bliss and periodic Heal to an ally. The tether ends if maximum range is broken.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Ally",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Single Target / Persistent Tether — Heal",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m maximum tether"
          },
          "effects": [
            "Apply Bliss.",
            "Apply periodic Heal while the tether is valid.",
            "End the tether when maximum range is broken."
          ],
          "keywords": [
            "Bliss",
            "Heal"
          ],
          "technicalNotes": "An activation creates a Connection only if its own initial main-target Bliss application succeeds. Invalid target, PvP ineligibility, first-source exclusivity or any normal application failure creates no tether, completion or ChargeGrantEvent; committed cooldown/resource is not refunded unless explicitly authored. Successful creation is the only ChargeGrantEvent for the activation. Each Connection has one concrete instance/source/target execution and one terminal reason. Range checks may break early. At natural-expiry deadline, revalidate original target/life, branch validity and Mystic-target distance within MaxConnectionRange; failure ends Broken/Invalid with no completion. Success runs the authored completion once. Early break removes only this Connection contributions using provenance-safe removal.",
          "presentation": {
            "iconKey": "mystic/connection_ally",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        },
        {
          "id": "mystic.connection-i.enemy",
          "name": "Connection I — Enemy",
          "context": {
            "selector": "target-relation",
            "value": "Enemy",
            "capture": "activation"
          },
          "description": "Apply Curse and periodic X Magical Damage to an enemy. The tether ends if maximum range is broken.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Enemy",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Single Target / Persistent Tether — Damage",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m maximum tether"
          },
          "effects": [
            "Apply Curse.",
            "Apply periodic Magical Damage while tether is valid.",
            "End the tether when maximum range is broken."
          ],
          "keywords": [
            "Curse",
            "magical damage"
          ],
          "technicalNotes": "An activation creates a Connection only if its own initial main-target Curse application succeeds. Invalid target, PvP ineligibility, first-source exclusivity or any normal application failure creates no tether, completion or ChargeGrantEvent; committed cooldown/resource is not refunded unless explicitly authored. Successful creation is the only ChargeGrantEvent for the activation. Each Connection has one concrete instance/source/target execution and one terminal reason. Range checks may break early. At natural-expiry deadline, revalidate original target/life, branch validity and Mystic-target distance within MaxConnectionRange; failure ends Broken/Invalid with no completion. Success runs the authored completion once. Early break removes only this Connection contributions using provenance-safe removal.",
          "presentation": {
            "iconKey": "mystic/connection_enemy",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.connection-i"
    },
    {
      "id": "lullaby",
      "name": "Lullaby I",
      "iconKeys": [
        "mystic/lullaby"
      ],
      "tier": 1,
      "cost": 1,
      "fields": {
        "Acquisition": "1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Targeted",
        "Target Relation": "Enemy",
        "Travel Type": "Projectile",
        "Movement Type": "None",
        "Effect Type": "Single Target",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "X m"
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 5,
      "column": 5,
      "description": "Launch a projectile at an enemy. After X seconds, apply Sleep.",
      "keywords": [
        "Sleep"
      ],
      "forms": [
        {
          "id": "mystic.lullaby-i.default",
          "name": "Lullaby I",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "Launch a projectile at an enemy. After X seconds, apply Sleep.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Enemy",
            "Travel Type": "Projectile",
            "Movement Type": "None",
            "Effect Type": "Single Target",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Launch a projectile at an enemy. After X seconds, apply Sleep."
          ],
          "keywords": [
            "Sleep"
          ],
          "technicalNotes": null,
          "presentation": {
            "iconKey": "mystic/lullaby",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.lullaby-i"
    },
    {
      "id": "astral-aura",
      "name": "Sun Aura / Moon Aura",
      "iconKeys": [
        "mystic/sun_aura",
        "mystic/moon_aura"
      ],
      "tier": 1,
      "cost": 1,
      "fields": {
        "Acquisition": "1 Skill Point",
        "Activation Type": "Toggle / Hold to Disable",
        "Target Type": "Self",
        "Target Relation": "Player Group",
        "Travel Type": "Instant",
        "Movement Type": "None",
        "Effect Type": "AoE / Persistent Aura",
        "Resource Cost": "OPEN",
        "Cooldown": "X seconds",
        "Range": "X m"
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 6,
      "column": 6,
      "description": "Sun Aura: While Sun Stance is active, the shared periodic aura grants HP Regeneration and Movement Speed to nearby eligible allies. It follows stance changes.\nMoon Aura: While Moon Stance is active, the shared periodic aura grants MP Regeneration, Physical Attack and Magical Attack to nearby eligible allies. It follows stance changes.",
      "keywords": [
        "Regeneration",
        "Swiftness",
        "Clarity",
        "Might",
        "Empower"
      ],
      "forms": [
        {
          "id": "mystic.sun-aura-moon-aura.sun",
          "name": "Sun Aura",
          "context": {
            "selector": "stance",
            "value": "Sun",
            "capture": "aura-pulse"
          },
          "description": "While Sun Stance is active, the shared periodic aura grants HP Regeneration and Movement Speed to nearby eligible allies. It follows stance changes.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Toggle / Hold to Disable",
            "Target Type": "Self",
            "Target Relation": "Player Group",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "AoE / Persistent Aura",
            "Resource Cost": "OPEN",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Use Sun mode while Sun Stance is active.",
            "At the shared pulse, grant HP Regeneration and Movement Speed.",
            "Follow stance changes; later pulses use current stance."
          ],
          "keywords": [
            "Regeneration",
            "Swiftness"
          ],
          "technicalNotes": "The aura is a toggle using one shared periodic pulse around the Mystic. Sun mode grants HP Regeneration plus Movement Speed; Moon mode grants MP Regeneration plus Physical Attack and Magical Attack. The active mode follows stance changes; nearby eligible allies may receive an immediate updated pulse on a stance change.",
          "presentation": {
            "iconKey": "mystic/sun_aura",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        },
        {
          "id": "mystic.sun-aura-moon-aura.moon",
          "name": "Moon Aura",
          "context": {
            "selector": "stance",
            "value": "Moon",
            "capture": "aura-pulse"
          },
          "description": "While Moon Stance is active, the shared periodic aura grants MP Regeneration, Physical Attack and Magical Attack to nearby eligible allies. It follows stance changes.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Toggle / Hold to Disable",
            "Target Type": "Self",
            "Target Relation": "Player Group",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "AoE / Persistent Aura",
            "Resource Cost": "OPEN",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Use Moon mode while Moon Stance is active.",
            "At the shared pulse, grant MP Regeneration, Physical Attack and Magical Attack.",
            "Follow stance changes; later pulses use current stance."
          ],
          "keywords": [
            "Clarity",
            "Might",
            "Empower"
          ],
          "technicalNotes": "The aura is a toggle using one shared periodic pulse around the Mystic. Sun mode grants HP Regeneration plus Movement Speed; Moon mode grants MP Regeneration plus Physical Attack and Magical Attack. The active mode follows stance changes; nearby eligible allies may receive an immediate updated pulse on a stance change.",
          "presentation": {
            "iconKey": "mystic/moon_aura",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.sun-aura-moon-aura"
    },
    {
      "id": "astral-step",
      "name": "Astral Step",
      "iconKeys": [
        "mystic/astral_step"
      ],
      "tier": 1,
      "cost": 1,
      "fields": {
        "Acquisition": "1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Targeted",
        "Target Relation": "Ally / Enemy",
        "Travel Type": "Instant",
        "Movement Type": "Teleport",
        "Effect Type": "Single Target",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "X m",
        "Technical Notes": "Target an ally or enemy and teleport yourself to a valid position beside them. The anchor is not moved. Root on the Mystic at TeleportResolve blocks relocation."
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 7,
      "column": 7,
      "description": "Teleport yourself beside a valid ally or enemy anchor. Only the Mystic moves.",
      "keywords": [],
      "forms": [
        {
          "id": "mystic.astral-step.default",
          "name": "Astral Step",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "Teleport yourself beside a valid ally or enemy anchor. Only the Mystic moves.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Ally / Enemy",
            "Travel Type": "Instant",
            "Movement Type": "Teleport",
            "Effect Type": "Single Target",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Teleport yourself beside a valid ally or enemy anchor. Only the Mystic moves."
          ],
          "keywords": [],
          "technicalNotes": "Target an ally or enemy and teleport yourself to a valid position beside them. The anchor is not moved. Root on the Mystic at TeleportResolve blocks relocation.",
          "presentation": {
            "iconKey": "mystic/astral_step",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.astral-step"
    },
    {
      "id": "tick-tack",
      "name": "Ether II",
      "iconKeys": [
        "mystic/ether_ally",
        "mystic/ether_enemy"
      ],
      "tier": 2,
      "cost": 1,
      "fields": {
        "Acquisition": "+1 Skill Point",
        "Activation Type": "Passive enhancement",
        "Target Type": "Inherited",
        "Target Relation": "Ally",
        "Travel Type": "Projectile",
        "Movement Type": "None",
        "Effect Type": "Heal + conditional Buffs",
        "Resource Cost": "None beyond Ether I",
        "Requires": "Ether"
      },
      "requires": [
        "ether"
      ],
      "requiresNames": [
        "Ether I"
      ],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 1,
      "column": 1,
      "description": "Ether II — Ally: Keep Ether I healing. If the ally has a Buff, also grant Haste and Acumen.\nEther II — Enemy: Keep Ether I damage. If the enemy has a Debuff, also apply Hindered and Dazed.",
      "keywords": [
        "Heal",
        "Buff",
        "Haste",
        "Acumen",
        "magical damage",
        "Debuff",
        "Hindered",
        "Dazed"
      ],
      "forms": [
        {
          "id": "mystic.ether-ii.ally",
          "name": "Ether II — Ally",
          "context": {
            "selector": "target-relation",
            "value": "Ally",
            "capture": "activation"
          },
          "description": "Keep Ether I healing. If the ally has a Buff, also grant Haste and Acumen.",
          "fields": {
            "Acquisition": "+1 Skill Point",
            "Activation Type": "Passive enhancement",
            "Target Type": "Inherited",
            "Target Relation": "Ally",
            "Travel Type": "Projectile",
            "Movement Type": "None",
            "Effect Type": "Heal + conditional Buffs",
            "Resource Cost": "None beyond Ether I",
            "Requires": "Ether"
          },
          "effects": [
            "Resolve the inherited Ether I Ally form.",
            "If a Buff is present at the authored check, grant Haste and Acumen."
          ],
          "keywords": [
            "Heal",
            "Buff",
            "Haste",
            "Acumen"
          ],
          "technicalNotes": null,
          "presentation": {
            "iconKey": "mystic/ether_ally",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        },
        {
          "id": "mystic.ether-ii.enemy",
          "name": "Ether II — Enemy",
          "context": {
            "selector": "target-relation",
            "value": "Enemy",
            "capture": "activation"
          },
          "description": "Keep Ether I damage. If the enemy has a Debuff, also apply Hindered and Dazed.",
          "fields": {
            "Acquisition": "+1 Skill Point",
            "Activation Type": "Passive enhancement",
            "Target Type": "Inherited",
            "Target Relation": "Enemy",
            "Travel Type": "Projectile",
            "Movement Type": "None",
            "Effect Type": "Damage + conditional Debuffs",
            "Resource Cost": "None beyond Ether I",
            "Requires": "Ether"
          },
          "effects": [
            "Resolve the inherited Ether I Enemy form.",
            "If a Debuff is present at the authored check, apply Hindered and Dazed."
          ],
          "keywords": [
            "magical damage",
            "Debuff",
            "Hindered",
            "Dazed"
          ],
          "technicalNotes": null,
          "presentation": {
            "iconKey": "mystic/ether_enemy",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.ether-ii"
    },
    {
      "id": "resurrect",
      "name": "Resurrect",
      "iconKeys": [
        "mystic/resurrect"
      ],
      "tier": 2,
      "cost": 1,
      "fields": {
        "Acquisition": "1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Targeted",
        "Target Relation": "Dead Player",
        "Travel Type": "Instant",
        "Movement Type": "None",
        "Effect Type": "Single Target",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "Short X m"
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 2,
      "column": 6,
      "description": "High-commitment close-range combat resurrection under the current resurrection rules.",
      "keywords": [],
      "forms": [
        {
          "id": "mystic.resurrect.default",
          "name": "Resurrect",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "High-commitment close-range combat resurrection under the current resurrection rules.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Dead Player",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Single Target",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "Short X m"
          },
          "effects": [
            "High-commitment close-range combat resurrection under the current resurrection rules."
          ],
          "keywords": [],
          "technicalNotes": null,
          "presentation": {
            "iconKey": "mystic/resurrect",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.resurrect"
    },
    {
      "id": "spirit-of-the-star",
      "name": "Spirit of the Star",
      "iconKeys": [
        "mystic/spirit_of_the_star_sun",
        "mystic/spirit_of_the_star_moon"
      ],
      "tier": 2,
      "cost": 1,
      "fields": {
        "Acquisition": "+1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Targeted",
        "Target Relation": "Player Group",
        "Travel Type": "Instant",
        "Movement Type": "None",
        "Effect Type": "Single Target / Persistent Spirit",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "X m",
        "Requires": "Spirit of the Orbit",
        "Technical Notes": "Stance is captured at cast. Require an eligible Player Group host in the same life/incarnation. Resolve host slot (Host, base SpiritType) before owner-capacity eviction. Same owner + same variant refreshes without healing or ownership transfer and preserves HP/proc counter/Pending. Opposite Sun/Moon variant by same owner replaces in the same slot, preserves HP, resets proc counter and clears variant-specific Pending. Another owner cannot replace this SpiritType on the host. Remove it when host leaves the Player Group or life/incarnation ends. Count eligible Skills per captured variant: resolve each third trigger after the direct-result window; apply once per deduplicated hostile target, or arm at most one bounded Pending Withering if there were no hostile hits. Pending is consumed once by the next eligible SkillExecution with a hostile primary hit; consumption and a third trigger in the same execution deduplicate applications and do not create two Pendings. Pending expiry remains OPEN."
      },
      "requires": [
        "spirit-of-the-orbit"
      ],
      "requiresNames": [
        "Spirit of the Orbit"
      ],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 3,
      "column": 2,
      "description": "Spirit of the Star — Sun: Every third eligible Skill used by the host grants Clarity.\nSpirit of the Star — Moon: Every third eligible Skill applies Withering to hostile primary-hit targets; if none are hit, arm one bounded Pending Withering for the next eligible hostile-hit Skill.",
      "keywords": [
        "Clarity",
        "Withering"
      ],
      "forms": [
        {
          "id": "mystic.spirit-of-the-star.sun",
          "name": "Spirit of the Star — Sun",
          "context": {
            "selector": "stance",
            "value": "Sun",
            "capture": "cast"
          },
          "description": "Every third eligible Skill used by the host grants Clarity.",
          "fields": {
            "Acquisition": "+1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Player Group",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Single Target / Persistent Spirit",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m",
            "Requires": "Spirit of the Orbit"
          },
          "effects": [
            "Every third eligible Skill used by the host grants Clarity."
          ],
          "keywords": [
            "Clarity"
          ],
          "technicalNotes": "Stance is captured at cast. Require an eligible Player Group host in the same life/incarnation. Resolve host slot (Host, base SpiritType) before owner-capacity eviction. Same owner + same variant refreshes without healing or ownership transfer and preserves HP/proc counter/Pending. Opposite Sun/Moon variant by same owner replaces in the same slot, preserves HP, resets proc counter and clears variant-specific Pending. Another owner cannot replace this SpiritType on the host. Remove it when host leaves the Player Group or life/incarnation ends. Count eligible Skills per captured variant: resolve each third trigger after the direct-result window; apply once per deduplicated hostile target, or arm at most one bounded Pending Withering if there were no hostile hits. Pending is consumed once by the next eligible SkillExecution with a hostile primary hit; consumption and a third trigger in the same execution deduplicate applications and do not create two Pendings. Pending expiry remains OPEN.",
          "presentation": {
            "iconKey": "mystic/spirit_of_the_star_sun",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        },
        {
          "id": "mystic.spirit-of-the-star.moon",
          "name": "Spirit of the Star — Moon",
          "context": {
            "selector": "stance",
            "value": "Moon",
            "capture": "cast"
          },
          "description": "Every third eligible Skill applies Withering to hostile primary-hit targets; if none are hit, arm one bounded Pending Withering for the next eligible hostile-hit Skill.",
          "fields": {
            "Acquisition": "+1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Player Group",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Single Target / Persistent Spirit",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m",
            "Requires": "Spirit of the Orbit"
          },
          "effects": [
            "Every third eligible Skill applies Withering to hostile primary-hit targets; if none are hit, arm one bounded Pending Withering for the next eligible hostile-hit Skill."
          ],
          "keywords": [
            "Withering"
          ],
          "technicalNotes": "Stance is captured at cast. Require an eligible Player Group host in the same life/incarnation. Resolve host slot (Host, base SpiritType) before owner-capacity eviction. Same owner + same variant refreshes without healing or ownership transfer and preserves HP/proc counter/Pending. Opposite Sun/Moon variant by same owner replaces in the same slot, preserves HP, resets proc counter and clears variant-specific Pending. Another owner cannot replace this SpiritType on the host. Remove it when host leaves the Player Group or life/incarnation ends. Count eligible Skills per captured variant: resolve each third trigger after the direct-result window; apply once per deduplicated hostile target, or arm at most one bounded Pending Withering if there were no hostile hits. Pending is consumed once by the next eligible SkillExecution with a hostile primary hit; consumption and a third trigger in the same execution deduplicate applications and do not create two Pendings. Pending expiry remains OPEN.",
          "presentation": {
            "iconKey": "mystic/spirit_of_the_star_moon",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.spirit-of-the-star"
    },
    {
      "id": "cosmic-rays",
      "name": "Cosmic Ray II",
      "iconKeys": [
        "mystic/cosmic_ray"
      ],
      "tier": 2,
      "cost": 1,
      "fields": {
        "Acquisition": "+1 Skill Point",
        "Activation Type": "Passive",
        "Target Type": "Inherited",
        "Target Relation": "Ally",
        "Travel Type": "Projectile",
        "Movement Type": "None",
        "Effect Type": "Single Target",
        "Resource Cost": "None beyond Cosmic Ray",
        "Requires": "Cosmic Ray",
        "Technical Notes": "Increase Cosmic Ray Max Charges from 1 to authored X. Each Charge can maintain an independent delayed heal, including multiple casts on the same ally."
      },
      "requires": [
        "cosmic-ray"
      ],
      "requiresNames": [
        "Cosmic Ray I"
      ],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 4,
      "column": 3,
      "description": "Increase Cosmic Ray charges to X. Charges recover one at a time.",
      "keywords": [],
      "forms": [
        {
          "id": "mystic.cosmic-ray-ii.default",
          "name": "Cosmic Ray II",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "Increase Cosmic Ray charges to X. Charges recover one at a time.",
          "fields": {
            "Acquisition": "+1 Skill Point",
            "Activation Type": "Passive",
            "Target Type": "Inherited",
            "Target Relation": "Ally",
            "Travel Type": "Projectile",
            "Movement Type": "None",
            "Effect Type": "Single Target",
            "Resource Cost": "None beyond Cosmic Ray",
            "Requires": "Cosmic Ray"
          },
          "effects": [
            "Increase Cosmic Ray charges to X. Charges recover one at a time."
          ],
          "keywords": [],
          "technicalNotes": "Increase Cosmic Ray Max Charges from 1 to authored X. Each Charge can maintain an independent delayed heal, including multiple casts on the same ally.",
          "presentation": {
            "iconKey": "mystic/cosmic_ray",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.cosmic-ray-ii"
    },
    {
      "id": "serenity",
      "name": "Serenity",
      "iconKeys": [
        "mystic/serenity"
      ],
      "tier": 2,
      "cost": 1,
      "fields": {
        "Acquisition": "1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Ground Point",
        "Target Relation": "Player Group / Enemy",
        "Travel Type": "Instant",
        "Movement Type": "None",
        "Effect Type": "AoE",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "X m",
        "Technical Notes": "Target an area. After X seconds, heal eligible allies inside for X HP and apply Sleep for X seconds to enemies inside. One delayed resolution; not a persistent zone."
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 5,
      "column": 7,
      "description": "Ground point with one delayed resolution. Heal eligible allies in the area and apply Sleep to enemies. It is not a persistent ticking zone.",
      "keywords": [
        "Sleep"
      ],
      "forms": [
        {
          "id": "mystic.serenity.default",
          "name": "Serenity",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "Ground point with one delayed resolution. Heal eligible allies in the area and apply Sleep to enemies. It is not a persistent ticking zone.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Ground Point",
            "Target Relation": "Player Group / Enemy",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "AoE",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Ground point with one delayed resolution. Heal eligible allies in the area and apply Sleep to enemies. It is not a persistent ticking zone."
          ],
          "keywords": [
            "Sleep"
          ],
          "technicalNotes": "Target an area. After X seconds, heal eligible allies inside for X HP and apply Sleep for X seconds to enemies inside. One delayed resolution; not a persistent zone.",
          "presentation": {
            "iconKey": "mystic/serenity",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.serenity"
    },
    {
      "id": "astral-pull",
      "name": "Astral Pull",
      "iconKeys": [
        "mystic/astral_pull"
      ],
      "tier": 4,
      "cost": 1,
      "fields": {
        "Acquisition": "1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Targeted",
        "Target Relation": "Player Group",
        "Travel Type": "Instant",
        "Movement Type": "Teleport",
        "Effect Type": "Single Target",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "X m",
        "Technical Notes": "After X seconds, teleport the target to a valid position beside the Mystic. If the target is Rooted at TeleportResolve, relocation fails. Successful relocation cancels target Forced Displacement immediately before teleport."
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 2,
      "column": 2,
      "description": "After X seconds, teleport an eligible Party or Raid ally beside the Mystic if the destination is valid.",
      "keywords": [],
      "forms": [
        {
          "id": "mystic.astral-pull.default",
          "name": "Astral Pull",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "After X seconds, teleport an eligible Party or Raid ally beside the Mystic if the destination is valid.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Player Group",
            "Travel Type": "Instant",
            "Movement Type": "Teleport",
            "Effect Type": "Single Target",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "After X seconds, teleport an eligible Party or Raid ally beside the Mystic if the destination is valid."
          ],
          "keywords": [],
          "technicalNotes": "After X seconds, teleport the target to a valid position beside the Mystic. If the target is Rooted at TeleportResolve, relocation fails. Successful relocation cancels target Forced Displacement immediately before teleport.",
          "presentation": {
            "iconKey": "mystic/astral_pull",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.astral-pull"
    },
    {
      "id": "spirit-of-the-comet",
      "name": "Spirit of the Comet",
      "iconKeys": [
        "mystic/spirit_of_the_comet_sun",
        "mystic/spirit_of_the_comet_moon"
      ],
      "tier": 3,
      "cost": 1,
      "fields": {
        "Acquisition": "+1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Targeted",
        "Target Relation": "Player Group",
        "Travel Type": "Instant",
        "Movement Type": "None",
        "Effect Type": "Single Target / Persistent Spirit",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "X m",
        "Requires": "Spirit of the Star",
        "Technical Notes": "Stance is captured at cast. Require an eligible Player Group host in the same life/incarnation. Resolve host slot (Host, base SpiritType) before owner-capacity eviction. Same owner + same variant refreshes without healing or ownership transfer and preserves HP/proc counter/Pending. Opposite Sun/Moon variant by same owner replaces in the same slot, preserves HP, resets proc counter and clears variant-specific Pending. Another owner cannot replace this SpiritType on the host. Remove it when host leaves the Player Group or life/incarnation ends."
      },
      "requires": [
        "spirit-of-the-star"
      ],
      "requiresNames": [
        "Spirit of the Star"
      ],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 1,
      "column": 2,
      "description": "Spirit of the Comet — Sun: Every third eligible Basic Attack grants Omnivamp to the host.\nSpirit of the Comet — Moon: Every third eligible Basic Attack applies Wounded to all valid enemies hit by that attack.",
      "keywords": [
        "Omnivamp",
        "Wounded"
      ],
      "forms": [
        {
          "id": "mystic.spirit-of-the-comet.sun",
          "name": "Spirit of the Comet — Sun",
          "context": {
            "selector": "stance",
            "value": "Sun",
            "capture": "cast"
          },
          "description": "Every third eligible Basic Attack grants Omnivamp to the host.",
          "fields": {
            "Acquisition": "+1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Player Group",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Single Target / Persistent Spirit",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m",
            "Requires": "Spirit of the Star"
          },
          "effects": [
            "Every third eligible Basic Attack grants Omnivamp to the host."
          ],
          "keywords": [
            "Omnivamp"
          ],
          "technicalNotes": "Stance is captured at cast. Require an eligible Player Group host in the same life/incarnation. Resolve host slot (Host, base SpiritType) before owner-capacity eviction. Same owner + same variant refreshes without healing or ownership transfer and preserves HP/proc counter/Pending. Opposite Sun/Moon variant by same owner replaces in the same slot, preserves HP, resets proc counter and clears variant-specific Pending. Another owner cannot replace this SpiritType on the host. Remove it when host leaves the Player Group or life/incarnation ends.",
          "presentation": {
            "iconKey": "mystic/spirit_of_the_comet_sun",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        },
        {
          "id": "mystic.spirit-of-the-comet.moon",
          "name": "Spirit of the Comet — Moon",
          "context": {
            "selector": "stance",
            "value": "Moon",
            "capture": "cast"
          },
          "description": "Every third eligible Basic Attack applies Wounded to all valid enemies hit by that attack.",
          "fields": {
            "Acquisition": "+1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Targeted",
            "Target Relation": "Player Group",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Single Target / Persistent Spirit",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m",
            "Requires": "Spirit of the Star"
          },
          "effects": [
            "Every third eligible Basic Attack applies Wounded to all valid enemies hit by that attack."
          ],
          "keywords": [
            "Wounded"
          ],
          "technicalNotes": "Stance is captured at cast. Require an eligible Player Group host in the same life/incarnation. Resolve host slot (Host, base SpiritType) before owner-capacity eviction. Same owner + same variant refreshes without healing or ownership transfer and preserves HP/proc counter/Pending. Opposite Sun/Moon variant by same owner replaces in the same slot, preserves HP, resets proc counter and clears variant-specific Pending. Another owner cannot replace this SpiritType on the host. Remove it when host leaves the Player Group or life/incarnation ends.",
          "presentation": {
            "iconKey": "mystic/spirit_of_the_comet_moon",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.spirit-of-the-comet"
    },
    {
      "id": "nightmare",
      "name": "Lullaby II",
      "iconKeys": [
        "mystic/nightmare"
      ],
      "tier": 3,
      "cost": 1,
      "fields": {
        "Acquisition": "+1 Skill Point",
        "Activation Type": "Contextual Recast",
        "Target Type": "Targeted",
        "Target Relation": "Enemy",
        "Travel Type": "Projectile",
        "Movement Type": "None",
        "Effect Type": "Single Target",
        "Resource Cost": "X MP",
        "Cooldown": "Contextual from Lullaby",
        "Range": "X m",
        "Requires": "Lullaby",
        "Technical Notes": "After casting Lullaby, Nightmare is available for X seconds. Cast on any enemy currently affected by Sleep to deal X Magical Damage, then apply Fear for X seconds. The Sleep may come from any source."
      },
      "requires": [
        "lullaby"
      ],
      "requiresNames": [
        "Lullaby I"
      ],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 2,
      "column": 5,
      "description": "After casting Lullaby, this follow-up is available for X seconds. Target any enemy with Sleep; on hit deal X magical damage and apply Fear.",
      "keywords": [
        "magical damage",
        "Fear",
        "Sleep"
      ],
      "forms": [
        {
          "id": "mystic.lullaby-ii.default",
          "name": "Lullaby II",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "After casting Lullaby, this follow-up is available for X seconds. Target any enemy with Sleep; on hit deal X magical damage and apply Fear.",
          "fields": {
            "Acquisition": "+1 Skill Point",
            "Activation Type": "Contextual Recast",
            "Target Type": "Targeted",
            "Target Relation": "Enemy",
            "Travel Type": "Projectile",
            "Movement Type": "None",
            "Effect Type": "Single Target",
            "Resource Cost": "X MP",
            "Cooldown": "Contextual from Lullaby",
            "Range": "X m",
            "Requires": "Lullaby"
          },
          "effects": [
            "After casting Lullaby, this follow-up is available for X seconds. Target any enemy with Sleep; on hit deal X magical damage and apply Fear."
          ],
          "keywords": [
            "magical damage",
            "Fear",
            "Sleep"
          ],
          "technicalNotes": "After casting Lullaby, Nightmare is available for X seconds. Cast on any enemy currently affected by Sleep to deal X Magical Damage, then apply Fear for X seconds. The Sleep may come from any source.",
          "presentation": {
            "iconKey": "mystic/nightmare",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.lullaby-ii"
    },
    {
      "id": "black-hole",
      "name": "Black Hole I",
      "iconKeys": [
        "mystic/black_hole"
      ],
      "tier": 2,
      "cost": 1,
      "fields": {
        "Acquisition": "1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Ground Point",
        "Target Relation": "Enemy",
        "Travel Type": "Instant",
        "Movement Type": "Forced Displacement",
        "Effect Type": "AoE",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "X m",
        "Technical Notes": "Create Black Hole at the target location. On initial resolution, query enemies currently inside and issue one slow Forced Displacement toward the center for each eligible target. Later entrants are not retroactively pulled."
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 6,
      "column": 8,
      "description": "Create an area at a ground point. Enemies inside when it appears are pulled once toward the centre by a slow Forced Displacement. Enemies entering later are not pulled.",
      "keywords": [
        "Slow",
        "Forced Displacement"
      ],
      "forms": [
        {
          "id": "mystic.black-hole-i.default",
          "name": "Black Hole I",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "Create an area at a ground point. Enemies inside when it appears are pulled once toward the centre by a slow Forced Displacement. Enemies entering later are not pulled.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Ground Point",
            "Target Relation": "Enemy",
            "Travel Type": "Instant",
            "Movement Type": "Forced Displacement",
            "Effect Type": "AoE",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Create an area at a ground point. Enemies inside when it appears are pulled once toward the centre by a slow Forced Displacement. Enemies entering later are not pulled."
          ],
          "keywords": [
            "Slow",
            "Forced Displacement"
          ],
          "technicalNotes": "Create Black Hole at the target location. On initial resolution, query enemies currently inside and issue one slow Forced Displacement toward the center for each eligible target. Later entrants are not retroactively pulled.",
          "presentation": {
            "iconKey": "mystic/black_hole",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.black-hole-i"
    },
    {
      "id": "astral-veil",
      "name": "Astral Veil",
      "iconKeys": [
        "mystic/astral_veil"
      ],
      "tier": 4,
      "cost": 1,
      "fields": {
        "Acquisition": "1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Ground Point",
        "Target Relation": "World Placement",
        "Travel Type": "Instant",
        "Movement Type": "None",
        "Effect Type": "Barrier / Area",
        "Resource Cost": "X MP",
        "Cooldown": "X seconds",
        "Range": "X m",
        "Technical Notes": "Create Astral Veil for X seconds. Gameplay-classified Projectiles crossing from either side are Intercepted and terminate without ordinary impact payload unless explicitly authored otherwise. Does not block characters, LOS, beams, cones, instant attacks or ground-targeted effects. Max one active."
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 3,
      "column": 3,
      "description": "Place one temporary barrier that intercepts gameplay-classified projectiles from either side. It does not block character movement or LOS and has no HP.",
      "keywords": [],
      "forms": [
        {
          "id": "mystic.astral-veil.default",
          "name": "Astral Veil",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "Place one temporary barrier that intercepts gameplay-classified projectiles from either side. It does not block character movement or LOS and has no HP.",
          "fields": {
            "Acquisition": "1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Ground Point",
            "Target Relation": "World Placement",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Barrier / Area",
            "Resource Cost": "X MP",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Place one temporary barrier that intercepts gameplay-classified projectiles from either side. It does not block character movement or LOS and has no HP."
          ],
          "keywords": [],
          "technicalNotes": "Create Astral Veil for X seconds. Gameplay-classified Projectiles crossing from either side are Intercepted and terminate without ordinary impact payload unless explicitly authored otherwise. Does not block characters, LOS, beams, cones, instant attacks or ground-targeted effects. Max one active.",
          "presentation": {
            "iconKey": "mystic/astral_veil",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.astral-veil"
    },
    {
      "id": "eclipse",
      "name": "Eclipse",
      "iconKeys": [
        "mystic/eclipse"
      ],
      "tier": 4,
      "cost": 1,
      "fields": {
        "Acquisition": "+1 Skill Point",
        "Activation Type": "Click to Cast",
        "Target Type": "Ground Point",
        "Target Relation": "Player Group / Enemy",
        "Travel Type": "Projectile",
        "Movement Type": "None",
        "Effect Type": "AoE",
        "Resource Cost": "All Sun + all Moon Charges",
        "Cooldown": "X seconds",
        "Range": "X m"
      },
      "requires": [],
      "requiresNames": [],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 1,
      "column": 1,
      "description": "Preserve Sun and Moon charge pools when changing Stance. When both pools are maximum, Eclipse becomes a separate clickable ground-point payoff with its own cooldown; consume both pools to Shield allies and deal X magical damage + Silence to enemies in the area.",
      "keywords": [
        "magical damage",
        "Silence",
        "Shield"
      ],
      "forms": [
        {
          "id": "mystic.eclipse.default",
          "name": "Eclipse",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "Preserve Sun and Moon charge pools when changing Stance. When both pools are maximum, Eclipse becomes a separate clickable ground-point payoff with its own cooldown; consume both pools to Shield allies and deal X magical damage + Silence to enemies in the area.",
          "fields": {
            "Acquisition": "+1 Skill Point",
            "Activation Type": "Click to Cast",
            "Target Type": "Ground Point",
            "Target Relation": "Player Group / Enemy",
            "Travel Type": "Projectile",
            "Movement Type": "None",
            "Effect Type": "AoE",
            "Resource Cost": "All Sun + all Moon Charges",
            "Cooldown": "X seconds",
            "Range": "X m"
          },
          "effects": [
            "Preserve Sun and Moon charge pools when changing Stance. When both pools are maximum, Eclipse becomes a separate clickable ground-point payoff with its own cooldown; consume both pools to Shield allies and deal X magical damage + Silence to enemies in the area."
          ],
          "keywords": [
            "magical damage",
            "Silence",
            "Shield"
          ],
          "technicalNotes": null,
          "presentation": {
            "iconKey": "mystic/eclipse",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.eclipse"
    },
    {
      "id": "ritual",
      "name": "Connection II",
      "iconKeys": [
        "mystic/connection_ally",
        "mystic/connection_enemy"
      ],
      "tier": 3,
      "cost": 1,
      "fields": {
        "Acquisition": "+1 Skill Point",
        "Activation Type": "Passive deepening",
        "Target Type": "Inherited",
        "Target Relation": "Ally",
        "Travel Type": "Instant",
        "Movement Type": "None",
        "Effect Type": "Tether + AoE completion",
        "Resource Cost": "None beyond Connection I",
        "Requires": "Connection",
        "Technical Notes": "An activation creates a Connection only if its own initial main-target Bliss application succeeds. Invalid target, PvP ineligibility, first-source exclusivity or any normal application failure creates no tether, completion or ChargeGrantEvent; committed cooldown/resource is not refunded unless explicitly authored. Successful creation is the only ChargeGrantEvent for the activation. Each Connection has one concrete instance/source/target execution and one terminal reason. Range checks may break early. At natural-expiry deadline, revalidate original target/life, branch validity and Mystic-target distance within MaxConnectionRange; failure ends Broken/Invalid with no completion. Success runs the authored completion once. Early break removes only this Connection contributions using provenance-safe removal. Ritual completion/spread creates no additional ChargeGrantEvent."
      },
      "requires": [
        "connection"
      ],
      "requiresNames": [
        "Connection I"
      ],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 3,
      "column": 4,
      "description": "Connection II — Ally: Keep Ally Connection effects and also grant Swiftness. On natural full duration, heal the main target and spread Bliss and Swiftness.\nConnection II — Enemy: Keep Enemy Connection effects and also apply Slow. On natural full duration, Root the main target and spread Curse and Slow.",
      "keywords": [
        "Bliss",
        "Heal",
        "Swiftness",
        "Curse",
        "magical damage",
        "Slow",
        "Root"
      ],
      "forms": [
        {
          "id": "mystic.connection-ii.ally",
          "name": "Connection II — Ally",
          "context": {
            "selector": "target-relation",
            "value": "Ally",
            "capture": "activation"
          },
          "description": "Keep Ally Connection effects and also grant Swiftness. On natural full duration, heal the main target and spread Bliss and Swiftness.",
          "fields": {
            "Acquisition": "+1 Skill Point",
            "Activation Type": "Passive deepening",
            "Target Type": "Inherited",
            "Target Relation": "Ally",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Tether + AoE completion",
            "Resource Cost": "None beyond Connection I",
            "Requires": "Connection"
          },
          "effects": [
            "Retain Bliss and periodic Heal.",
            "Grant Swiftness.",
            "On natural full duration, Heal the main target and spread Bliss + Swiftness."
          ],
          "keywords": [
            "Bliss",
            "Heal",
            "Swiftness"
          ],
          "technicalNotes": "An activation creates a Connection only if its own initial main-target Bliss application succeeds. Invalid target, PvP ineligibility, first-source exclusivity or any normal application failure creates no tether, completion or ChargeGrantEvent; committed cooldown/resource is not refunded unless explicitly authored. Successful creation is the only ChargeGrantEvent for the activation. Each Connection has one concrete instance/source/target execution and one terminal reason. Range checks may break early. At natural-expiry deadline, revalidate original target/life, branch validity and Mystic-target distance within MaxConnectionRange; failure ends Broken/Invalid with no completion. Success runs the authored completion once. Early break removes only this Connection contributions using provenance-safe removal. Ritual completion/spread creates no additional ChargeGrantEvent.",
          "presentation": {
            "iconKey": "mystic/connection_ally",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        },
        {
          "id": "mystic.connection-ii.enemy",
          "name": "Connection II — Enemy",
          "context": {
            "selector": "target-relation",
            "value": "Enemy",
            "capture": "activation"
          },
          "description": "Keep Enemy Connection effects and also apply Slow. On natural full duration, Root the main target and spread Curse and Slow.",
          "fields": {
            "Acquisition": "+1 Skill Point",
            "Activation Type": "Passive deepening",
            "Target Type": "Inherited",
            "Target Relation": "Enemy",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "Tether + AoE completion",
            "Resource Cost": "None beyond Connection I",
            "Requires": "Connection"
          },
          "effects": [
            "Retain Curse and periodic Magical Damage.",
            "Apply Slow.",
            "On natural full duration, Root the main target and spread Curse + Slow."
          ],
          "keywords": [
            "Curse",
            "magical damage",
            "Slow",
            "Root"
          ],
          "technicalNotes": "An activation creates a Connection only if its own initial main-target Curse application succeeds. Invalid target, PvP ineligibility, first-source exclusivity or any normal application failure creates no tether, completion or ChargeGrantEvent; committed cooldown/resource is not refunded unless explicitly authored. Successful creation is the only ChargeGrantEvent for the activation. Each Connection has one concrete instance/source/target execution and one terminal reason. Range checks may break early. At natural-expiry deadline, revalidate original target/life, branch validity and Mystic-target distance within MaxConnectionRange; failure ends Broken/Invalid with no completion. Success runs the authored completion once. Early break removes only this Connection contributions using provenance-safe removal. Ritual completion/spread creates no additional ChargeGrantEvent.",
          "presentation": {
            "iconKey": "mystic/connection_enemy",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.connection-ii"
    },
    {
      "id": "white-hole",
      "name": "Black Hole II",
      "iconKeys": [
        "mystic/black_hole"
      ],
      "tier": 3,
      "cost": 1,
      "fields": {
        "Acquisition": "+1 Skill Point",
        "Activation Type": "Passive",
        "Target Type": "Inherited Ground Point",
        "Target Relation": "Enemy",
        "Travel Type": "Instant",
        "Movement Type": "None",
        "Effect Type": "AoE",
        "Resource Cost": "None beyond Black Hole",
        "Requires": "Black Hole",
        "Technical Notes": "When Black Hole ends, perform a new independent area query. Enemies currently inside take X Magical Damage and are Silenced for X seconds."
      },
      "requires": [
        "black-hole"
      ],
      "requiresNames": [
        "Black Hole I"
      ],
      "exclusiveWith": [],
      "exclusiveNames": [],
      "legacyName": null,
      "order": 4,
      "column": 8,
      "description": "When Black Hole expires, perform a new area check and deal X magical damage + Silence to enemies still inside.",
      "keywords": [
        "magical damage",
        "Silence"
      ],
      "forms": [
        {
          "id": "mystic.black-hole-ii.default",
          "name": "Black Hole II",
          "context": {
            "selector": "always",
            "value": "default",
            "capture": "execution"
          },
          "description": "When Black Hole expires, perform a new area check and deal X magical damage + Silence to enemies still inside.",
          "fields": {
            "Acquisition": "+1 Skill Point",
            "Activation Type": "Passive",
            "Target Type": "Inherited Ground Point",
            "Target Relation": "Enemy",
            "Travel Type": "Instant",
            "Movement Type": "None",
            "Effect Type": "AoE",
            "Resource Cost": "None beyond Black Hole",
            "Requires": "Black Hole"
          },
          "effects": [
            "When Black Hole expires, perform a new area check and deal X magical damage + Silence to enemies still inside."
          ],
          "keywords": [
            "magical damage",
            "Silence"
          ],
          "technicalNotes": "When Black Hole ends, perform a new independent area query. Enemies currently inside take X Magical Damage and are Silenced for X seconds.",
          "presentation": {
            "iconKey": "mystic/black_hole",
            "vfxKey": null,
            "animationKey": null,
            "audioKey": null
          }
        }
      ],
      "investmentId": "mystic.black-hole-ii"
    }
  ],
  "appendix": [],
  "formSchemaVersion": 1
};
