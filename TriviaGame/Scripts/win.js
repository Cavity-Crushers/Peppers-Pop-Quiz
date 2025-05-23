﻿// win.js

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

const score = localStorage.getItem('score');
const lives = localStorage.getItem('lives');
const answeredQuestionText = localStorage.getItem('answeredQuestionText');
const numOfQuestions = parseInt(localStorage.getItem('numberOfQuestions'), 10);
const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions'));
const numOfAnsweredQuestions = answeredQuestions.length;
const maxScore = numOfQuestions * 50;
const correctAnswers = score / 50;

// Show remaining
document.getElementById('lives').textContent = `Remaining Lives: ${lives}`;

// Sets <h1 id="score"> to the score
document.getElementById('score').textContent = `Score: ${score}/${maxScore}`;

document.getElementById('correctAnswers').textContent = `${correctAnswers}/${numOfQuestions} questions answered correctly`;

/**
 * Quits the game: send user back to home page (index.html) and clears the local storage
 */
function goToHome() {
    localStorage.clear();
    saveGameViewSize();
    window.location.href = '/index.html';
}

/**
 * Play Again: reset data and go back to the game page.
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

/**
 * Allows for players to select answers with the arrow keys by moving up and down and
 * pressing the "ENTER" key to select an answer to allow for more controls when playing
 * on a laptop
 * 
 * @returns In case no buttons are found it immediately returns
 */
function setupNavigation() {
    // Grab all the answer buttons
    buttons = document.querySelectorAll('.redirection-button');
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
            "https://cdn.freesound.org/previews/270/270528_5123851-lq.mp3"
        );
        gameOverAudio.type = "audio/mpeg";
    }
    gameOverAudio.play().catch((e) => console.error("Playback failed:", e));
}


/**
 * Calls all of the functions that do not run on answer selection to initialize all variables
 */
window.addEventListener('DOMContentLoaded', () => {

    // Play SFX
    playGameOverSoundEffect();

    // Setup Navigation
    setupNavigation();
});
