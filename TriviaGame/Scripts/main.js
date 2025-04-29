// main.js

// Get the file paths of our questions and answers and create a constant floor for random
const questionURL = './Data/questions.json';
const answerURL = './Data/answers.json';
const randomNumberMin = 0;

// We'll store references to the buttons, correct answer, timer, correctness, and questionID
let buttons = [];
let correctAnswer = '';
let correct = '';
let questionId = 0;
let secondsLeft = 30;
let timerInterval = null;


/**
 * Reads in the questions and answers from their respective files and assigns the answers to buttons on the game HMTL page.
 */
async function loadQuestionAndAnswers() {
    try {
        // 1. Fetch question JSON
        const qResponse = await fetch(questionURL);
        const qData = await qResponse.json();

        // 2. Fetch answer JSON
        const aResponse = await fetch(answerURL);
        const aData = await aResponse.json();

        var numberOfQuestions = 0;

        var isFirstQuestion = (localStorage.getItem('firstQuestion') === 'true');
        // Done to prevent weird issues with stringify and parse when aQ is empty (which also prevented elimination of answered questions)
        if (isFirstQuestion) {
            // This function is only called here because the random category would generate different categories between questions if called more than once
            matchSelectedCategory(qData.question, aData.answer);

            // Gets the max number of questions after getting only the questions with the correct category
            questionsHolder = JSON.parse(localStorage.getItem('matchingQuestions'));
            numberOfQuestions = questionsHolder.length;
            localStorage.setItem('numberOfQuestions', numberOfQuestions);

            // No floor since the floor was equal to 0, leaving comment in case it comes up at a later date that we do need a floor here
            questionId = Math.floor(Math.random() * (numberOfQuestions));
            var answeredQuestions = [questionId];
            localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));

            isFirstQuestion = false;
            localStorage.setItem('firstQuestion', isFirstQuestion);

            console.log(answeredQuestions);
        } else {
            numberOfQuestions = localStorage.getItem('numberOfQuestions');
            questionId = getRandomQuestion(randomNumberMin, numberOfQuestions);
        }

        const questions = JSON.parse(localStorage.getItem('matchingQuestions'));

        const questionText = questions[questionId].questionText;
        const questionImageAddress = questions[questionId].questionImageAddress;
        const questionDescription = questions[questionId].questionDescription;
        const questionTimer = questions[questionId].questionTimer;

        // Set the timer
        secondsLeft = questionTimer;

        // Store the questionText now so results.js can access it
        localStorage.setItem('answeredQuestionText', questionText);

        // Put it in the <h1 id="questionText">
        document.getElementById('questionText').textContent = questionText;
        document.getElementById('questionImage').src = questionImageAddress;
        document.getElementById('questionImage').alt = questionDescription;

        const answer = JSON.parse(localStorage.getItem('matchingAnswers'));
        const answerObj = answer[questionId];

        correctAnswer = answerObj.correct;
        localStorage.setItem('correctAnswerCheck', correctAnswer);
        const answers = answerObj.answers;

        // 3. For each button, set the inner text to one of the answers
        for (let i = 0; i < answers.length; i++) {
            const btn = document.getElementById(`answer${i}`);
            if (btn) {
                btn.textContent = answers[i];
            }
        }

        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);


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
 * Filters the questions to the selected category, moved to a function for the sake of 
 * reading values in with localStorage and to allow for All Categories and Random Category.
 * 
 * Additionally, since we have 2 different arrays that we need to return, we store both arrays
 * into localStorage and retrieve them when their information is needed instead of returning
 * one array and retrieving the other.
 * 
 * @param {any} questions - List of all questions in json file to filter through
 * @param {any} answers - List of all answers in json file to match with questions
 * @returns - Nothing, just ends the function early if all categories are selected
 */
function matchSelectedCategory(questions, answers) {
    var categories = JSON.parse(localStorage.getItem('categories'));
    var matchingCategoryQuestions = [];
    var matchingCategoryAnswers = [];
    var selectedCategory = localStorage.getItem('selectedCategory');

    if (selectedCategory === "All Categories") {
        localStorage.setItem('matchingAnswers', JSON.stringify(answers));
        localStorage.setItem('matchingQuestions', JSON.stringify(questions));
        return;
    }

    if (selectedCategory === "Random Category") {
        const categoryIndex = Math.floor(Math.random() * (categories.length - randomNumberMin)) + randomNumberMin;
        selectedCategory = categories[categoryIndex];
    }

    for (let i = 0; i < questions.length; i++) {
        if (selectedCategory === questions[i].category) {
            matchingCategoryQuestions.push(questions[i]);
            matchingCategoryAnswers.push(answers[i]);
        }
    }

    localStorage.setItem('matchingAnswers', JSON.stringify(matchingCategoryAnswers));
    localStorage.setItem('matchingQuestions', JSON.stringify(matchingCategoryQuestions));
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

    if (answerText === correctAnswer) {
        correct = "Correct!";
        gameScore += 50;
    }
    else if (answerText === "No answer selected.") {
        correct = "You ran out of time!";
    }
    else {
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
    secondsLeft = 0;
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
    playGameMusic(isPaused, false);
    document.getElementById('pauseMenu').classList.remove('hidden');
    timerDisplay.classList.add('blinking');
    timerDisplay.style.color = "blue";
}

/*** 
 * Hides the pause overlay and re‑enables input.
 * @returns {void}
 */
function resumeGame() {
    isPaused = false;
    playGameMusic(isPaused, false);
    document.getElementById('pauseMenu').classList.add('hidden');
    timerDisplay.classList.remove('blinking');
    timerDisplay.style.color = "black";
    // put focus back on first answer for keyboard users
    if (buttons.length) buttons[0].focus();
}

/*** 
 * Clears score/lives and starts from first question.
 * @returns {void}
 */
function restartGame() {
    localStorage.clear();                // wipe everything
    saveGameViewSize();
    window.location.href = './categories.html';
}

/*** 
 * Leaves the game and returns to home page.
 * @returns {void}
 */
function quitGame() {
    localStorage.clear();
    saveGameViewSize();
    window.location.href = './index.html';
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
    buttons2 = document.querySelectorAll('.pause-button');
    if (!buttons.length) return;

    let currentIndex = 0;
    buttons[currentIndex].focus();

    document.addEventListener('keydown', (event) => {

        if (event.key === 'ArrowRight' && isPaused == true) {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % buttons2.length;
            buttons2[currentIndex].focus();
        } else if (event.key === 'ArrowLeft' && isPaused == true) {
            event.preventDefault();
            currentIndex = (currentIndex - 1 + buttons2.length) % buttons2.length;
            buttons2[currentIndex].focus();
        }

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

// Heres the modifiers for the timer, seconds is how long the timer is while timerDisplay is how the timer is displayed
const timerDisplay = document.getElementById("timer");

/**
 * Updates the timer every second.
 * 
 * @returns - If the game is paused, don't update timer
 */
function updateTimer() {
    if (isPaused) { return }

    const minutes = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    timerDisplay.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;

    if (secondsLeft <= 0) {
        clearInterval(timer); // Stop the countdown

        checkAnswer("No answer selected.");

        window.location.href = "results.html";

    } else {
        secondsLeft--;
    }
}

/**
 * Used to play the intense action music when a player is trying to answer a question
 * 
 * Intense Dark Action Orchestra by DeVern -- https://freesound.org/s/475592/ -- License: Attribution 3.0
 * 
 * @param {any} resultAudio - Audio for user feedback
 */
let gameAudio;
function playGameMusic(isGamePaused, isFirstLoad) {
    // Only create the audio element once
    if (isFirstLoad) {
        gameAudio = new Audio("https://cdn.freesound.org/previews/475/475592_2866779-lq.mp3");
        gameAudio.type = "audio/mpeg";
    }

    if (isGamePaused) {
        gameAudio.pause();
    }
    else {
        gameAudio.play();
    }

    gameAudio.play().catch(e => {
        console.error("Playback failed:", e);
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

    // Then play the music
    playGameMusic(false, true);
});