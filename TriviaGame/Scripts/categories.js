// categories.js
const questionURL = './Data/questions.json';

async function loadCategories() {
    try {
        

        // 1. Fetch question JSON
        const qResponse = await fetch(questionURL);
        const qData = await qResponse.json();

        // These 2 lines and the for-loop are based on: https://stackoverflow.com/questions/9895082/javascript-populate-drop-down-list-with-array
        var select = document.getElementById("selectCategory");
        var categories = [];

        for (var i = 0; i < qData.question.length; i++) {
            var category = qData.question[i].category;
            if (!categories.includes(category)) {
                categories.push(category);
                var cat = document.createElement("option");
                cat.textContent = category;
                cat.value = category;
                select.appendChild(cat);
            }
        }
        var allCats = document.createElement("option");
        allCats.textContent = "All Categories";
        allCats.value = "All Categories";
        select.appendChild(allCats);

        var randomCat = document.createElement("option");
        randomCat.textContent = "Random Category";
        randomCat.value = "Random Category";
        select.appendChild(randomCat);

        localStorage.setItem('categories', JSON.stringify(categories));
    } catch (err) {
        console.error('Error loading questions:', err);
    }
}

/**
 * Takes the player back to the game page
 */
async function goToGame() {
    var selectedCategory = document.getElementById("selectCategory");

    if (selectedCategory.options[selectedCategory.selectedIndex].text === "Choose a category") {
        document.getElementById('selectionWarn').hidden = false;
    } else {
        localStorage.setItem('selectedCategory', selectedCategory.options[selectedCategory.selectedIndex].text);
        window.location.href = './game.html';
    }
}

/**
 * Takes the player back to the home page and clears their progress from that run
 */
async function goToHome() {
    window.location.href = './index.html';
    localStorage.clear();
}

/**
 * Allows for players to select answers with the arrow keys by moving right and left and
 * pressing the "ENTER" key to select an answer
 * 
 * @returns In case no buttons are found it immediately returns
 */
function setupNavigation() {
    const buttons = document.querySelectorAll('.redirection-button');
    const dropdown = document.getElementById('selectCategory');
    const elements = [dropdown, ...buttons]; 
    let currentIndex = 0;
    let inDropdownNavigation = false;

    elements[currentIndex].focus();

    document.addEventListener('keydown', (event) => {
        const focusedElement = elements[currentIndex];

        if (inDropdownNavigation && focusedElement.tagName === 'SELECT') {
            event.preventDefault();
            const selectedIndex = focusedElement.selectedIndex;
            if (event.key === 'ArrowDown') {
                focusedElement.selectedIndex = (selectedIndex + 1) % focusedElement.options.length;
            } else if (event.key === 'ArrowUp') {
                focusedElement.selectedIndex = (selectedIndex - 1 + focusedElement.options.length) % focusedElement.options.length;
            } else if (event.key === 'Enter' || event.key === 'Escape') {
                inDropdownNavigation = false;
                focusedElement.blur(); 
            }
            return;
        }

        // handles the selection of categories
        switch (event.key) {
            case 'ArrowRight':
                event.preventDefault();
                currentIndex = (currentIndex + 1) % elements.length;
                elements[currentIndex].focus();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                currentIndex = (currentIndex - 1 + elements.length) % elements.length;
                elements[currentIndex].focus();
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (focusedElement.tagName === 'SELECT') {
                    inDropdownNavigation = true;
                } else {
                    focusedElement.click();
                }
                break;
        }
    });
}



/**
 * Calls all of the functions that do not run on answer selection to initialize all variables
 */
window.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    setupNavigation();
});