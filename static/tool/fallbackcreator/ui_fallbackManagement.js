/* ============================================================
   FALLBACK BUTTON LISTENERS
   ============================================================ */

function setupFallbackButtonListeners() {
    acceptButton.addEventListener('click', () => {
        console.log('Accept button clicked');
        // Trigger the post-accept phase
        phaseToggle.checked = true;
        togglePhase();
    });

    playNowButton.addEventListener('click', () => {
        console.log('Play Now button clicked');
        // Add your Play Now button logic here
    });

    playLaterButton.addEventListener('click', () => {
        console.log('Play Later button clicked');
        // Add your Play Later button logic here
    });

    continueButton.addEventListener('click', () => {
        console.log('Continue button clicked');
        // Add your Continue button logic here
    });

}

/* ============================================================
   TEXT EFFECT BUTTON LISTENERS
   ============================================================ */

// Event Listeners for Action Buttons
document.getElementById('randomize-text-button').addEventListener('click', randomizeText);
document.getElementById('set-max-chars-button').addEventListener('click', setMaxChars);

/* ============================================================
   TEXT CONTROL FUNCTIONS
   ============================================================ */

/**
 * Generates lorem ipsum text up to a specified maximum number of characters.
 * Ensures that words are not cut off in the middle.
 * @param {number} maxChars - The maximum number of characters.
 * @returns {string} - The generated lorem ipsum text.
 */
function generateLoremIpsum(maxChars) {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    if (lorem.length <= maxChars) {
        return lorem;
    }
    // Ensure we don't cut off in the middle of a word
    let truncated = lorem.substring(0, maxChars);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) {
        truncated = truncated.substring(0, lastSpace);
    }
    return truncated;
}

/**
 * Randomizes the fallback text elements with random lorem ipsum text in Post-Accept Phase.
 * Only randomizes for the "prize" text since heading and description are typically user-defined.
 */
function randomizeText() {
    const isPostAccept = fallbackDiv.classList.contains('post-accept');

    if (!isPostAccept) {
        console.log('Randomize Text: Pre-Accept Phase - No Prize Text to Randomize.');
        return;
    }

    // Define maximum length for prize text
    const prizeMax = 250;

    // Generate random length for prize text
    const prizeLength = Math.floor(Math.random() * prizeMax) + 1; // 1 to 250

    // Generate random prize text
    const prizeText = generateLoremIpsum(prizeLength);

    // Set the prize text content
    prizeTextElement.textContent = prizeText;
}

/**
 * Sets the fallback text elements to their maximum character limits.
 * Only sets the prize text in Post-Accept Phase.
 */
function setMaxChars() {
    const isPostAccept = fallbackDiv.classList.contains('post-accept');

    if (!isPostAccept) {
        console.log('Set Max Chars: Pre-Accept Phase - No Prize Text to Set.');
        return;
    }

    // Define maximum character limit for prize text
    const prizeMax = 250;

    // Generate prize text with maximum characters
    const prizeText = generateLoremIpsum(prizeMax);

    // Set the prize text content
    prizeTextElement.textContent = prizeText;
}

/**
 * Updates the prize text based on the current phase.
 */
function updatePrizeText() {
    const isPostAccept = fallbackDiv.classList.contains('post-accept');
    if (isPostAccept) {
        prizeTextElement.textContent = "Exclusive rewards await: Join now!";
    } else {
        prizeTextElement.textContent = "";
    }
}
