# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200
npm run build      # Production build → dist/tajniacy/
npm test           # Run tests with Karma/Jasmine
npm run watch      # Build in watch mode (development)
```

## Pre-commit build (GitHub Pages)

Before every commit, build the files for GitHub Pages and include them in the commit:

```bash
ng build --output-path docs --base-href /tajniacy/
cp docs/index.html docs/404.html
```

Then stage the `docs/` directory along with any other changed files before committing.

## Architecture

**Tajniacy** is an Angular 14 SPA for a Polish Codenames-style word game. Single-page, no routing — the entire game lives in `AppComponent`.

### Data Flow

- `AppComponent` holds all game state and polls the backend every 1 second via `HttpClientService`
- User actions (tile clicks, new game, word management) call the backend immediately, then re-poll
- The backend is a remote REST API at `https://tajniacy-backend.onrender.com`

### API Endpoints (via `HttpClientService`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/game` | Current round tiles and state |
| GET | `/words` | Full word list |
| POST | `/game` | Start a new game |
| POST | `/tiles?tileName=...` | Click/pick a tile |
| POST | `/words` | Save word list |
| POST | `/words/reset` | Reset words to defaults |

### Key Files

- `src/app/app.component.ts` — game board, polling logic, tile state, leader mode
- `src/app/http-client.service.ts` — all HTTP calls
- `src/app/app.module.ts` — Angular Material and CDK imports
- `src/styles.scss` — global dark Material theme

### Dialog Components

All dialogs are opened via `MatDialog` from `AppComponent`:
- `EditWordsDialog` — toggle/delete/add words in the word pool
- `AddNewWordsDialog` — input form for bulk-adding words (space or newline separated)
- `ConfirmDialog` / `InfoDialog` — generic confirmation and notification dialogs
- `DialogContentComponent` — confirmation for individual tile selection

### Tile Colors

Tiles are color-coded by team: RED (`#f06a68`), BLUE (`#89CFEF`), BLANK (gray), BLACK (black). The leader toggle reveals tile colors before tiles are clicked.
