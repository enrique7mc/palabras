// Game state
let currentRow = 0;
let currentTile = 0;
let currentGuess = '';
let gameOver = false;
let targetWord = '';

// Keyboard layout for Spanish
const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

// Function to normalize strings (remove accents)
function normalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

// Get word of the day
function getWordOfDay() {
    const startDate = new Date(2025, 0, 1); // Jan 1, 2025
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const wordIndex = diffDays % WORDS.length;
    return normalize(WORDS[wordIndex]);
}

// Initialize game
function init() {
    targetWord = getWordOfDay();
    console.log('Palabra del día:', targetWord); // For debugging
    createBoard();
    createKeyboard();
    setupEventListeners();
    loadStats();
}

// Create game board
function createBoard() {
    const board = document.getElementById('game-board');
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile-${i}-${j}`;
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

// Create keyboard
function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keys.forEach(row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard-row';
        row.forEach(key => {
            const button = document.createElement('button');
            button.className = key.length > 1 ? 'key wide' : 'key';
            button.textContent = key;
            button.setAttribute('data-key', key);
            button.addEventListener('click', () => handleKey(key));
            keyboardRow.appendChild(button);
        });
        keyboard.appendChild(keyboardRow);
    });
}

// Setup event listeners
function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;

        const key = e.key.toUpperCase();

        if (key === 'ENTER') {
            handleKey('ENTER');
        } else if (key === 'BACKSPACE') {
            handleKey('⌫');
        } else if (/^[A-ZÑ]$/.test(key)) {
            handleKey(key);
        }
    });

    // Modal controls
    const statsBtn = document.getElementById('stats-btn');
    const helpBtn = document.getElementById('help-btn');
    const statsModal = document.getElementById('stats-modal');
    const helpModal = document.getElementById('help-modal');
    const closeButtons = document.querySelectorAll('.close');

    statsBtn.addEventListener('click', () => {
        showStats();
        statsModal.classList.remove('hidden');
    });

    helpBtn.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            statsModal.classList.add('hidden');
            helpModal.classList.add('hidden');
        });
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === statsModal) {
            statsModal.classList.add('hidden');
        }
        if (e.target === helpModal) {
            helpModal.classList.add('hidden');
        }
    });
}

// Handle key press
function handleKey(key) {
    if (gameOver) return;

    if (key === 'ENTER') {
        submitGuess();
    } else if (key === '⌫') {
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
        tile.classList.add('filled');
        currentGuess += letter;
        currentTile++;
    }
}

// Delete letter from current guess
function deleteLetter() {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
        tile.textContent = '';
        tile.classList.remove('filled');
        currentGuess = currentGuess.slice(0, -1);
    }
}

// Submit guess
function submitGuess() {
    if (currentTile !== 5) {
        showMessage('No hay suficientes letras', 'error');
        shakeRow();
        return;
    }

    // Check if word is valid
    const normalizedGuess = normalize(currentGuess);
    const normalizedWords = WORDS.map(w => normalize(w));

    if (!normalizedWords.includes(normalizedGuess) && !VALID_WORDS.map(w => normalize(w)).includes(normalizedGuess)) {
        showMessage('Palabra no válida', 'error');
        shakeRow();
        return;
    }

    // Check letters
    checkWord();

    if (normalizedGuess === targetWord) {
        gameOver = true;
        showMessage('¡Excelente! 🎉', 'success');
        updateStats(true, currentRow + 1);
        setTimeout(() => {
            document.getElementById('stats-modal').classList.remove('hidden');
            showStats();
        }, 2000);
    } else if (currentRow === 5) {
        gameOver = true;
        showMessage(`La palabra era: ${targetWord}`, 'error');
        updateStats(false, 0);
        setTimeout(() => {
            document.getElementById('stats-modal').classList.remove('hidden');
            showStats();
        }, 2000);
    } else {
        currentRow++;
        currentTile = 0;
        currentGuess = '';
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

    const result = Array(5).fill('absent');

    // First pass: mark correct letters
    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) {
            result[i] = 'correct';
            letterCount[guess[i]]--;
        }
    }

    // Second pass: mark present letters
    for (let i = 0; i < 5; i++) {
        if (result[i] === 'absent' && letterCount[guess[i]] > 0) {
            result[i] = 'present';
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
    if (state === 'correct') {
        key.classList.add('correct');
        key.classList.remove('present', 'absent');
    } else if (state === 'present' && !currentState.includes('correct')) {
        key.classList.add('present');
        key.classList.remove('absent');
    } else if (state === 'absent' && !currentState.includes('correct') && !currentState.includes('present')) {
        key.classList.add('absent');
    }
}

// Shake row animation
function shakeRow() {
    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`tile-${currentRow}-${i}`);
        tile.classList.add('shake');
        setTimeout(() => {
            tile.classList.remove('shake');
        }, 500);
    }
}

// Show message
function showMessage(text, type = 'show') {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
    setTimeout(() => {
        message.className = 'message';
        message.textContent = '';
    }, 2000);
}

// Statistics functions
function loadStats() {
    const stats = JSON.parse(localStorage.getItem('palabras-stats')) || {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: [0, 0, 0, 0, 0, 0],
        lastPlayedDate: null
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
    localStorage.setItem('palabras-stats', JSON.stringify(stats));
}

function showStats() {
    const stats = loadStats();
    const winRate = stats.gamesPlayed > 0
        ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
        : 0;

    document.getElementById('games-played').textContent = stats.gamesPlayed;
    document.getElementById('win-rate').textContent = winRate;
    document.getElementById('current-streak').textContent = stats.currentStreak;
    document.getElementById('max-streak').textContent = stats.maxStreak;

    // Show countdown to next word
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('next-word-timer').textContent =
        `Próxima palabra en ${hours}h ${minutes}m ${seconds}s`;
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', init);
