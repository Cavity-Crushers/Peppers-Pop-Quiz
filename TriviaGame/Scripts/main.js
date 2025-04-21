// main.js

// Get the file paths of our questions and answers
const questionURL = './Data/questions.json';
const answerURL = './Data/answers.json';

// We'll store references to the buttons, correct answer, correctness, and questionID
let buttons = [];
let correctAnswer = '';
let correct = '';
let questionId = 0;

/**
 * Reads in the questions and answers from their respective files and assigns the answers to buttons on the game HMTL page.
 */
async function loadQuestionAndAnswers() {
    try {
        // 1. Fetch question JSON
        const qResponse = await fetch(questionURL);
        const qData = await qResponse.json();

        // Gets the max number of questions
        const questionsNumber = qData.question.length;
        localStorage.setItem('numberOfQuestions', questionsNumber);

        var isFirstQuestion = (localStorage.getItem('firstQuestion') === 'true');
        // Done to prevent weird issues with stringify and parse when aQ is empty (which also prevented elimination of answered questions)
        if (isFirstQuestion) {
            questionId = Math.floor(Math.random() * (questionsNumber - 1)) + 1;
            var answeredQuestions = [questionId];
            localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));

            isFirstQuestion = false;
            localStorage.setItem('firstQuestion', isFirstQuestion);

            console.log(answeredQuestions);
        } else {
            questionId = getRandomQuestion(0, questionsNumber);
        }
        
        const questionText = qData.question[questionId].questionText;
        const questionImageAddress = qData.question[questionId].questionImageAddress;
        const questionDescription = qData.question[questionId].questionDescription;

        // Store the questionText now so results.js can access it
        localStorage.setItem('answeredQuestionText', questionText);

        // Put it in the <h1 id="questionText">
        document.getElementById('questionText').textContent = questionText;
        document.getElementById('questionImage').src = questionImageAddress;
        document.getElementById('questionImage').alt = questionDescription;

        // 2. Fetch answer JSON
        const aResponse = await fetch(answerURL);
        const aData = await aResponse.json();
        const answerObj = aData.answer[questionId];

        correctAnswer = answerObj.correct;
        const answers = answerObj.answers;

        // 3. For each button, set the inner text to one of the answers
        for (let i = 0; i < answers.length; i++) {
            const btn = document.getElementById(`answer${i}`);
            if (btn) {
                btn.textContent = answers[i];
            }
        }
        
    } catch (err) {
        console.error('Error loading question or answers:', err);
    }
}

/**
 * Math.random returns a floating point value by default in JS. This function was created
 * to allow for only integer values and to allow for the removal of questions from the pool
 * of possible numbers.
 * 
 * @param {any} min - The minimum value wanted
 * @param {any} max - The maximum value wanted
 * @returns - Returns a random int, inclusive of min but exclusive of max. 
 */
function getRandomQuestion(min, max) {
    var answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions'));
    console.log(answeredQuestions);

    var randomQuestionId = Math.floor(Math.random() * (max - min)) + min;

    while (answeredQuestions.includes(randomQuestionId)) {
        randomQuestionId = Math.floor(Math.random() * (max - min)) + min;
    }

    answeredQuestions.push(randomQuestionId);

    localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));

    return randomQuestionId;
}

/**
 * Initializes the integer values that change between questions at the beginning of the game.
 * Otherwise score would not have a value displayed if the player answered a question wrong to start.
 */
function initializeGameData() {
    // If we have never stored lives, set them to 3. Otherwise, keep what’s in storage
    if (!localStorage.getItem('lives')) {
        localStorage.setItem('lives', '3');
    }
    // If we have never stored consecutiveCorrect, set it to 0
    if (!localStorage.getItem('consecutiveCorrect')) {
        localStorage.setItem('consecutiveCorrect', '0');
    }
    // If we have never stored score, set it to 0
    if (!localStorage.getItem('score')) {
        localStorage.setItem('score', '0');
    }
    // If it is the first question
    if (!localStorage.getItem('firstQuestion')) {
        localStorage.setItem('firstQuestion', true);
    }
}

/**
 * Uses localStorage to store the answer selected, its correctness, and score, because otherwise
 * the value wouldn't transfer between files. Local storage stores everything as strings so you 
 * have to parse score to an int and then convert that int to a string when you store it back.
 * 
 * @param {any} answerText - Text for the answer choice associated to the button clicked
 */
async function checkAnswer(answerText) {
    var gameScore = parseInt(localStorage.getItem('score'), 10)
    localStorage.setItem('selectedAnswer', answerText);
    
    if (answerText === correctAnswer)
    {
        correct = "Correct!";
        gameScore += 50;
    }
    else
    {
        correct = "Wrong!";
    }

    localStorage.setItem('correct', correct);
    localStorage.setItem('score', gameScore.toString());
    // Now update lives & consecutive correct count
    updateLivesAndConsecutive(correctAnswer === answerText);
}



/**
 * Increments or decrements the player's lives based on how they anwer questions
 * 
 * @param {any} isCorrect - Did the player answer the question correctly
 */
function updateLivesAndConsecutive(isCorrect) {
    let lives = parseInt(localStorage.getItem('lives'), 10);
    let consecutiveCorrect = parseInt(localStorage.getItem('consecutiveCorrect'), 10);

    if (isCorrect) {
        consecutiveCorrect++;
        // If the user hits 3 in a row, earn a life (max 5) and reset consecutive count
        if (consecutiveCorrect === 3) {
            if (lives < 5) {
                lives++;
            }
            consecutiveCorrect = 0; // reset after awarding the life
        }
    } else {
        // Wrong answer => lose 1 life
        lives--;
        // reset consecutive correct
        consecutiveCorrect = 0;
    }

    // Save updated values
    localStorage.setItem('lives', lives.toString());
    localStorage.setItem('consecutiveCorrect', consecutiveCorrect.toString());
}

/**
 * Allows for players to select answers with the arrow keys by moving up and down and
 * pressing the "ENTER" key to select an answer to allow for more controls when playing
 * on a laptop
 * 
 * @returns In case no buttons are found it immediately returns
 */
function setupNavigation() {

    buttons = document.querySelectorAll('.answer-button');
    if (!buttons.length) return;

    let currentIndex = 0;
    buttons[currentIndex].focus();

    document.addEventListener('keydown', (event) => {
        // Ignore key navigation while paused
        if (isPaused) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % buttons.length;
            buttons[currentIndex].focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            buttons[currentIndex].focus();
        } else if (event.key === 'Enter') {
            event.preventDefault();
            buttons[currentIndex].click();
        }
    });
}

// --------------------  PAUSE SYSTEM  --------------------

/** Indicates whether game input is currently paused. */
let isPaused = false;

/*** 
 * Shows the pause overlay and blocks answer navigation.
 * @returns {void}
 */
function pauseGame() {
    isPaused = true;
    document.getElementById('pauseMenu').classList.remove('hidden');
}

/*** 
 * Hides the pause overlay and re‑enables input.
 * @returns {void}
 */
function resumeGame() {
    isPaused = false;
    document.getElementById('pauseMenu').classList.add('hidden');
    // put focus back on first answer for keyboard users
    if (buttons.length) buttons[0].focus();
}

/*** 
 * Clears score/lives and starts from first question.
 * @returns {void}
 */
function restartGame() {
    localStorage.clear();                // wipe everything
    window.location.href = './game.html';
}

/*** 
 * Leaves the game and returns to home page.
 * @returns {void}
 */
function quitGame() {
    localStorage.clear();
    window.location.href = './index.html';
}

// Optional keyboard shortcut: press “P” to pause / resume
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        isPaused ? resumeGame() : pauseGame();
    }
});

// --------------------  NAVIGATION (update)  --------------------
function setupNavigation() {
    buttons = document.querySelectorAll('.answer-button');
    if (!buttons.length) return;

    let currentIndex = 0;
    buttons[currentIndex].focus();

    document.addEventListener('keydown', (event) => {
        // Ignore key navigation while paused
        if (isPaused) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % buttons.length;
            buttons[currentIndex].focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            buttons[currentIndex].focus();
        } else if (event.key === 'Enter') {
            event.preventDefault();
            buttons[currentIndex].click();
        }
    });
}

/**
 * Calls all of the functions that do not run on answer selection to initialize all variables
 */
window.addEventListener('DOMContentLoaded', () => {
    // Make sure we have lives/consecutive in localStorage
    initializeGameData();

    // First, set up arrow key navigation
    setupNavigation();

    // Then load the question & answers data
    loadQuestionAndAnswers();
});