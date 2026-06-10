const words = [
    { word: "planet", hint: "A large object that travels around a star" },
    { word: "keyboard", hint: "You press its keys to type" },
    { word: "volcano", hint: "A mountain that can erupt with lava" },
    { word: "library", hint: "A quiet place full of books" },
    { word: "rocket", hint: "A vehicle built to fly into space" },
    { word: "puzzle", hint: "A problem or game that makes you think" },
    { word: "garden", hint: "A place where flowers and plants grow" },
    { word: "thunder", hint: "The loud sound that follows lightning" },
    { word: "diamond", hint: "A sparkling gemstone" },
    { word: "island", hint: "Land surrounded by water" }
];

const hintElement = document.getElementById("hint");
const wordDisplayElement = document.getElementById("wordDisplay");
const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const messageElement = document.getElementById("message");
const usedLettersElement = document.getElementById("usedLetters");
const attemptsLeftElement = document.getElementById("attemptsLeft");
const scoreElement = document.getElementById("score");
const streakElement = document.getElementById("streak");
const newWordButton = document.getElementById("newWordButton");
const resetScoreButton = document.getElementById("resetScoreButton");
const gamePanel = document.querySelector(".game-panel");

let selectedWord = "";
let guessedLetters = new Set();
let attemptsLeft = 0;
let score = 0;
let streak = 0;
let gameOver = false;

function startRound() {
    const randomIndex = Math.floor(Math.random() * words.length);
    const selected = words[randomIndex];

    selectedWord = selected.word;
    guessedLetters = new Set();
    attemptsLeft = Math.max(6, Math.ceil(selectedWord.length * 0.75));
    gameOver = false;

    hintElement.textContent = selected.hint;
    guessInput.disabled = false;
    guessButton.disabled = false;
    guessInput.value = "";
    guessInput.focus();

    setMessage("Type a letter and start guessing.", "info");
    renderGame();
}

function renderGame() {
    wordDisplayElement.innerHTML = "";

    for (const letter of selectedWord) {
        const tile = document.createElement("span");
        tile.className = "letter-tile";
        if (guessedLetters.has(letter)) {
            tile.classList.add("revealed");
            tile.textContent = letter;
        }
        wordDisplayElement.appendChild(tile);
    }

    attemptsLeftElement.textContent = attemptsLeft;
    scoreElement.textContent = score;
    streakElement.textContent = streak;

    const usedLetters = [...guessedLetters].sort();
    usedLettersElement.textContent = usedLetters.length ? usedLetters.join(", ") : "None yet";
}

function handleGuess(event) {
    event.preventDefault();

    if (gameOver) {
        return;
    }

    const guess = guessInput.value.trim().toLowerCase();
    guessInput.value = "";
    guessInput.focus();

    if (!/^[a-z]$/.test(guess)) {
        setMessage("Please enter one letter from A to Z.", "error");
        shakeInput();
        return;
    }

    if (guessedLetters.has(guess)) {
        setMessage(`You already tried "${guess}". Pick another letter.`, "info");
        shakeInput();
        return;
    }

    guessedLetters.add(guess);

    if (selectedWord.includes(guess)) {
        setMessage("Nice hit. Keep going.", "success");
    } else {
        attemptsLeft--;
        setMessage(`Not in the word. ${attemptsLeft} attempts left.`, "error");
    }

    renderGame();
    checkRoundEnd();
}

function checkRoundEnd() {
    const playerWon = [...selectedWord].every((letter) => guessedLetters.has(letter));

    if (playerWon) {
        score += attemptsLeft + selectedWord.length;
        streak++;
        endRound(`You got it! The word was "${selectedWord}".`, "success");
        launchSparkles();
        return;
    }

    if (attemptsLeft <= 0) {
        streak = 0;
        endRound(`Game over. The word was "${selectedWord}".`, "error");
    }
}

function endRound(message, type) {
    gameOver = true;
    guessInput.disabled = true;
    guessButton.disabled = true;
    setMessage(message, type);
    renderGame();
}

function resetScore() {
    score = 0;
    streak = 0;
    startRound();
}

function setMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
}

function shakeInput() {
    guessInput.classList.remove("shake");
    void guessInput.offsetWidth;
    guessInput.classList.add("shake");
}

function launchSparkles() {
    for (let i = 0; i < 18; i++) {
        const sparkle = document.createElement("span");
        const angle = Math.random() * Math.PI * 2;
        const distance = 70 + Math.random() * 120;

        sparkle.className = "sparkle";
        sparkle.style.left = `${45 + Math.random() * 10}%`;
        sparkle.style.top = "42%";
        sparkle.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
        sparkle.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);

        gamePanel.appendChild(sparkle);
        sparkle.addEventListener("animationend", () => sparkle.remove());
    }
}

guessForm.addEventListener("submit", handleGuess);
newWordButton.addEventListener("click", startRound);
resetScoreButton.addEventListener("click", resetScore);

startRound();
