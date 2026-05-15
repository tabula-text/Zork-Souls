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
