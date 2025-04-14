// gameover.js

/**
 * Quits the game: send user back to home page (index.html).
 */
function goToHome() {
    window.location.href = './index.html';
}

/**
 * Play Again: reset data and go back to the game page.
 */
function playAgain() {
    //Clear everything
    localStorage.clear();

    window.location.href = './game.html';
}

/**
 * Used to play the game over sound effect when a user looses the game
 * 
 * @param {any} gameOverAudio - Audio for user feedback
 */

let gameOverAudio;

function playGameOverSoundEffect() {
    // Only create the audio element once

    if (!gameOverAudio) {
        gameOverAudio = new Audio("https://cdn.freesound.org/previews/173/173859_1074082-lq.mp3");
        gameOverAudio.type = "audio/mpeg";
    }

    gameOverAudio.play().catch(e => {
        console.error("Playback failed:", e);
    });
}

//This waits for the content to fully load before the sound effect is played
window.addEventListener("DOMContentLoaded", () => {
    playGameOverSoundEffect();
});