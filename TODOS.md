# Zork Souls TODOs

## Phase 1: Design & Atmosphere

- [x] Define design tokens with claude design (colors, spacing, typography for ASCII aesthetic) — **2026-05-16**
  - 3 themes with full color palettes, type scale, CRT effects
  - IBM Plex Mono typography, semantic color system
  - Theme switcher + persistence implemented
- [ ] Sketch room graph and world map (5-10 starting rooms minimum)
- [ ] Write lore snippets for locations and NPCs (Miyazaki-inspired vague descriptions)

## Phase 2: Game Systems

- [ ] Implement combat system (enemy stats, damage calculation, victory conditions)
- [ ] Implement dialogue system (simple branching conversations)
- [ ] Implement puzzle mechanics (keys, switches, environmental interaction)
- [ ] Hook `go` command to real room transitions and location descriptions

## Phase 3: Content & Polish

- [ ] Render ASCII art (health bars, enemy avatars, title screen)
- [ ] Add audio: background music toggle, 8-bit DS1 character creation theme
- [ ] CSS bonfire visual (glowing effect, toggle on/off)
- [ ] Expand item descriptions (vague Miyazaki style)
- [ ] Create enemy bestiary (5-10 starter enemies with lore)

## Phase 4: Persistence

- [ ] Set up Supabase project
- [ ] Implement `bonfire` save/load (generate save code, encode game state)
- [ ] Add character creation flow (stats customization)

## Phase 5: Integration

- [ ] Build easter egg trigger in Tabúla CLI
- [ ] Ship as hidden feature in tabulaWeb
- [ ] Celebrate

---

## Notes

- All game logic is placeholder/stub for now — safe to refactor as real mechanics emerge
- Commands like `strat` and `cheese` are flavor text; real combat will replace them
- Design tokens complete — CSS now fully themed with 3 switchable color palettes
- No external dependencies — keep it vanilla (only Google Fonts for IBM Plex Mono)
- Theme persistence via localStorage; Abyss theme requires player unlock
- Next phase: world design (rooms, NPCs, lore) can now use the established visual language
