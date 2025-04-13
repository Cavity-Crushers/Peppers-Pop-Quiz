// results.js

// Gets these 3 values that were stored in main.js
var selectedAnswer = localStorage.getItem('selectedAnswer');
var correctness = localStorage.getItem('correct');
var score = localStorage.getItem('score');

// Sets <h2 id="selectedAnswer"> to the answer selected on the game page
document.getElementById('selectedAnswer').textContent = selectedAnswer;

// Sets <h1 id="correct"> to "Correct!" or "Wrong!" based on correctness of answer selected
document.getElementById('correct').textContent = correctness;

// Sets <h1 id="score"> to the score
document.getElementById('score').textContent = score;

/**
 * Takes the player back to the game page
 */
async function goToGame()
{
    window.location.href = './game.html';
}

/**
 * Takes the player back to the home page
 */
async function goToHome()
{
    window.location.href = './index.html';
}