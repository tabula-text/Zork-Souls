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
    "north, south, east, west, up, down — shorthand for go",
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
