// ===== GAME STATE =====
const gameState = {
  currentLocation: "starting-room",
  inventory: [
    { id: "sword", name: "Sword", desc: "A blade, worn from use. Once it gleamed." },
    { id: "shield", name: "Shield", desc: "An iron shield, dented and weathered." }
  ],
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  stamina: 100,
  maxStamina: 100,
  stats: {
    strength: 10,
    dexterity: 8,
    vitality: 12,
    intelligence: 6,
    faith: 5,
    luck: 8
  },
  inCombat: false,
  currentEnemy: null,
  currentTheme: "bonfire",
  turn: 0
};

// ===== THEME SYSTEM =====
const THEMES = {
  bonfire: { id: "bonfire", name: "Bonfire", locked: false, lore: "Light a flame against the dark" },
  hollow: { id: "hollow", name: "Hollow", locked: false, lore: "Dust on parchment, dust on bone" },
  abyss: { id: "abyss", name: "Abyss", locked: true, lore: "Defeat the Four Kings at the bottom of New Londo" }
};

function setTheme(themeId) {
  const theme = THEMES[themeId];
  if (!theme) return;

  gameState.currentTheme = themeId;
  document.body.className = `zs-${themeId}`;
  localStorage.setItem("zorkSoulsTheme", themeId);

  // Update theme button states
  document.querySelectorAll(".Theme-button").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.theme === themeId) {
      btn.classList.add("active");
    }
  });
}

function initializeThemeSwitcher() {
  const savedTheme = localStorage.getItem("zorkSoulsTheme") || "bonfire";
  setTheme(savedTheme);

  document.querySelectorAll(".Theme-button").forEach(btn => {
    btn.addEventListener("click", () => {
      const themeId = btn.dataset.theme;
      const theme = THEMES[themeId];

      if (btn.hasAttribute("data-locked") && theme.locked) {
        alert("This theme is locked. " + (theme.lore || ""));
        return;
      }
      setTheme(themeId);
    });
  });
}

// ===== HUD SYSTEM =====
const HUD_BAR_SLOTS = 10;

function renderAsciiBar(elementId, current, max) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const pct = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(pct * HUD_BAR_SLOTS);

  el.textContent = "";
  const filledSpan = document.createElement("span");
  filledSpan.className = "HUD-bar-fill";
  filledSpan.textContent = "█".repeat(filled);
  el.appendChild(filledSpan);

  const emptySpan = document.createElement("span");
  emptySpan.className = "HUD-bar-empty";
  emptySpan.textContent = "░".repeat(HUD_BAR_SLOTS - filled);
  el.appendChild(emptySpan);
}

function updateAllHUDBars() {
  renderAsciiBar("hp-ascii", gameState.hp, gameState.maxHp);
  renderAsciiBar("mp-ascii", gameState.mp, gameState.maxMp);
  renderAsciiBar("stamina-ascii", gameState.stamina, gameState.maxStamina);

  document.getElementById("hp-current").textContent = gameState.hp;
  document.getElementById("hp-max").textContent = gameState.maxHp;
  document.getElementById("mp-current").textContent = gameState.mp;
  document.getElementById("mp-max").textContent = gameState.maxMp;
  document.getElementById("stamina-current").textContent = gameState.stamina;
  document.getElementById("stamina-max").textContent = gameState.maxStamina;
}

// ===== LOCATION BANNER =====
const LOCATION_TITLES = {
  "starting-room": { title: "Undead Asylum", meta: "fog descending" }
};

function updateLocationBanner() {
  const loc = LOCATION_TITLES[gameState.currentLocation] || { title: "—", meta: "" };
  const titleEl = document.getElementById("location-title");
  const metaEl = document.getElementById("location-meta");
  if (titleEl) titleEl.textContent = `── ${loc.title} ──`;
  if (metaEl) metaEl.textContent = `turn ${gameState.turn} · ${loc.meta}`;
}

// ===== BONFIRE ASCII VISUAL =====
const BONFIRE_SWORD = [
  { txt: "  ◉  ", tone: "lo" },
  { txt: "  │  ", tone: "lo" },
  { txt: "──┴──", tone: "lo" },
  { txt: "  ╲  ", tone: "lo" },
  { txt: "  )( ", tone: "lo" },
  { txt: "  ╲  ", tone: "mid" },
  { txt: "  )( ", tone: "mid" },
  { txt: "  ╲  ", tone: "mid" },
  { txt: "  )( ", tone: "mid" },
  { txt: "  ╲  ", tone: "hi" },
  { txt: "  │  ", tone: "hi" },
  { txt: "  │  ", tone: "hi" }
];

const BONFIRE_FLAME_ROWS = [
  { cls: "row1", txt: "      ╮       _       _       ╭" },
  { cls: "row2", txt: "     ╯ ))   ╮(  ╲   ╱  )╭   (( ╲" },
  { cls: "row3", txt: "   ─((─((─((─((─((─))─))─))─))──))" },
  { cls: "row4", txt: "   ════════════════════════════════" }
];

const BONFIRE_CINDERS = [
  { left: "28%", bottom: "14%", char: "·", kind: "wink", size: 11, delay: 0.0, dur: 1.8 },
  { left: "38%", bottom: "22%", char: "⚹", kind: "drift", size: 10, delay: 0.8, dur: 3.2 },
  { left: "46%", bottom: "12%", char: "·", kind: "wink", size: 13, delay: 1.4, dur: 1.6 },
  { left: "54%", bottom: "26%", char: "✧", kind: "drift", size: 9, delay: 2.1, dur: 3.8 },
  { left: "62%", bottom: "16%", char: "·", kind: "wink", size: 12, delay: 0.4, dur: 2.0 },
  { left: "70%", bottom: "20%", char: "⚹", kind: "drift", size: 10, delay: 2.6, dur: 3.4 }
];

function renderBonfireVisual() {
  const visual = document.createElement("div");
  visual.className = "Bonfire-visual";

  const stage = document.createElement("div");
  stage.className = "Bonfire-stage";

  const halo = document.createElement("div");
  halo.className = "Bonfire-halo";
  stage.appendChild(halo);

  const sword = document.createElement("pre");
  sword.className = "Bonfire-sword";
  BONFIRE_SWORD.forEach(row => {
    const r = document.createElement("span");
    r.className = `Bonfire-sword-row ${row.tone}`;
    r.textContent = row.txt;
    sword.appendChild(r);
  });
  stage.appendChild(sword);

  const cinders = document.createElement("div");
  cinders.className = "Bonfire-cinders";
  BONFIRE_CINDERS.forEach(c => {
    const span = document.createElement("span");
    span.className = "Bonfire-cinder";
    span.textContent = c.char;
    span.style.left = c.left;
    span.style.bottom = c.bottom;
    span.style.fontSize = c.size + "px";
    span.style.color = c.kind === "wink" ? "var(--b-ember2)" : "var(--b-ember1)";
    span.style.animation = `zs-cinder-${c.kind} ${c.dur}s ease-in-out ${c.delay}s infinite`;
    cinders.appendChild(span);
  });
  stage.appendChild(cinders);

  const flame = document.createElement("pre");
  flame.className = "Bonfire-flame";
  BONFIRE_FLAME_ROWS.forEach(row => {
    const r = document.createElement("span");
    r.className = row.cls;
    r.style.display = "block";
    r.textContent = row.txt;
    flame.appendChild(r);
  });
  stage.appendChild(flame);

  visual.appendChild(stage);

  const caption = document.createElement("div");
  caption.className = "Bonfire-caption";
  caption.textContent = "a coiled sword stabbed through ash. the flame waits, knowing.";
  visual.appendChild(caption);

  return visual;
}

// ===== COMMAND REGISTRY =====
const commandRegistry = {};

function registerCommand(name, aliases, handler) {
  const cmd = {
    name,
    aliases: aliases.map(a => a.toLowerCase()),
    handler
  };
  commandRegistry[name.toLowerCase()] = cmd;
  aliases.forEach(alias => {
    commandRegistry[alias.toLowerCase()] = cmd;
  });
}

function dispatchCommand(input) {
  const tokens = input.trim().split(/\s+/).filter(t => t.length > 0);

  if (tokens.length === 0) {
    return { output: "", className: "history-narrative" };
  }

  const commandName = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  if (!commandRegistry[commandName]) {
    return {
      output: `✗ Unknown command: "${commandName}". Type "help" for a list of commands.`,
      className: "history-error"
    };
  }

  const command = commandRegistry[commandName];
  try {
    const result = command.handler(args, gameState, commandName);
    // Handler may return either a string or an object { text, className, showBonfire }
    if (typeof result === "string") {
      return { output: result, className: "history-narrative" };
    }
    return {
      output: result.text,
      className: result.className || "history-narrative",
      showBonfire: result.showBonfire || false
    };
  } catch (err) {
    return {
      output: `Error executing command: ${err.message}`,
      className: "history-error"
    };
  }
}

// ===== COMMAND HANDLERS =====

registerCommand("help", ["man", "h", "?"], (args, state) => {
  const commands = [
    "help, man, h, ? — list available commands",
    "look, l — describe current location",
    "go [direction] — move to an adjacent location",
    "north/n, south/s, east/e, west/w, up, down — shorthand for go",
    "inventory, inv, i — list items in inventory",
    "desc [name] — vague description of an item",
    "inspect [name] — zoom in on an object",
    "status — current hp, mp, stamina",
    "specs — character stats",
    "menu — open interactive menu",
    "estus — drink a healing potion",
    "roll — perform a dodge",
    "block — perform a block",
    "strat — get hints in combat",
    "cheese — instakill in combat",
    "bonfire — save and get a code"
  ];
  return commands.join("\n");
});

registerCommand("look", ["l", "examine"], (args, state) => {
  const locations = {
    "starting-room": "You awaken in a stone chamber. Torchlight flickers ahead. The air is cold and damp."
  };
  return locations[state.currentLocation] || "You see nothing remarkable.";
});

registerCommand("inventory", ["inv", "i"], (args, state) => {
  if (state.inventory.length === 0) {
    return "Your inventory is empty.";
  }
  return "You carry:\n" + state.inventory.map(item => `  - ${item.name}`).join("\n");
});

registerCommand("status", ["stat", "hp"], (args, state) => {
  return `HP: ${state.hp}/${state.maxHp} | MP: ${state.mp}/${state.maxMp} | Stamina: ${state.stamina}/${state.maxStamina}`;
});

registerCommand("specs", ["stats", "character"], (args, state) => {
  const s = state.stats;
  return [
    `Strength:     ${s.strength}`,
    `Dexterity:    ${s.dexterity}`,
    `Vitality:     ${s.vitality}`,
    `Intelligence: ${s.intelligence}`,
    `Faith:        ${s.faith}`,
    `Luck:         ${s.luck}`
  ].join("\n");
});

registerCommand("desc", ["describe"], (args, state) => {
  if (args.length === 0) {
    return "Describe what? (usage: desc [item name])";
  }
  const itemName = args.join(" ").toLowerCase();
  const item = state.inventory.find(i => i.name.toLowerCase() === itemName);
  if (!item) {
    return `You don't have "${itemName}" in your inventory.`;
  }
  return item.desc;
});

registerCommand("go", ["move", "travel", "north", "south", "east", "west", "up", "down", "n", "s", "e", "w"], (args, state, commandName) => {
  let direction = "";

  // Map shorthand aliases to full directions
  const aliasToDirection = {
    "n": "north", "s": "south", "e": "east", "w": "west",
    "north": "north", "south": "south", "east": "east", "west": "west",
    "up": "up", "down": "down"
  };

  if (aliasToDirection[commandName]) {
    direction = aliasToDirection[commandName];
  } else if (args.length > 0) {
    direction = args[0].toLowerCase();
  } else {
    return "Go where? (usage: go [direction] or north/south/east/west/up/down)";
  }

  const exits = {
    "starting-room": ["north", "south", "east", "west"]
  };

  const availableExits = exits[state.currentLocation] || [];

  if (!availableExits.includes(direction)) {
    return `You can't go ${direction}. Available exits: ${availableExits.join(", ")}`;
  }

  return `You travel ${direction}. The fog grows thicker. You return to where you started.`;
});

registerCommand("menu", ["m"], (args, state) => {
  return "[MENU]\n1. Resume\n2. Stats\n3. Quit\n(Not yet interactive)";
});

registerCommand("inspect", [], (args, state) => {
  if (args.length === 0) {
    return "Inspect what?";
  }
  return `You examine the ${args.join(" ")}. It is wreathed in shadow and mystery.`;
});

registerCommand("estus", ["drink", "heal"], (args, state) => {
  const hpRestored = 30;
  state.hp = Math.min(state.hp + hpRestored, state.maxHp);
  return `You drink from the Estus Flask. HP restored by ${hpRestored}. Current HP: ${state.hp}/${state.maxHp}`;
});

registerCommand("roll", ["dodge", "dash"], (args, state) => {
  return "You roll gracefully, the attack passing harmlessly by.";
});

registerCommand("block", ["defend", "parry"], (args, state) => {
  return "You raise your shield. The impact staggers you, but you hold.";
});

registerCommand("strat", ["hint", "help-combat"], (args, state) => {
  const hints = [
    "Watch for the enemy's opening.",
    "Its weakness lies in its haste.",
    "Strike when it overextends.",
    "The fog may conceal an advantage."
  ];
  return hints[Math.floor(Math.random() * hints.length)];
});

registerCommand("cheese", ["cheat", "win"], (args, state) => {
  return "The enemy crumbles to dust. Your victory tastes hollow.";
});

registerCommand("bonfire", ["save", "rest"], (args, state) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  // Heal on rest
  state.hp = state.maxHp;
  state.stamina = state.maxStamina;
  return {
    text: `You kindle the bonfire. HP restored. (Estus: 5/5)  ·  save code: ${code}`,
    className: "history-system",
    showBonfire: true
  };
});

// ===== OUTPUT RENDERER =====
function renderOutput(playerInput, gameOutput, options = {}) {
  const history = document.getElementById("history");

  const inputLine = document.createElement("div");
  inputLine.className = "history-echo";
  inputLine.textContent = playerInput;
  history.appendChild(inputLine);

  const outputLine = document.createElement("div");
  outputLine.className = options.className || "history-narrative";
  outputLine.textContent = gameOutput;
  history.appendChild(outputLine);

  if (options.showBonfire) {
    history.appendChild(renderBonfireVisual());
  }

  history.scrollTop = history.scrollHeight;

  updateAllHUDBars();
  updateLocationBanner();
}

// ===== INPUT HANDLER =====
function initializeInputHandler() {
  const input = document.getElementById("input");
  const promptContainer = document.getElementById("prompt-container");

  input.addEventListener("focus", () => {
    promptContainer.classList.remove("idle");
  });

  input.addEventListener("blur", () => {
    promptContainer.classList.add("idle");
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const playerInput = input.value.trim();
      input.value = "";

      if (playerInput.length === 0) {
        return;
      }

      gameState.turn += 1;
      const result = dispatchCommand(playerInput);
      renderOutput(playerInput, result.output, {
        className: result.className,
        showBonfire: result.showBonfire
      });
    }
  });
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  initializeThemeSwitcher();
  initializeInputHandler();
  updateAllHUDBars();
  updateLocationBanner();

  const history = document.getElementById("history");
  const welcome = document.createElement("div");
  welcome.className = "history-italic";
  welcome.textContent = "Welcome, Undead. You awaken in a familiar darkness. Type 'help' for guidance.";
  history.appendChild(welcome);

  document.getElementById("input").focus();
});
