// gameOver.js
"use strict";

restoreGameViewSize();

/** 
 * Used to restore the size of the game between changes in windows.
 * 
 * @function restoreGameViewSize
 * 
 * @variable {HTMLElement} gameZone - The element with id "GameZone" whose size is being saved.
 * @variable {number} width - The current width of the "GameZone" element in pixels.
 * @variable {number} height - The current height of the "GameZone" element in pixels.
 * 
 * @returns {void} This function does not return a value
 */
function restoreGameViewSize() {
    const gameZone = document.getElementById('GameZone');
    const savedWidth = localStorage.getItem('gameZoneWidth');
    const savedHeight = localStorage.getItem('gameZoneHeight');

    if (savedWidth && savedHeight) {
        gameZone.style.width = savedWidth + 'px';
        gameZone.style.height = savedHeight + 'px';
    }
}

/*────────────────────────────────────────────
  RANDOM “GAME OVER” MESSAGE
────────────────────────────────────────────*/

/**
 * List of possible messages shown at game‑over.
 * Feel free to add or remove lines.
 * @type {string[]}
 */
const GAME_OVER_MESSAGES = [
    "GAME OVER",
    "Better luck next time!",
    "Out of lives—but not out of spirit!",
    "The quiz strikes again!",
    "No worries, you can try again!",
    "Mission failed… for now.",
    "That's all, quiz‑folk!",
    "Zero lives left—take a breather!",
    "Kaboom! Your run is done."
];

/***
 * Picks a random entry from `GAME_OVER_MESSAGES`.
 * @returns {string} Random game‑over message
 */
function getRandomGameOverMessage() {
    const i = Math.floor(Math.random() * GAME_OVER_MESSAGES.length);
    return GAME_OVER_MESSAGES[i];
}

/*────────────────────────────────────────────
  NAVIGATION BUTTONS
────────────────────────────────────────────*/

/***
 * Clears storage and returns to the home screen.
 * @returns {void}
 */
function goToHome() {
    localStorage.clear();
    saveGameViewSize();
    window.location.href = "/index.html";
}

/***
 * Clears storage and starts a fresh game.
 * @returns {void}
 */
function playAgain() {
    localStorage.clear();
    saveGameViewSize();
    window.location.href = '/categories.html';
}

/**
 * Used to save the size of the game between changes in windows.
 * 
 * @function saveGameViewSize
 * 
 * @variable {HTMLElement} gameZone - The element with id "GameZone" whose size is being saved.
 * @variable {number} width - The current width of the "GameZone" element in pixels.
 * @variable {number} height - The current height of the "GameZone" element in pixels.
 * 
 * @returns {void} This function does not return a value.
 */
function saveGameViewSize() {
    const gameZone = document.getElementById('GameZone');
    const width = gameZone.offsetWidth;
    const height = gameZone.offsetHeight;

    localStorage.setItem('gameZoneWidth', width);
    localStorage.setItem('gameZoneHeight', height);
}

/*────────────────────────────────────────────
  SOUND EFFECT
────────────────────────────────────────────*/

/** Cached HTMLAudioElement (created lazily). */
let gameOverAudio;

/***
 * Plays the “game over” sound once.
 * @returns {void}
 */
function playGameOverSoundEffect() {
    if (!gameOverAudio) {
        gameOverAudio = new Audio(
            "https://cdn.freesound.org/previews/173/173859_1074082-lq.mp3"
        );
        gameOverAudio.type = "audio/mpeg";
    }
    gameOverAudio.play().catch((e) => console.error("Playback failed:", e));
}

/**
 * Allows for players to select answers with the arrow keys by moving right and left and
 * pressing the "ENTER" key to select an answer
 * 
 * @returns In case no buttons are found it immediately returns
 */
function setupNavigation() {
    // Grab all the answer buttons
    var buttons = document.querySelectorAll('.redirection-button');
    if (!buttons.length) return; // In case none are found

    let currentIndex = 0;
    // Focus the first button
    buttons[currentIndex].focus();

    // Listen for arrow keys to move focus & Enter to click
    document.addEventListener('keydown', (event) => {
        // Move selection down
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % buttons.length;
            buttons[currentIndex].focus();
        }
        // Move selection up
        else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            buttons[currentIndex].focus();
        }
        // Press the "focused" button
        else if (event.key === 'Enter') {
            event.preventDefault();
            buttons[currentIndex].click();
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    // Set a random headline
    document.getElementById("gameOverTitle").textContent =
        getRandomGameOverMessage();

    // Play SFX
    playGameOverSoundEffect();
    
    // Setup Navigation
    setupNavigation();
});
