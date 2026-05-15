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
  currentEnemy: null
};

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
    return "";
  }

  const commandName = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  if (!commandRegistry[commandName]) {
    return `Unknown command: "${commandName}". Type "help" for a list of commands.`;
  }

  const command = commandRegistry[commandName];
  try {
    return command.handler(args, gameState, commandName);
  } catch (err) {
    return `Error executing command: ${err.message}`;
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
  return `You rest at the bonfire. Your save code is: ${code}`;
});

// ===== OUTPUT RENDERER =====
function renderOutput(playerInput, gameOutput) {
  const history = document.getElementById("history");

  const inputLine = document.createElement("div");
  inputLine.textContent = `> ${playerInput}`;
  history.appendChild(inputLine);

  const outputLine = document.createElement("div");
  outputLine.textContent = gameOutput;
  history.appendChild(outputLine);

  const spacer = document.createElement("div");
  spacer.textContent = "";
  history.appendChild(spacer);

  history.scrollTop = history.scrollHeight;
}

// ===== INPUT HANDLER =====
function initializeInputHandler() {
  const input = document.getElementById("input");

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const playerInput = input.value.trim();
      input.value = "";

      if (playerInput.length === 0) {
        return;
      }

      const output = dispatchCommand(playerInput);
      renderOutput(playerInput, output);
    }
  });
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  initializeInputHandler();

  const history = document.getElementById("history");
  const welcome = document.createElement("div");
  welcome.textContent = "Welcome to Zork Souls. Type 'help' for a list of commands.";
  history.appendChild(welcome);

  const spacer = document.createElement("div");
  spacer.textContent = "";
  history.appendChild(spacer);

  document.getElementById("input").focus();
});
