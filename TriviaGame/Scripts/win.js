// win.js

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
    window.location.href = './index.html';
}

/**
 * Play Again: reset data and go back to the game page.
 */
function playAgain() {
    localStorage.clear();
    window.location.href = './game.html';
}