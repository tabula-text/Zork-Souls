# Zork Souls Changelog

## 2026-05-16

### ✅ Completed

**Design System Implementation (v1 → v2 polish)**

*v1 — initial implementation:*
- 3 lore-named themes with complete color palettes (Bonfire / Hollow / Abyss)
- IBM Plex Mono typography with 6-level type scale
- Semantic color tokens (25+ per theme)
- CRT effects: scanlines, vignette, flicker, text glow
- Theme switcher with lock system + localStorage persistence

*v2 — visual polish (matched to design reference):*
- **Bonfire ASCII visual** — coiled sword (12-row pre) rotated -6°, smoldering flame, halo glow, 6 animated cinder particles (wink + drift). Universal warm palette regardless of theme (eternal flame).
- **ASCII HUD bars** — `█` filled / `░` empty with glyph icons (♥ HP, ✦ MP, ◆ Stamina) — replacing prior plain div bars
- **3-column toolbar** — title (with letter-spacing 4px + accent glow) · centered HUD · audio + theme cluster
- **Location banner** — `── Undead Asylum ──` with turn counter and meta line ("fog descending")
- **System message glow** — `[ system ]` prefix + accent text-shadow for important moments
- **Italic flavor text** — for examinations and welcome message
- **Removed history container border** — content flows naturally with proper margins
- **Top-border prompt** — divider line separates prompt from history (matches design)
- Turn counter increments per command

**Code Quality**
- XSS-safe output rendering (DOM construction, no innerHTML for user data)
- Handler return values support `{ text, className, showBonfire }` objects
- All CSS scoped to `.zs-{theme}` for easy runtime switching

---

## 2026-05-15

### ✅ Completed

**CLI Foundation**
- Basic text adventure interface with command registry pattern
- 15 placeholder commands: `help`, `look`, `inventory`, `status`, `specs`, `desc`, `go`, `menu`, `inspect`, `estus`, `roll`, `block`, `strat`, `cheese`, `bonfire`
- Flexible parser: case-insensitive, aliases work (`north` = `go north`), multi-word arguments supported
- Game state: inventory, HP/MP/stamina, character stats (strength, dexterity, vitality, intelligence, faith, luck)
- Output history with auto-scroll
- No console errors, XSS-safe (uses `textContent`)

**Documentation**
- `CLAUDE.md` — project overview and architecture
- `docs/superpowers/specs/2026-05-15-cli-design.md` — full spec
- `docs/superpowers/plans/2026-05-15-cli-implementation.md` — implementation plan with 8 tasks
- Feature backlog logged in memory

### 🔄 In Progress

- Design tokens (awaiting feedback from claude design)
- Game world design (room graph, NPCs, lore)

### 📋 Backlog (Logged in Memory)

- Real game logic (combat system, dialogue, puzzles)
- ASCII art rendering (health bars, enemy avatars, menus)
- Audio toggle and 8-bit DS1 character creation screen music
- CSS bonfire visual (glowing effect)
- Supabase persistence via `bonfire` save codes
- Integration with Tabúla CLI as easter egg

---

## Architecture Notes

- **Pattern:** Command registry with flat lookup table keyed by name + aliases
- **State:** Single `gameState` object mutated by handlers
- **Rendering:** `textContent` + `pre-wrap` CSS for safe multi-line output
- **File structure:** Single `script.js` (organized by section), minimal HTML, functional CSS
- **No dependencies:** Vanilla JS, no build step

---

## Running the Game

```bash
cd ZSv1
python3 -m http.server 8000
# Open http://localhost:8000/Zork-Souls.html
```

Type `help` for command list.
