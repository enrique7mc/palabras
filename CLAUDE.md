# Palabras - Spanish Wordle Clone

A web-based word guessing game inspired by Wordle, built entirely in Spanish. Players have 6 attempts to guess a 5-letter Spanish word, with color-coded feedback after each guess.

## Project Overview

**Palabras** is a single-page application that brings the popular Wordle gameplay to Spanish speakers. The game features three distinct modes, statistics tracking, and an intelligent tutorial system for first-time users.

### Key Features

- **Three Game Modes:**
  - **Daily Mode (🗓️ Diario)**: One word per day, synced to a calendar system starting from January 1, 2025
  - **Practice Mode (🎮 Práctica)**: Unlimited random words for practice, with answer reveal option
  - **Tutorial Mode (🎓 Tutorial)**: Guided learning experience for new players

- **Visual Feedback System:**
  - 🟩 Green: Letter is correct and in the right position
  - 🟨 Yellow: Letter exists in the word but in the wrong position
  - ⬜ Gray: Letter is not in the word
  - Keyboard keys update to match letter states

- **Statistics Tracking (Daily Mode Only):**
  - Games played and win rate
  - Current streak and max streak
  - Countdown timer to next daily word
  - All stats stored in browser localStorage

- **Player-Friendly Features:**
  - Show/Hide answer button (Practice and Tutorial modes only)
  - First-time user detection with tutorial prompt
  - Accent normalization (á, é, í, ó, ú → a, e, i, o, u)
  - Spanish keyboard layout with Ñ
  - Mobile-optimized touch controls
  - Responsive design

### Technical Architecture

**Tech Stack:**
- Pure HTML5, CSS3, and vanilla JavaScript (no frameworks)
- Client-side only - no backend required
- localStorage for persistence
- Runs on any static file server

**File Structure:**
- `index.html`: Main game interface and modals
- `script.js`: Game logic, state management, and event handling
- `styles.css`: Complete styling with animations and responsive breakpoints
- `words.js`: Word lists (WORDS for possible targets, VALID_WORDS for accepted guesses)

**Word Selection Algorithm:**
- Daily words: Deterministic based on days since Jan 1, 2025
- Practice/Tutorial: Random selection from word list
- Automatic filtering for 5-letter words only
- Fallback words if no valid word found

### Game State Management

The game maintains state through global variables:
- `currentRow`, `currentTile`: Position tracking
- `currentGuess`: Current word being typed
- `gameOver`: Boolean flag
- `targetWord`: The word to guess
- `gameMode`: 'daily' | 'practice' | 'tutorial'
- `tutorialStep`: Progress through tutorial hints

### Code Quality & Tooling

- Run keep-sorted on words.js with command `~/go/bin/keep-sorted --mode fix words.js`

## Auto-formatting

A pre-commit hook is configured in `.git/hooks/pre-commit` that automatically formats files before each commit:

1. **keep-sorted**: Runs on `words.js` to keep the word list alphabetically sorted
2. **Prettier**: Formats all `.js`, `.css`, and `.html` files

The hook will automatically stage any formatting changes, so you don't need to run these tools manually.

If you need to recreate the hook, run:
```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Run keep-sorted on words.js
echo "Running keep-sorted on words.js..."
~/go/bin/keep-sorted --mode fix words.js
git add words.js

# Run Prettier on JS, CSS, and HTML files
echo "Running Prettier on JS, CSS, and HTML files..."
npx prettier --write "*.js" "*.css" "*.html"
git add -u

exit 0
EOF
chmod +x .git/hooks/pre-commit
```