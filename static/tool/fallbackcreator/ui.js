// .\static\tool\fallbackcreator\ui.js

console.log('Fallback Creator UI loaded');

// --------------------------
// 1. Adjust Overlay Size to Match Image
// --------------------------
function adjustOverlaySize() {
    const img = document.getElementById('fallback-image');
    const overlay = document.getElementById('fallback-overlay');
    if (img && overlay) {
        const imgWidth = img.clientWidth;
        const imgHeight = img.clientHeight;
        overlay.style.width = imgWidth + 'px';
        overlay.style.height = imgHeight + 'px';
        overlay.style.top = img.offsetTop + 'px';
        overlay.style.left = img.offsetLeft + 'px';
    }
}

// Handle image load
const imgElement = document.getElementById('fallback-image');
if (imgElement.complete) {
    // If image is already loaded (from cache)
    adjustOverlaySize();
} else {
    imgElement.addEventListener('load', adjustOverlaySize);
}

// Window resize event
window.addEventListener('resize', adjustOverlaySize);

// ResizeObserver for dynamic image resizing
if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
        adjustOverlaySize();
    });
    resizeObserver.observe(imgElement);
} else {
    console.warn('ResizeObserver is not supported by this browser.');
}

// --------------------------
// 2. Control Sliders for Both Phases
// --------------------------

// Utility function to initialize and bind slider events
function setupSlider(sliderId, valueId, cssVariable) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);
    
    if (!slider || !valueDisplay) {
        console.warn(`Slider or value display not found for ID: ${sliderId}`);
        return;
    }

    function updatePosition() {
        const offset = slider.value;
        valueDisplay.textContent = offset + '%';
        document.documentElement.style.setProperty(cssVariable, offset + '%');
    }
    
    // Initialize slider value
    updatePosition();
    
    // Listen for slider changes
    slider.addEventListener('input', updatePosition);
}

// Initial Phase Sliders
setupSlider('heading-position-slider', 'heading-position-value', '--fallback-heading-top');
setupSlider('description-position-slider', 'description-position-value', '--fallback-description-top');
setupSlider('prize-position-slider', 'prize-position-value', '--fallback-prize-top');
setupSlider('accept-button-vertical-slider', 'accept-button-vertical-value', '--fallback-button-accept-top');
setupSlider('play-now-button-vertical-slider', 'play-now-button-vertical-value', '--fallback-button-play-now-top');
setupSlider('play-later-button-vertical-slider', 'play-later-button-vertical-value', '--fallback-button-play-later-top');

// Post-Accept Phase Sliders
setupSlider('post-accept-heading-position-slider', 'post-accept-heading-position-value', '--post-accept-fallback-heading-top');
setupSlider('post-accept-description-position-slider', 'post-accept-description-position-value', '--post-accept-fallback-description-top');
setupSlider('post-accept-prize-position-slider', 'post-accept-prize-position-value', '--post-accept-fallback-prize-top');
setupSlider('post-accept-accept-button-vertical-slider', 'post-accept-accept-button-vertical-value', '--post-accept-fallback-button-accept-top');
setupSlider('post-accept-play-now-button-vertical-slider', 'post-accept-play-now-button-vertical-value', '--post-accept-fallback-button-play-now-top');
setupSlider('post-accept-play-later-button-vertical-slider', 'post-accept-play-later-button-vertical-value', '--post-accept-fallback-button-play-later-top');

// --------------------------
// 3. Phase Toggle Functionality
// --------------------------
const phaseToggle = document.getElementById('phase-toggle');
const fallbackDiv = document.getElementById('fallback-div');
const toolPanelOptions = document.querySelector('.tool-panel-options');

// Function to toggle phase
function togglePhase() {
    if (phaseToggle.checked) {
        // Activate Post-Accept Phase
        fallbackDiv.classList.add('post-accept');
        toolPanelOptions.classList.add('post-accept');
    } else {
        // Activate Initial Phase
        fallbackDiv.classList.remove('post-accept');
        toolPanelOptions.classList.remove('post-accept');
    }
}

// Initialize phase based on toggle state
togglePhase();

// Listen for toggle changes
phaseToggle.addEventListener('change', togglePhase);

// --------------------------
// 4. Button Event Listeners
// --------------------------
document.getElementById('fallback-button-accept').addEventListener('click', function () {
    console.log('Accept button clicked');
    // Add your logic here
});

document.getElementById('fallback-button-play-now').addEventListener('click', function () {
    console.log('Play Now button clicked');
    // Add your logic here
});

document.getElementById('fallback-button-play-later').addEventListener('click', function () {
    console.log('Play Later button clicked');
    // Add your logic here
});

// --------------------------
// 5. Randomize and Set Max Chars Functionality
// --------------------------

// Helper function to generate lorem ipsum text up to maxChars
function generateLoremIpsum(maxChars) {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
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

// Function to randomize text
function randomizeText() {
    // Generate random lengths
    const headingMax = 20;
    const descriptionMax = 250;
    const prizeMax = 250;

    const headingLength = Math.floor(Math.random() * headingMax) + 1; // 1 to 20
    const descriptionLength = Math.floor(Math.random() * descriptionMax) + 1; // 1 to 250
    const prizeLength = Math.floor(Math.random() * prizeMax) + 1; // 1 to 250

    // Generate random text
    const headingText = generateLoremIpsum(headingLength);
    const descriptionText = generateLoremIpsum(descriptionLength);
    const prizeText = generateLoremIpsum(prizeLength);

    // Set the text content
    document.querySelector('.fallback-heading').textContent = headingText;
    document.querySelector('.fallback-description').textContent = descriptionText;
    document.querySelector('.fallback-prize').textContent = prizeText;
}

// Function to set text to maximum characters
function setMaxChars() {
    // Maximum character limits
    const headingMax = 20;
    const descriptionMax = 250;
    const prizeMax = 250;

    // Generate text with maximum characters
    const headingText = generateLoremIpsum(headingMax);
    const descriptionText = generateLoremIpsum(descriptionMax);
    const prizeText = generateLoremIpsum(prizeMax);

    // Set the text content
    document.querySelector('.fallback-heading').textContent = headingText;
    document.querySelector('.fallback-description').textContent = descriptionText;
    document.querySelector('.fallback-prize').textContent = prizeText;
}

// Event listeners for buttons
document.getElementById('randomize-text-button').addEventListener('click', randomizeText);
document.getElementById('set-max-chars-button').addEventListener('click', setMaxChars);
