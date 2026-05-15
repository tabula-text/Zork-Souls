# Zork Souls CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a functional text adventure CLI with command registry, flexible parser, placeholder game logic, and output history.

**Architecture:** Command-registry pattern with a central game state object. Input is tokenized and matched against registered commands. Each command is a handler function that reads/mutates state and returns output. A simple input listener captures commands on Enter and appends output to a history div.

**Tech Stack:** Vanilla HTML/CSS/JavaScript (no build step, no dependencies).

---

## File Structure

- `ZSv1/Zork-Souls.html` — update with CLI layout (history + prompt)
- `ZSv1/styles.css` — minimal styling for the new layout
- `ZSv1/script.js` — complete CLI implementation (game state, command registry, handlers, input handler, renderer)

---

## Task 1: Update HTML with CLI Structure

**Files:**
- Modify: `ZSv1/Zork-Souls.html`

- [ ] **Step 1: Replace the HTML with CLI layout**

Open `ZSv1/Zork-Souls.html` and replace the entire body with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="./styles.css">
    <title>Zork Souls</title>
  </head>
  <body>
    <div class="CLI">
      <div class="Toolbar"></div>
      <div id="history"></div>
      <div id="prompt-container">
        <span id="prompt-prefix">> </span>
        <input id="input" type="text" autofocus spellcheck="false">
      </div>
    </div>
    <script src="./script.js"></script>
  </body>
</html>
```

The key additions:
- `#history` — div where command output will be appended
- `#prompt-container` — wraps the prompt
- `#prompt-prefix` — the `> ` prompt indicator
- `#input` — text input for commands, autofocused, spellcheck disabled

- [ ] **Step 2: Commit**

```bash
cd /Users/sysiphus/AA_Claude/dev/gamedev/Zork-Souls
git add ZSv1/Zork-Souls.html
git commit -m "feat: update HTML with CLI layout (history + prompt)"
```

---

## Task 2: Update CSS with Minimal Styling

**Files:**
- Modify: `ZSv1/styles.css`

- [ ] **Step 1: Replace CSS with minimal layout styles**

Open `ZSv1/styles.css` and replace with:

```css
body {
  background-color: #0a0a23;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  margin: 0;
  padding: 0;
}

.CLI {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
}

.Toolbar {
  flex-shrink: 0;
  margin-bottom: 10px;
  height: 0; /* Empty for now */
}

#history {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
}

#prompt-container {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}

#prompt-prefix {
  margin-right: 5px;
  flex-shrink: 0;
}

#input {
  flex: 1;
  background-color: #0a0a23;
  color: #ffffff;
  border: none;
  outline: none;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}
```

Key points:
- Flexbox layout: Toolbar at top, history takes remaining space, prompt at bottom
- History uses `white-space: pre-wrap` to preserve command formatting
- Input has no border/outline; inherits dark theme

- [ ] **Step 2: Verify CSS loads correctly**

Open `ZSv1/Zork-Souls.html` in a browser. You should see:
- Dark background
- Empty history area (will fill when commands run)
- Prompt with `> ` and a cursor in the input field

- [ ] **Step 3: Commit**

```bash
git add ZSv1/styles.css
git commit -m "feat: add minimal CLI styling (layout, history, prompt)"
```

---

## Task 3: Implement Game State and Command Registry

**Files:**
- Rewrite: `ZSv1/script.js`

- [ ] **Step 1: Create the initial game state object and registry structure**

Open `ZSv1/script.js` and write:

```javascript
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
  commandRegistry[name.toLowerCase()] = {
    name,
    aliases: aliases.map(a => a.toLowerCase()),
    handler
  };
  
  // Also register aliases
  aliases.forEach(alias => {
    commandRegistry[alias.toLowerCase()] = commandRegistry[name.toLowerCase()];
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
    return command.handler(args, gameState);
  } catch (err) {
    return `Error executing command: ${err.message}`;
  }
}
```

This sets up:
- `gameState` — the core game state object with starting values
- `registerCommand()` — registers a command with name, aliases, and handler
- `dispatchCommand()` — parses input and dispatches to the command handler
- Error handling for unknown commands and handler errors

- [ ] **Step 2: Verify syntax is correct**

Open the browser console. There should be no JavaScript errors. Type:

```javascript
console.log(gameState);
```

You should see the gameState object logged.

- [ ] **Step 3: Commit**

```bash
git add ZSv1/script.js
git commit -m "feat: implement game state and command registry"
```

---

## Task 4: Implement Information Command Handlers

**Files:**
- Modify: `ZSv1/script.js` (append after the registry setup)

- [ ] **Step 1: Add information command handlers**

At the end of `script.js`, before any event listeners, add:

```javascript
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
```

These handlers return hardcoded output for now. `dispatchCommand()` will call them when commands are entered.

- [ ] **Step 2: Verify the commands are registered**

Open browser console and type:

```javascript
dispatchCommand("help");
```

You should see the help text output. Try:

```javascript
dispatchCommand("inventory");
```

You should see the sword and shield listed.

- [ ] **Step 3: Commit**

```bash
git add ZSv1/script.js
git commit -m "feat: add information command handlers (help, look, inventory, status, specs, desc)"
```

---

## Task 5: Implement Movement and Action Command Handlers

**Files:**
- Modify: `ZSv1/script.js` (append to command handlers section)

- [ ] **Step 1: Add movement and action commands**

At the end of the command handlers section, add:

```javascript
registerCommand("go", ["move", "travel", "north", "south", "east", "west", "up", "down"], (args, state) => {
  let direction = "";
  
  // If called as alias (e.g., user typed "north"), direction is the command name
  // If called as "go [direction]", direction is in args[0]
  if (args.length > 0) {
    direction = args[0].toLowerCase();
  } else {
    // This handles aliases like "north", "south", etc.
    // We need to infer direction from how the command was called
    // For now, we'll require explicit direction argument
    return "Go where? (usage: go [direction] or north/south/east/west/up/down)";
  }
  
  const exits = {
    "starting-room": ["north", "south", "east", "west"]
  };
  
  const availableExits = exits[state.currentLocation] || [];
  
  if (!availableExits.includes(direction)) {
    return `You can't go ${direction}. Available exits: ${availableExits.join(", ")}`;
  }
  
  // Update location (for now, just stay in starting room but show a message)
  return `You travel ${direction}. The fog grows thicker. You return to where you started.`;
});

registerCommand("menu", ["m"], (args, state) => {
  return "[MENU]\n1. Resume\n2. Stats\n3. Quit\n(Not yet interactive)";
});

registerCommand("inspect", ["inspect"], (args, state) => {
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
```

Key points:
- `go` command validates direction against available exits
- `estus` command mutates `state.hp` to demonstrate state changes
- `strat` returns a random hint from a list
- `bonfire` generates a fake save code
- All others return hardcoded flavor text

- [ ] **Step 2: Test command dispatch in browser console**

```javascript
dispatchCommand("estus");
console.log(gameState.hp); // Should be 130 (100 + 30)

dispatchCommand("estus");
console.log(gameState.hp); // Should still be 100 (capped at maxHp)

dispatchCommand("go north");
// Should return "You can't go north..."

dispatchCommand("go south");
// Should return "You travel south..."
```

- [ ] **Step 3: Commit**

```bash
git add ZSv1/script.js
git commit -m "feat: add movement and action command handlers"
```

---

## Task 6: Implement Input Handler and Output Renderer

**Files:**
- Modify: `ZSv1/script.js` (append at end)

- [ ] **Step 1: Add input handler and renderer functions**

At the very end of `script.js`, add:

```javascript
// ===== OUTPUT RENDERER =====
function renderOutput(playerInput, gameOutput) {
  const history = document.getElementById("history");
  
  // Append player input
  const inputLine = document.createElement("div");
  inputLine.textContent = `> ${playerInput}`;
  history.appendChild(inputLine);
  
  // Append game output
  const outputLine = document.createElement("div");
  outputLine.textContent = gameOutput;
  history.appendChild(outputLine);
  
  // Add blank line for spacing
  const spacer = document.createElement("div");
  spacer.textContent = "";
  history.appendChild(spacer);
  
  // Auto-scroll to bottom
  history.scrollTop = history.scrollHeight;
}

// ===== INPUT HANDLER =====
function initializeInputHandler() {
  const input = document.getElementById("input");
  
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      
      const playerInput = input.value.trim();
      input.value = ""; // Clear input field
      
      if (playerInput.length === 0) {
        return; // Ignore empty commands
      }
      
      // Dispatch command and get output
      const output = dispatchCommand(playerInput);
      
      // Render to history
      renderOutput(playerInput, output);
    }
  });
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  initializeInputHandler();
  
  // Welcome message
  const history = document.getElementById("history");
  const welcome = document.createElement("div");
  welcome.textContent = "Welcome to Zork Souls. Type 'help' for a list of commands.";
  history.appendChild(welcome);
  
  const spacer = document.createElement("div");
  spacer.textContent = "";
  history.appendChild(spacer);
  
  // Focus input
  document.getElementById("input").focus();
});
```

Key points:
- `renderOutput()` appends the player input and game output to the history div
- Auto-scroll keeps the latest output visible
- Input handler listens for Enter key
- On Enter, it clears the input field, dispatches the command, and renders the output
- DOMContentLoaded initializes the handler and shows a welcome message

- [ ] **Step 2: Test in browser**

Open `ZSv1/Zork-Souls.html` in a browser. You should see:
- Welcome message in the history
- Cursor in the input field
- Type "help" and press Enter — the help text should appear
- Type "inventory" and press Enter — your items should appear
- Type "estus" and press Enter — HP should restore
- Type "status" and press Enter — HP should show the updated value

- [ ] **Step 3: Commit**

```bash
git add ZSv1/script.js
git commit -m "feat: implement input handler and output renderer"
```

---

## Task 7: Test End-to-End Flow

**Files:**
- Test: `ZSv1/Zork-Souls.html` (manual testing only, no automated tests for MVP)

- [ ] **Step 1: Manual test all commands**

Open the game in a browser and test each command:

```
help                    → List all commands
look                    → Describe current location
inventory               → List items
desc sword              → Item description
status                  → HP/MP/Stamina
specs                   → Stats
go north                → Movement message
north                   → Shorthand movement
estus                   → Heal, verify HP increases
estus                   → Verify HP caps at max
roll                    → Dodge message
block                   → Block message
strat                   → Random hint
cheese                  → Instakill message
menu                    → Menu mockup
bonfire                 → Save code
unknown-command         → Error message
```

All commands should:
- ✓ Appear in the history with player input shown
- ✓ Return appropriate output
- ✓ Not cause JavaScript errors (check console)
- ✓ Clear the input field after execution
- ✓ Keep the input focused for next command

- [ ] **Step 2: Test edge cases**

```
help help               → Should treat "help" as command, "help" as ignored argument
LOOK                    → Should work (case-insensitive)
go                      → Should show usage error
desc nonexistent        → Should show "don't have" error
                        → (empty input) Should be ignored
```

- [ ] **Step 3: Verify history auto-scrolls**

Type many commands to generate a long history. The latest output should always be visible at the bottom.

- [ ] **Step 4: Verify no console errors**

Open browser DevTools (F12) and check the Console tab. There should be no errors.

---

## Task 8: Final Commit

- [ ] **Step 1: Check git status**

```bash
cd /Users/sysiphus/AA_Claude/dev/gamedev/Zork-Souls
git status
```

You should see all three files modified:
- `ZSv1/Zork-Souls.html`
- `ZSv1/styles.css`
- `ZSv1/script.js`

- [ ] **Step 2: View the complete script.js to verify**

The file should have these sections in order:
1. Game state object
2. Command registry functions
3. Command handler registrations (help, look, inventory, status, specs, desc, go, menu, inspect, estus, roll, block, strat, cheese, bonfire)
4. Output renderer
5. Input handler
6. DOMContentLoaded initialization

- [ ] **Step 3: Final verification in browser**

Open `ZSv1/Zork-Souls.html` one more time. Test:
- Welcome message appears
- Type "help" → all commands listed
- Type "estus" → HP changes
- Type "bonfire" → save code generated
- History shows all output correctly

---

## Success Criteria

All of these should be true after completing all tasks:

- ✓ HTML has history div and prompt input
- ✓ CSS provides minimal but functional layout
- ✓ Game state is initialized with inventory, HP, stats
- ✓ Command registry accepts commands and dispatches to handlers
- ✓ All 15 commands respond with appropriate output
- ✓ Commands that mutate state (estus) reflect changes in subsequent commands (status)
- ✓ Input field clears after each command
- ✓ History shows all commands and responses
- ✓ History auto-scrolls to latest output
- ✓ No JavaScript errors in console
- ✓ Case-insensitive input works
- ✓ Unknown commands show error message
- ✓ Empty input is ignored

