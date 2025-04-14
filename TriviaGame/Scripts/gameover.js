// gameover.js

/**
 * Quits the game: send user back to home page (index.html) and clears the local storage
 */
function goToHome() {
    localStorage.clear();

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
