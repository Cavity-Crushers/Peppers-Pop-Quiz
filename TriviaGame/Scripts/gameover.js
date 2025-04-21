// gameover.js
"use strict";

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
    window.location.href = "./index.html";
}

/***
 * Clears storage and starts a fresh game.
 * @returns {void}
 */
function playAgain() {
    localStorage.clear();
    window.location.href = "./game.html";
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

/*────────────────────────────────────────────
  INITIALIZATION
────────────────────────────────────────────*/

window.addEventListener("DOMContentLoaded", () => {
    // Set a random headline
    document.getElementById("gameOverTitle").textContent =
        getRandomGameOverMessage();

    // Play SFX
    playGameOverSoundEffect();
});
