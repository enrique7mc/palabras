import { WORDS, VALID_WORDS } from "./words.js";

// Function to normalize strings (remove accents) - moved up for pre-computation
function normalizeWord(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

// Function to validate word length
function validateWordLength(word) {
  return word.length === 5;
}

// Pre-compute normalized word lists (do this once at module load)
const NORMALIZED_WORDS = WORDS.map((w) => normalizeWord(w)).filter((w) =>
  validateWordLength(w),
);
const NORMALIZED_VALID_WORDS = VALID_WORDS.map((w) => normalizeWord(w)).filter(
  (w) => validateWordLength(w),
);

// Game state
let currentRow = 0;
let currentTile = 0;
let currentGuess = "";
let gameOver = false;
let targetWord = "";
let gameMode = "daily"; // 'daily', 'practice', 'tutorial'
let tutorialStep = 0;
let tutorialHints = [];

// Keyboard layout for Spanish
export const keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

// Exported function to normalize strings (calls internal version)
export function normalize(str) {
  return normalizeWord(str);
}

// Exported function to validate word is exactly 5 letters (calls internal version)
export function isValidWordLength(word) {
  return validateWordLength(word);
}

// Get word of the day
export function getWordOfDay() {
  const startDate = new Date(2025, 0, 1); // Jan 1, 2025
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = today - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Keep trying until we find a 5-letter word
  let attempts = 0;
  let wordIndex = diffDays % WORDS.length;
  let word = normalize(WORDS[wordIndex]);

  while (!isValidWordLength(word) && attempts < WORDS.length) {
    attempts++;
    wordIndex = (diffDays + attempts) % WORDS.length;
    word = normalize(WORDS[wordIndex]);
  }

  // If no 5-letter word found, fallback to a known good word
  if (!isValidWordLength(word)) {
    console.warn("No 5-letter word found, using fallback");
    word = "MUNDO";
  }

  return word;
}

// Get random word for practice mode
export function getRandomWord() {
  // Keep trying until we find a 5-letter word
  let attempts = 0;
  const maxAttempts = 100;
  let word;

  do {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    word = normalize(WORDS[randomIndex]);
    attempts++;
  } while (!isValidWordLength(word) && attempts < maxAttempts);

  // If no 5-letter word found, fallback to a known good word
  if (!isValidWordLength(word)) {
    console.warn("No 5-letter word found, using fallback");
    word = "CAMPO";
  }

  return word;
}

// Tutorial word list (easier, common words)
export const tutorialWords = [
  "PADRE",
  "COMER",
  "PERRO",
  "LIBRO",
  "GALLO",
  "ACERO",
  "SILLA",
  "MUELA",
];

// Get tutorial word (easier, common word)
export function getTutorialWord() {
  // Filter to only 5-letter words
  const validWords = tutorialWords.filter((w) => isValidWordLength(w));

  if (validWords.length === 0) {
    console.warn("No valid tutorial words, using fallback");
    return "LIBRO";
  }

  const randomIndex = Math.floor(Math.random() * validWords.length);
  return validWords[randomIndex];
}

// Initialize game
function init() {
  targetWord = getWordOfDay();
  console.log("Palabra del día:", targetWord); // For debugging
  createBoard();
  createKeyboard();
  setupEventListeners();
  loadStats();
  checkFirstTimeUser();
}

// Check if first time user
function checkFirstTimeUser() {
  const hasPlayed = localStorage.getItem("palabras-has-played");
  if (!hasPlayed) {
    setTimeout(() => {
      document.getElementById("tutorial-modal").classList.remove("hidden");
    }, 500);
  }
}

// Start new practice game
function startPracticeGame() {
  gameMode = "practice";
  targetWord = getRandomWord();
  console.log("Palabra práctica:", targetWord); // For debugging
  resetGame();
  updateUI();
  // Reset show answer button
  const showAnswerBtn = document.getElementById("show-answer-btn");
  if (showAnswerBtn) {
    showAnswerBtn.textContent = "💡 Ver Respuesta";
  }
}

// Start tutorial
function startTutorial() {
  gameMode = "tutorial";
  tutorialStep = 0;
  targetWord = getTutorialWord();
  console.log("Palabra tutorial:", targetWord); // For debugging
  resetGame();
  updateUI();
  showTutorialHint();
  // Reset show answer button
  const showAnswerBtn = document.getElementById("show-answer-btn");
  if (showAnswerBtn) {
    showAnswerBtn.textContent = "💡 Ver Respuesta";
  }
}

// Reset game board
function resetGame() {
  currentRow = 0;
  currentTile = 0;
  currentGuess = "";
  gameOver = false;

  // Clear board
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  createBoard();

  // Reset keyboard
  const keys = document.querySelectorAll(".key");
  keys.forEach((key) => {
    key.classList.remove("correct", "present", "absent");
  });

  // Clear message
  document.getElementById("message").textContent = "";
  document.getElementById("message").className = "message";
}

// Update UI based on game mode
function updateUI() {
  const subtitle = document.getElementById("subtitle");
  const dailyBtn = document.getElementById("daily-mode-btn");
  const practiceBtn = document.getElementById("practice-mode-btn");
  const newGameBtn = document.getElementById("new-game-btn");
  const showAnswerBtn = document.getElementById("show-answer-btn");
  const nextWordTimer = document.getElementById("next-word-timer");

  if (gameMode === "daily") {
    subtitle.textContent = "Adivina la palabra del día";
    dailyBtn.classList.add("active");
    practiceBtn.classList.remove("active");
    newGameBtn.classList.add("hidden");
    showAnswerBtn.classList.add("hidden");
    // Also hide the answer if it was showing
    const message = document.getElementById("message");
    if (message && message.textContent.includes("La respuesta es:")) {
      message.className = "message";
      message.textContent = "";
    }
    if (nextWordTimer) nextWordTimer.style.display = "block";
  } else {
    subtitle.textContent =
      gameMode === "tutorial" ? "🎓 Modo Tutorial" : "🎮 Modo Práctica";
    dailyBtn.classList.remove("active");
    practiceBtn.classList.add("active");
    newGameBtn.classList.remove("hidden");
    showAnswerBtn.classList.remove("hidden");
    if (nextWordTimer) nextWordTimer.style.display = "none";
  }
}

// Create game board
export function createBoard() {
  const board = document.getElementById("game-board");
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 5; j++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.id = `tile-${i}-${j}`;
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

// Create keyboard
export function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keys.forEach((row) => {
    const keyboardRow = document.createElement("div");
    keyboardRow.className = "keyboard-row";
    row.forEach((key) => {
      const button = document.createElement("button");
      button.className = key.length > 1 ? "key wide" : "key";
      button.textContent = key;
      button.setAttribute("data-key", key);

      // Handle both click and touch events for better mobile support
      let touchHandled = false;

      button.addEventListener("touchstart", (e) => {
        e.preventDefault(); // Prevent ghost clicks
        touchHandled = true;
        handleKey(key);
      });

      button.addEventListener("click", (e) => {
        if (!touchHandled) {
          handleKey(key);
        }
        touchHandled = false;
      });

      keyboardRow.appendChild(button);
    });
    keyboard.appendChild(keyboardRow);
  });
}

// Setup event listeners
function setupEventListeners() {
  document.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();

    // Prevent default browser behavior for game keys BEFORE any other checks
    if (key === "ENTER" || key === "BACKSPACE" || /^[A-ZÑ]$/.test(key)) {
      e.preventDefault();
    }

    if (gameOver) return;

    if (key === "ENTER") {
      handleKey("ENTER");
    } else if (key === "BACKSPACE") {
      handleKey("⌫");
    } else if (/^[A-ZÑ]$/.test(key)) {
      handleKey(key);
    }
  });

  // Modal controls
  const statsBtn = document.getElementById("stats-btn");
  const helpBtn = document.getElementById("help-btn");
  const newGameBtn = document.getElementById("new-game-btn");
  const showAnswerBtn = document.getElementById("show-answer-btn");
  const dailyModeBtn = document.getElementById("daily-mode-btn");
  const practiceModeBtn = document.getElementById("practice-mode-btn");
  const statsModal = document.getElementById("stats-modal");
  const helpModal = document.getElementById("help-modal");
  const tutorialModal = document.getElementById("tutorial-modal");
  const startTutorialBtn = document.getElementById("start-tutorial-btn");
  const skipTutorialBtn = document.getElementById("skip-tutorial-btn");
  const closeButtons = document.querySelectorAll(".close");

  statsBtn.addEventListener("click", () => {
    showStats();
    statsModal.classList.remove("hidden");
  });

  helpBtn.addEventListener("click", () => {
    helpModal.classList.remove("hidden");
  });

  newGameBtn.addEventListener("click", () => {
    startPracticeGame();
  });

  showAnswerBtn.addEventListener("click", () => {
    toggleAnswer();
  });

  dailyModeBtn.addEventListener("click", () => {
    gameMode = "daily";
    targetWord = getWordOfDay();
    resetGame();
    updateUI();
    // Reset show answer button
    const showAnswerBtn = document.getElementById("show-answer-btn");
    if (showAnswerBtn) {
      showAnswerBtn.textContent = "💡 Ver Respuesta";
    }
  });

  practiceModeBtn.addEventListener("click", () => {
    startPracticeGame();
  });

  startTutorialBtn.addEventListener("click", () => {
    tutorialModal.classList.add("hidden");
    localStorage.setItem("palabras-has-played", "true");
    startTutorial();
  });

  skipTutorialBtn.addEventListener("click", () => {
    tutorialModal.classList.add("hidden");
    localStorage.setItem("palabras-has-played", "true");
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      statsModal.classList.add("hidden");
      helpModal.classList.add("hidden");
      tutorialModal.classList.add("hidden");
    });
  });

  // Close modals on outside click
  window.addEventListener("click", (e) => {
    if (e.target === statsModal) {
      statsModal.classList.add("hidden");
    }
    if (e.target === helpModal) {
      helpModal.classList.add("hidden");
    }
    if (e.target === tutorialModal) {
      tutorialModal.classList.add("hidden");
      localStorage.setItem("palabras-has-played", "true");
    }
  });
}

// Handle key press
function handleKey(key) {
  if (gameOver) return;

  if (key === "ENTER") {
    submitGuess();
  } else if (key === "⌫") {
    deleteLetter();
  } else if (currentTile < 5) {
    addLetter(key);
  }
}

// Add letter to current guess
function addLetter(letter) {
  if (currentTile < 5) {
    const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
    tile.textContent = letter;
    tile.classList.add("filled");
    currentGuess += letter;
    currentTile++;

    // Tutorial hint: when first word is complete
    if (gameMode === "tutorial" && tutorialStep === 0 && currentTile === 5) {
      advanceTutorial();
    }
  }
}

// Delete letter from current guess
function deleteLetter() {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
    tile.textContent = "";
    tile.classList.remove("filled");
    currentGuess = currentGuess.slice(0, -1);
  }
}

// Submit guess
function submitGuess() {
  if (currentTile !== 5) {
    showMessage("No hay suficientes letras", "error");
    shakeRow();
    return;
  }

  // Check if word is valid
  const normalizedGuess = normalize(currentGuess);

  // Validate word length
  if (!isValidWordLength(normalizedGuess)) {
    showMessage("La palabra debe tener 5 letras", "error");
    shakeRow();
    return;
  }

  // Use pre-computed normalized word lists (much faster!)
  if (
    !NORMALIZED_WORDS.includes(normalizedGuess) &&
    !NORMALIZED_VALID_WORDS.includes(normalizedGuess)
  ) {
    showMessage("Palabra no válida", "error");
    shakeRow();
    return;
  }

  // Check letters
  checkWord();

  // Advance tutorial hint after each guess
  if (gameMode === "tutorial") {
    advanceTutorial();
  }

  if (normalizedGuess === targetWord) {
    gameOver = true;
    const messages = {
      daily: "¡Excelente! 🎉",
      practice: "¡Muy bien! 🎉 ¿Otra práctica?",
      tutorial:
        "🎓 ¡Perfecto! Has completado el tutorial. Ahora puedes jugar el modo diario o seguir practicando.",
    };
    showMessage(messages[gameMode], "success");

    // Only update stats in daily mode
    if (gameMode === "daily") {
      updateStats(true, currentRow + 1);
      setTimeout(() => {
        document.getElementById("stats-modal").classList.remove("hidden");
        showStats();
      }, 2000);
    }
  } else if (currentRow === 5) {
    gameOver = true;
    const messages = {
      daily: `La palabra era: ${targetWord}`,
      practice: `La palabra era: ${targetWord}. ¡Inténtalo de nuevo!`,
      tutorial: `La palabra era: ${targetWord}. No te preocupes, sigue practicando.`,
    };
    showMessage(messages[gameMode], "error");

    // Only update stats in daily mode
    if (gameMode === "daily") {
      updateStats(false, 0);
      setTimeout(() => {
        document.getElementById("stats-modal").classList.remove("hidden");
        showStats();
      }, 2000);
    }
  } else {
    currentRow++;
    currentTile = 0;
    currentGuess = "";
  }
}

// Check word and update tiles
function checkWord() {
  const guess = normalize(currentGuess);
  const target = targetWord;
  const letterCount = {};

  // Count letters in target word
  for (let letter of target) {
    letterCount[letter] = (letterCount[letter] || 0) + 1;
  }

  const result = Array(5).fill("absent");

  // First pass: mark correct letters
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      letterCount[guess[i]]--;
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < 5; i++) {
    if (result[i] === "absent" && letterCount[guess[i]] > 0) {
      result[i] = "present";
      letterCount[guess[i]]--;
    }
  }

  // Update tiles and keyboard
  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`tile-${currentRow}-${i}`);
    setTimeout(() => {
      tile.classList.add(result[i]);
      updateKeyboard(guess[i], result[i]);
    }, i * 300);
  }
}

// Update keyboard colors
function updateKeyboard(letter, state) {
  const key = document.querySelector(`[data-key="${letter}"]`);
  if (!key) return;

  const currentState = key.className;

  // Priority: correct > present > absent
  if (state === "correct") {
    key.classList.add("correct");
    key.classList.remove("present", "absent");
  } else if (state === "present" && !currentState.includes("correct")) {
    key.classList.add("present");
    key.classList.remove("absent");
  } else if (
    state === "absent" &&
    !currentState.includes("correct") &&
    !currentState.includes("present")
  ) {
    key.classList.add("absent");
  }
}

// Shake row animation
function shakeRow() {
  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`tile-${currentRow}-${i}`);
    tile.classList.add("shake");
    setTimeout(() => {
      tile.classList.remove("shake");
    }, 500);
  }
}

// Show message
export function showMessage(text, type = "show") {
  const message = document.getElementById("message");
  message.textContent = text;
  message.className = `message ${type}`;
  setTimeout(() => {
    message.className = "message";
    message.textContent = "";
  }, 2000);
}

// Toggle answer display (only in practice/tutorial mode)
function toggleAnswer() {
  if (gameMode === "daily") return; // Don't show answer in daily mode

  const btn = document.getElementById("show-answer-btn");
  const message = document.getElementById("message");

  if (btn.textContent === "💡 Ver Respuesta") {
    // Show answer - directly set message without timeout
    message.textContent = `La respuesta es: ${targetWord}`;
    message.className = "message show";
    btn.textContent = "🔒 Ocultar Respuesta";
  } else {
    // Hide answer
    message.className = "message";
    message.textContent = "";
    btn.textContent = "💡 Ver Respuesta";
  }
}

// Statistics functions
function loadStats() {
  const stats = JSON.parse(localStorage.getItem("palabras-stats")) || {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    lastPlayedDate: null,
  };
  return stats;
}

function updateStats(won, guesses) {
  const stats = loadStats();
  const today = new Date().toDateString();

  // Check if already played today
  if (stats.lastPlayedDate === today) {
    return;
  }

  stats.gamesPlayed++;

  if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.guessDistribution[guesses - 1]++;
  } else {
    stats.currentStreak = 0;
  }

  stats.lastPlayedDate = today;
  localStorage.setItem("palabras-stats", JSON.stringify(stats));
}

function showStats() {
  const stats = loadStats();
  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  document.getElementById("games-played").textContent = stats.gamesPlayed;
  document.getElementById("win-rate").textContent = winRate;
  document.getElementById("current-streak").textContent = stats.currentStreak;
  document.getElementById("max-streak").textContent = stats.maxStreak;

  // Show countdown to next word
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diff = tomorrow - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("next-word-timer").textContent =
    `Próxima palabra en ${hours}h ${minutes}m ${seconds}s`;
}

// Tutorial hints system
function showTutorialHint() {
  if (gameMode !== "tutorial") return;

  const hints = [
    "💡 Escribe cualquier palabra de 5 letras usando el teclado. Intenta con palabras comunes como PERRO, HOGAR o LIBRO.",
    "💡 ¡Bien hecho! Ahora presiona ENTER para enviar tu palabra. Los colores te mostrarán qué tan cerca estás.",
    "💡 🟩 Verde = letra correcta en posición correcta<br>🟨 Amarillo = letra correcta pero en otra posición<br>⬜ Gris = letra no está en la palabra",
    "💡 Usa la información de los colores para tu siguiente intento. Las letras verdes ya están en su lugar correcto.",
    "💡 Sigue probando palabras que incluyan las letras amarillas en diferentes posiciones.",
    "💡 ¡Excelente trabajo! Sigue así hasta adivinar la palabra completa.",
  ];

  const messageDiv = document.getElementById("message");
  if (tutorialStep < hints.length) {
    messageDiv.innerHTML = hints[tutorialStep];
    messageDiv.className = "message show";
  }
}

function advanceTutorial() {
  if (gameMode !== "tutorial") return;

  tutorialStep++;
  setTimeout(() => {
    showTutorialHint();
  }, 2500);
}

// Initialize game when page loads
window.addEventListener("DOMContentLoaded", init);
