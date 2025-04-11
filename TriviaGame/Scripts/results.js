// Sets <h2 id="selectedAnswer"> to the answer selected on the game page
document.getElementById('selectedAnswer').textContent = chosenAnswer;

// Sets <h1 id="correct"> to "Correct!" or "Wrong!" based on correctness of answer selected
document.getElementById('correct').textContent = correct;