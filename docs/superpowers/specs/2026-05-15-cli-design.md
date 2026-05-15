# Zork Souls CLI Design

**Date:** 2026-05-15  
**Scope:** Command-driven text interface with flexible parser and placeholder game logic  
**Status:** Design approved, ready for implementation planning

---

## 1. Overview

Zork Souls is a text-based Soulslike adventure game. The CLI is the primary interface — players type commands (with flexible syntax), and the game outputs text responses. The interface follows a command-registry pattern adapted from the Tabúla CLI, allowing for clean separation of command definitions, game state, and output rendering.

---

## 2. Command Registry Architecture

Commands are registered objects in a central registry. Each command has:
- `name` — canonical command name (e.g., `"look"`)
- `aliases` — alternative names and shorthand (e.g., `["l", "examine"]`)
- `handler(args, gameState)` — function that executes the command and returns output string
- `argSpec` (optional) — argument validation schema (e.g., `{ count: 1, required: false }`)

**Input Processing:**
1. Normalize input: lowercase, trim whitespace
2. Tokenize by space: `"go north"` → `["go", "north"]`
3. Match first token against all command names and aliases
4. Pass remaining tokens as arguments to the handler
5. Handler reads/mutates game state, returns output string
6. Output is appended to history

**Flexible Syntax:**
- `north`, `go north`, `move north` all work (aliases on the `go` command)
- Case-insensitive throughout
- Unknown commands return a brief error message

---

## 3. Game State

Single state object holds all game data:

```javascript
{
  currentLocation: "starting-room",
  inventory: [
    { id: "sword", name: "Sword", desc: "A blade, worn from use..." },
    // ... more items
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
}
```

Game state is a plain object. Commands mutate it directly. No persistence yet (bonfire integration comes later).

---

## 4. Command Handlers

**Information Commands:**
- `help` / `man` — list all available commands with one-line descriptions
- `look` — describe current location with optional flags for objects/changes
- `status` — output current hp/mp/stamina values
- `specs` — output character stats
- `inventory` — list items in inventory
- `desc [name]` — print vague Miyazaki-style description of an item by name

**Movement:**
- `go [direction]` — move player to adjacent location, update state
- Aliases: `north`, `south`, `east`, `west`, `up`, `down`, `travel`, `move`

**Interaction:**
- `inspect [name]` — zoom in on an object description (similar to `desc` but for environmental objects)
- `menu` — open an interactive menu (stub for now, displays a list)

**Combat:**
- `estus` — drink a healing potion, restore hp
- `roll` — perform a dodge (stub output for now)
- `block` — perform a block (stub output for now)
- `strat` — provide vague hints on exploiting enemy weaknesses (stub)
- `cheese` — instant win in combat (stub)

**Game State:**
- `bonfire` — save current game state to Supabase, output a code for resuming (stub for now)

---

## 5. HTML & CSS Structure

**HTML:** Minimal.
```html
<div class="CLI">
  <div class="Toolbar"></div>
  <div id="history"></div>
  <div id="prompt-container">
    <span id="prompt-prefix">> </span>
    <input id="input" type="text" autofocus>
  </div>
</div>
```

**CSS:** Keep it functional and minimal. Existing dark theme (#0a0a23 background, white monospace text) remains. Prompt input and history are plain — no styling beyond what exists. Design tokens will be defined separately.

---

## 6. Output Rendering

Each command produces output in this format:

```
[player input]
[game response]

```

Example:
```
> go north
You travel north through a stone archway. Ahead, the fog thickens.

> look
You stand in a narrow corridor. Torchlight flickers ahead.

```

History div auto-scrolls to show the latest output. No pagination; scroll if you need to see older commands.

---

## 7. Placeholder Logic

For MVP, all commands return hardcoded strings. This allows testing the input/output flow without game logic:

- `look` → returns a fixed description of the starting room
- `go [direction]` → checks if direction exists in a hardcoded exits list, updates `currentLocation`, returns a transition message
- `inventory` → returns a hardcoded list of starting items
- `status` → returns current hp/mp/stamina values (can be mutated by testing commands)
- `specs` → returns character stats
- `help` → returns formatted list of all registered commands
- Combat commands → return amusing flavor text (no state changes yet)
- `bonfire` → returns "Your save code is: ABC123" (no actual save)

---

## 8. No Persistence Yet

Game state is in-memory only. Closing the page loses progress. The `bonfire` command is stubbed — actual Supabase integration will come in a later phase when game logic is solid.

---

## 9. Success Criteria

- ✓ Input field captures commands on Enter
- ✓ Parser normalizes input and matches commands flexibly (aliases work)
- ✓ Output appears in history with player input + game response
- ✓ Game state is mutatable (e.g., moving between locations changes state)
- ✓ All stubbed commands respond with appropriate output
- ✓ Unknown commands produce a brief error message
- ✓ Interface is functional and testable (design polish comes later)

---

## 10. Future Phases (Not in Scope)

- Real game logic (room graph, NPCs, puzzles)
- Supabase persistence via bonfire
- ASCII art rendering (menus, health bars, enemy avatars)
- Audio and music toggle
- Visual bonfire element (CSS-rendered glow)
- Character creation screen
- **Integration with Tabúla CLI:** Ultimate destination is to be an easter egg discoverable through the Tabúla literary CLI

These are logged in the feature backlog and will be prioritized after the CLI foundation is solid.
