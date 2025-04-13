// main.js

/********************************************
 * 1) FETCH & DISPLAY THE QUESTION/ANSWERS  *
 ********************************************/
// Paths to your JSON files (adjust if needed)
const questionURL = './Data/questions.json';
const answerURL = './Data/answers.json';
const questionId = 0;
//var correct = '';
//var gameScore = 0;

// We'll store references to the buttons, correct answer
let buttons = [];
let correctAnswer = '';
let correct = '';
let gameScore = 0;

// This function fetches JSON data, updates the DOM with question/answers
async function loadQuestionAndAnswers() {
    try {
        // 1. Fetch question JSON
        const qResponse = await fetch(questionURL);
        const qData = await qResponse.json();
        const questionText = qData.question[questionId].questionText;

        // Put it in the <h1 id="questionText">
        document.getElementById('questionText').textContent = questionText;

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
 * Used to store the answer selected and check its correctness.
 * 
 * @param {any} answerText - Text for the answer choice associated to the button clicked
 */
async function checkAnswer(answerText) {
    localStorage.setItem('selectedAnswer', answerText);
    
    if (answerText === correctAnswer)
    {
        correct = "Correct!";
        gameScore += 50;
        localStorage.setItem('score', gameScore);
    }
    else
    {
        correct = "Wrong!"
        localStorage.setItem('score', gameScore);
    }

    localStorage.setItem('correct', correct);
    
}


/********************************************
 * 2) ARROW-KEY NAVIGATION (YOUR CURRENT CODE)
 ********************************************/
// We'll call this after the DOM is fully loaded
function setupNavigation() {
    // Grab all the answer buttons
    buttons = document.querySelectorAll('.answer-button');
    if (!buttons.length) return; // In case none are found

    let currentIndex = 0;
    // Focus the first button
    buttons[currentIndex].focus();

    // Listen for arrow keys to move focus & Enter to click
    document.addEventListener('keydown', (event) => {
        // Move selection down
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % buttons.length;
            buttons[currentIndex].focus();
        }
        // Move selection up
        else if (event.key === 'ArrowUp') {
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


/********************************************
 * 3) INIT EVERYTHING WHEN PAGE LOADS
 ********************************************/
window.addEventListener('DOMContentLoaded', () => {
    // First, set up arrow key navigation
    setupNavigation();

    // Then load the question & answers data
    loadQuestionAndAnswers();
});
