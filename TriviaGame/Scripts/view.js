/**
 * Used to toggle the game view's width between 400px and 800px.
 * When the width is equal to 800px, it will set it to 400px.
 * When the width is not equal to 800px, it will set it to 800px.
 * 
 * @function toggleView
 * 
 * @returns {void} This function does not return any values.
 */
function toggleView()
{
    const zone = document.getElementById("GameZone");

    if (zone.style.width === "800px") {
        zone.style.width = "400px";
    }
    else {
        zone.style.width = "800px";
    }

    saveGameViewSize();
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
function saveGameViewSize()
{
    const gameZone = document.getElementById('GameZone');
    const width = gameZone.offsetWidth;
    const height = gameZone.offsetHeight;

    localStorage.setItem('gameZoneWidth', width);
    localStorage.setItem('gameZoneHeight', height);
}

/** 
 * Used to restore the size of the game between changes in windows.
 * 
 * @function restoreGameViewSize
 * 
 * @variable {HTMLElement} gameZone - The element with id "GameZone" whose size is being saved.
 * @variable {number} width - The current width of the "GameZone" element in pixels.
 * @variable {number} height - The current height of the "GameZone" element in pixels.
 * 
 * @returns {void} This function does not return a value
 */
function restoreGameViewSize()
{
    const gameZone = document.getElementById('GameZone');
    const savedWidth = localStorage.getItem('gameZoneWidth');
    const savedHeight = localStorage.getItem('gameZoneHeight');

    if (savedWidth && savedHeight) {
        gameZone.style.width = savedWidth + 'px';
        gameZone.style.height = savedHeight + 'px';
    }
}

// restores the size of the game view right after loading a new window.
window.onload = restoreGameViewSize;
