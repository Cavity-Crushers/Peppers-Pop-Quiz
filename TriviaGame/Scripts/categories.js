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
 * Calls all of the functions that do not run on answer selection to initialize all variables
 */
window.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});