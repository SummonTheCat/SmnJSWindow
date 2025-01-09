// .\static\tool\fallbackcreator\ui.js

console.log('Fallback Creator UI loaded');

/* ============================================================
   1. Adjust Overlay Size to Match Image
   ============================================================ */
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

/* ============================================================
   2. Control Sliders for Both Phases
   ============================================================ */

/**
 * Initializes and binds slider events to update CSS variables.
 * @param {string} sliderId - The ID of the slider input element.
 * @param {string} valueId - The ID of the span element displaying the slider value.
 * @param {string} cssVariable - The CSS variable to update.
 */
function setupSlider(sliderId, valueId, cssVariable) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);
    
    if (!slider || !valueDisplay) {
        console.warn(`Slider or value display not found for ID: ${sliderId}`);
        return;
    }

    function updatePosition() {
        const offset = slider.value;
        valueDisplay.textContent = `${offset}%`;
        document.documentElement.style.setProperty(cssVariable, `${offset}%`);
    }
    
    // Initialize slider value
    updatePosition();
    
    // Listen for slider changes
    slider.addEventListener('input', updatePosition);
}

// Initialize Sliders
const sliders = [
    // Initial Phase Sliders
    { sliderId: 'heading-position-slider', valueId: 'heading-position-value', cssVariable: '--fallback-heading-top' },
    { sliderId: 'description-position-slider', valueId: 'description-position-value', cssVariable: '--fallback-description-top' },
    // Removed: prize in pre-accept
    { sliderId: 'accept-button-vertical-slider', valueId: 'accept-button-vertical-value', cssVariable: '--fallback-button-accept-top' },

    // Post-Accept Phase Sliders
    { sliderId: 'post-accept-heading-position-slider', valueId: 'post-accept-heading-position-value', cssVariable: '--post-accept-fallback-heading-top' },
    { sliderId: 'post-accept-description-position-slider', valueId: 'post-accept-description-position-value', cssVariable: '--post-accept-fallback-description-top' },
    { sliderId: 'post-accept-prize-position-slider', valueId: 'post-accept-prize-position-value', cssVariable: '--post-accept-fallback-prize-top' },
    { sliderId: 'post-accept-play-now-button-vertical-slider', valueId: 'post-accept-play-now-button-vertical-value', cssVariable: '--post-accept-fallback-button-play-now-top' },
    { sliderId: 'post-accept-play-later-button-vertical-slider', valueId: 'post-accept-play-later-button-vertical-value', cssVariable: '--post-accept-fallback-button-play-later-top' },
    { sliderId: 'post-accept-continue-button-vertical-slider', valueId: 'post-accept-continue-button-vertical-value', cssVariable: '--post-accept-fallback-button-continue-top' }
];

sliders.forEach(({ sliderId, valueId, cssVariable }) => {
    setupSlider(sliderId, valueId, cssVariable);
});

/* ============================================================
   3. Phase and Use Continue Toggle Functionality
   ============================================================ */
const phaseToggle = document.getElementById('phase-toggle');
const useContinueToggle = document.getElementById('use-continue-toggle');
const fallbackDiv = document.getElementById('fallback-div');
const toolPanelOptions = document.querySelector('.tool-panel-options');

const fallbackButtons = document.getElementById('fallback-buttons');
const acceptButton = document.getElementById('fallback-button-accept');
const playNowButton = document.getElementById('fallback-button-play-now');
const playLaterButton = document.getElementById('fallback-button-play-later');
const continueButton = document.getElementById('fallback-button-continue');

/* ============================================================
   4. Prize Text Management
   ============================================================ */
const prizeTextElement = document.getElementById('fallback-prize');

/**
 * Toggles between Pre-Accept and Post-Accept phases.
 */
function togglePhase() {
    const isPostAccept = phaseToggle.checked;

    // Remove both classes first to reset
    fallbackDiv.classList.remove('pre-accept');
    fallbackDiv.classList.remove('post-accept');

    if (isPostAccept) {
        fallbackDiv.classList.add('post-accept');
        toolPanelOptions.classList.add('post-accept');
    } else {
        fallbackDiv.classList.add('pre-accept');
        toolPanelOptions.classList.remove('post-accept');
    }
    updateButtonVisibility();
    updateImageSource();
}

/**
 * Updates the visibility of buttons based on the current phase and useContinue toggle.
 */
function updateButtonVisibility() {
    const isPostAccept = fallbackDiv.classList.contains('post-accept');
    const useContinue = useContinueToggle.checked;

    if (useContinue && isPostAccept) {
        // Show Continue button only in Post-Accept Phase
        continueButton.style.display = 'block';
        // Hide Play Now and Play Later buttons
        playNowButton.style.display = 'none';
        playLaterButton.style.display = 'none';
        // Hide Accept button in Post-Accept phase
        acceptButton.style.display = 'none';
    } else {
        // Hide Continue button
        continueButton.style.display = 'none';

        if (isPostAccept) {
            // Hide Accept button in Post-Accept phase
            acceptButton.style.display = 'none';
            // Show Play Now and Play Later buttons
            playNowButton.style.display = 'block';
            playLaterButton.style.display = 'block';
        } else {
            // Show Accept button in Pre-Accept phase
            acceptButton.style.display = 'block';
            // Hide Play Now and Play Later buttons
            playNowButton.style.display = 'none';
            playLaterButton.style.display = 'none';
        }
    }
}

/**
 * Toggles the Use Continue functionality.
 */
function toggleUseContinue() {
    updateButtonVisibility();
}

/**
 * Updates the image source based on the current phase.
 */
function updateImageSource() {
    const imgElement = document.getElementById('fallback-image');
    if (!imgElement) {
        console.warn('Fallback image element not found.');
        return;
    }

    const isPostAccept = fallbackDiv.classList.contains('post-accept');
    if (isPostAccept) {
        imgElement.src = 'dev/outro.png';
        imgElement.alt = 'Outro Image';
        console.log('Switched to Post-Accept Phase Image: dev/outro.png');
    } else {
        imgElement.src = 'dev/intro.png';
        imgElement.alt = 'Intro Image';
        console.log('Switched to Pre-Accept Phase Image: dev/intro.png');
    }
}

// Initialize to pre-accept
fallbackDiv.classList.add('pre-accept');

// Event Listeners
phaseToggle.addEventListener('change', togglePhase);
useContinueToggle.addEventListener('change', toggleUseContinue);

/* ============================================================
   5. Button Event Listeners
   ============================================================ */
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

/* ============================================================
   6. Randomize and Set Max Characters Functionality
   ============================================================ */

/**
 * Generates lorem ipsum text up to a specified maximum number of characters.
 * Ensures that words are not cut off in the middle.
 * @param {number} maxChars - The maximum number of characters.
 * @returns {string} - The generated lorem ipsum text.
 */
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

// Event Listeners for Action Buttons
document.getElementById('randomize-text-button').addEventListener('click', randomizeText);
document.getElementById('set-max-chars-button').addEventListener('click', setMaxChars);

/* ============================================================
   7. Per-Text Element Styling Functionality
   ============================================================ */

/**
 * Helper to update a text shadow CSS variable based on toggle + offset + blur + color.
 */
function applyTextShadow(checked, offsetXVal, offsetYVal, blurVal, colorVal) {
    if (checked) {
        return `${offsetXVal}px ${offsetYVal}px ${blurVal}px ${colorVal}`;
    }
    return 'none';
}

/**
 * Initializes and binds color picker and shadow controls for a specific text element.
 * For PRE-ACCEPT heading/description: uses `--fallback-...`
 * For POST-ACCEPT heading/description/prize: uses `--post-accept-fallback-...`
 */
function setupTextStyling(config) {
    const {
        elementId,
        cssColorVar,
        cssShadowVar,
        cssFontWeightVar
    } = config;

    // Color Picker
    const colorPicker = document.getElementById(`${elementId}-text-color`);
    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            document.documentElement.style.setProperty(cssColorVar, color);
        });
    }

    // Drop Shadow Toggle and Controls
    const shadowToggle = document.getElementById(`${elementId}-drop-shadow-toggle`);
    const shadowOffsetX = document.getElementById(`${elementId}-shadow-offset-x`);
    const shadowOffsetY = document.getElementById(`${elementId}-shadow-offset-y`);
    const shadowBlur = document.getElementById(`${elementId}-shadow-blur`);
    const shadowColor = document.getElementById(`${elementId}-shadow-color`);

    // Bold Toggle
    const boldToggle = document.getElementById(`${elementId}-bold-toggle`);

    function updateTextStyles() {
        // Drop Shadow
        const shadowValue = applyTextShadow(
            shadowToggle && shadowToggle.checked,
            shadowOffsetX ? shadowOffsetX.value : 0,
            shadowOffsetY ? shadowOffsetY.value : 0,
            shadowBlur ? shadowBlur.value : 0,
            shadowColor ? shadowColor.value : '#000000'
        );
        document.documentElement.style.setProperty(cssShadowVar, shadowValue);

        // Bold
        if (boldToggle) {
            const fontWeight = boldToggle.checked ? 'bold' : 'normal';
            document.documentElement.style.setProperty(cssFontWeightVar, fontWeight);
        }
    }

    // Initialize if the controls exist
    if (shadowToggle) shadowToggle.addEventListener('change', updateTextStyles);
    if (shadowOffsetX) shadowOffsetX.addEventListener('input', updateTextStyles);
    if (shadowOffsetY) shadowOffsetY.addEventListener('input', updateTextStyles);
    if (shadowBlur) shadowBlur.addEventListener('input', updateTextStyles);
    if (shadowColor) shadowColor.addEventListener('input', updateTextStyles);
    if (boldToggle) boldToggle.addEventListener('change', updateTextStyles);

    // Run once at init to set default
    updateTextStyles();
}

// Configuration for each text element
// Note that for 'post-accept-heading', we point to the post-accept CSS vars etc.
const textElements = [
    // Pre-accept heading
    {
        elementId: 'heading',
        cssColorVar: '--fallback-heading-color',
        cssShadowVar: '--fallback-heading-text-shadow',
        cssFontWeightVar: '--fallback-heading-font-weight'
    },
    // Pre-accept description
    {
        elementId: 'description',
        cssColorVar: '--fallback-description-color',
        cssShadowVar: '--fallback-description-text-shadow',
        cssFontWeightVar: '--fallback-description-font-weight'
    },

    // Post-accept heading
    {
        elementId: 'post-accept-heading',
        cssColorVar: '--post-accept-fallback-heading-color',
        cssShadowVar: '--post-accept-fallback-heading-text-shadow',
        cssFontWeightVar: '--post-accept-fallback-heading-font-weight'
    },
    // Post-accept description
    {
        elementId: 'post-accept-description',
        cssColorVar: '--post-accept-fallback-description-color',
        cssShadowVar: '--post-accept-fallback-description-text-shadow',
        cssFontWeightVar: '--post-accept-fallback-description-font-weight'
    },
    // Post-accept prize
    {
        elementId: 'post-accept-prize',
        cssColorVar: '--post-accept-fallback-prize-color',
        cssShadowVar: '--post-accept-fallback-prize-text-shadow',
        cssFontWeightVar: '--post-accept-fallback-prize-font-weight'
    }
];

// Initialize text styling for each element
textElements.forEach((config) => {
    setupTextStyling(config);
});

/* ============================================================
   8. Maximize Toggle Functionality
   ============================================================ */
const previewPanel = document.querySelector('.tool-panel-preview');
const closeMaximizeButton = document.getElementById('close-maximize-button');

/**
 * Toggles the maximized state of the preview panel.
 */
function toggleMaximize() {
    const isMaximized = previewPanel.classList.contains('preview-maximized');

    if (isMaximized) {
        // Exit Maximized View
        previewPanel.classList.remove('preview-maximized');
        closeMaximizeButton.style.display = 'none';
    } else {
        // Enter Maximized View
        previewPanel.classList.add('preview-maximized');
        closeMaximizeButton.style.display = 'block';
    }

    // Adjust overlay size after transition
    setTimeout(adjustOverlaySize, 300);
}

// Event Listener for Keyboard Shortcut (Ctrl+F or Cmd+F)
document.addEventListener('keydown', (event) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? event.metaKey : event.ctrlKey;
    const key = event.key.toLowerCase();

    // Check for Ctrl+F or Cmd+F
    if (modifier && key === 'f') {
        event.preventDefault(); // Prevent the default browser Find action
        toggleMaximize();
    }
});

// Event Listener for Close Maximize Button
closeMaximizeButton.addEventListener('click', toggleMaximize);
