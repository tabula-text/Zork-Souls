# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Zork Souls** is a text-based Soulslike adventure game blending the classic Zork text adventure (1977) with Dark Souls gameplay mechanics and atmosphere. The game is built with vanilla HTML, CSS, and JavaScript — no build step, dependencies, or tooling required.

## Architecture

The project uses a simple flat structure under `ZSv1/`:
- **Zork-Souls.html**: Single HTML entry point with two main DOM containers (`Toolbar` and `Main`) where game UI is rendered
- **script.js**: Game logic, state management, and event handlers (currently minimal/placeholder)
- **styles.css**: Terminal-style dark theme with monospace font (Courier New), styled to evoke retro text adventure aesthetics

The game runs entirely client-side. No build process, transpilation, or backend required.

## Development

**To run the game:**
Open `ZSv1/Zork-Souls.html` directly in a browser, or serve it via any static HTTP server (e.g., `python -m http.server`).

**No test or lint commands** — this is a vanilla JS project with no test framework or linter configured.

## Key Game Concepts

- **Setting**: Cosmic horror, fog-veiled dying land inspired by Dark Souls atmosphere
- **UI Pattern**: Terminal/CLI-like interface (`.CLI` container with toolbar and main output area)
- **Style**: Dark theme (#0a0a23 background, white monospace text) to match retro adventure game feel

## Status

The project is under active development from a freeCodeCamp course foundation. The game loop and core systems are not yet fully implemented in `script.js`.
