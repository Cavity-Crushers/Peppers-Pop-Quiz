const buttons = document.querySelectorAll('.answer-button');

let currentIndex = 0;

buttons[currentIndex].focus();

// Below is the code for listening for keys to perform certain actions (e.g. change current button selection index or clicking a button)
document.addEventListener('keydown', (event) => {
    // Move selected answer button down one
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        currentIndex = (currentIndex + 1) % buttons.length;
        buttons[currentIndex].focus();
    }
    // Move selected answer button up one
    else if (event.key === 'ArrowUp') {
        event.preventDefault();
        currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        buttons[currentIndex].focus();
    }
    // Click the selected answer button
    else if (event.key === 'Enter') {
        event.preventDefault();
        buttons[currentIndex].click();
    }
});