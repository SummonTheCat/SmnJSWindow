// .\static\tool\fallbackcreator\ui.js

console.log('Fallback Creator UI loaded');

/* ============================================================
   GLOBAL STATE & LOCAL STORAGE HANDLING
   ============================================================ */
const localStorageKey = 'fallbackCreatorSettings';

// We'll store user settings in this object:
let settings = {};

/**
 * Loads settings from localStorage, if any exist.
 */
function loadSettings() {
    const stored = localStorage.getItem(localStorageKey);
    if (!stored) {
        return; // No saved settings, do nothing
    }
    try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
            settings = parsed;
        }
    } catch (err) {
        console.warn('Could not parse stored settings:', err);
    }
}

/**
 * Saves the current settings object to localStorage.
 */
function saveSettings() {
    localStorage.setItem(localStorageKey, JSON.stringify(settings));
}

/**
 * Updates a specific setting key with the given value, then saves.
 */
function updateSetting(key, value) {
    settings[key] = value;
    saveSettings();
}

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
 * Initializes and binds slider events to update CSS variables and save to localStorage.
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

    function updateValue() {
        const value = slider.value;
        valueDisplay.textContent = `${value}%`;
        document.documentElement.style.setProperty(cssVariable, `${value}%`);

        // Save to localStorage
        const savedKey = `${sliderId}-value`;
        updateSetting(savedKey, value);
    }
    
    // Listen for slider changes
    slider.addEventListener('input', updateValue);

    // Return the function so we can call it during applySettings()
    return { slider, updateValue };
}

// Updated slider configurations including width sliders
const sliderConfigs = [
    // Initial Phase Position Sliders
    { sliderId: 'heading-position-slider', valueId: 'heading-position-value', cssVariable: '--fallback-heading-top' },
    { sliderId: 'description-position-slider', valueId: 'description-position-value', cssVariable: '--fallback-description-top' },
    
    // Initial Phase Width Sliders
    { sliderId: 'heading-width-slider', valueId: 'heading-width-value', cssVariable: '--fallback-heading-width' },
    { sliderId: 'description-width-slider', valueId: 'description-width-value', cssVariable: '--fallback-description-width' },

    // Accept Button Position Slider
    { sliderId: 'accept-button-vertical-slider', valueId: 'accept-button-vertical-value', cssVariable: '--fallback-button-accept-top' },

    // Post-Accept Phase Position Sliders
    { sliderId: 'post-accept-heading-position-slider', valueId: 'post-accept-heading-position-value', cssVariable: '--post-accept-fallback-heading-top' },
    { sliderId: 'post-accept-description-position-slider', valueId: 'post-accept-description-position-value', cssVariable: '--post-accept-fallback-description-top' },
    { sliderId: 'post-accept-prize-position-slider', valueId: 'post-accept-prize-position-value', cssVariable: '--post-accept-fallback-prize-top' },
    { sliderId: 'post-accept-play-now-button-vertical-slider', valueId: 'post-accept-play-now-button-vertical-value', cssVariable: '--post-accept-fallback-button-play-now-top' },
    { sliderId: 'post-accept-play-later-button-vertical-slider', valueId: 'post-accept-play-later-button-vertical-value', cssVariable: '--post-accept-fallback-button-play-later-top' },
    { sliderId: 'post-accept-continue-button-vertical-slider', valueId: 'post-accept-continue-button-vertical-value', cssVariable: '--post-accept-fallback-button-continue-top' },

    // Post-Accept Phase Width Sliders
    { sliderId: 'post-accept-heading-width-slider', valueId: 'post-accept-heading-width-value', cssVariable: '--post-accept-fallback-heading-width' },
    { sliderId: 'post-accept-description-width-slider', valueId: 'post-accept-description-width-value', cssVariable: '--post-accept-fallback-description-width' },
    { sliderId: 'post-accept-prize-width-slider', valueId: 'post-accept-prize-width-value', cssVariable: '--post-accept-fallback-prize-width' }
];

// Existing slider setups
const sliderSetups = [];

loadSettings(); // Load from localStorage

sliderConfigs.forEach(cfg => {
    const { sliderId, valueId, cssVariable } = cfg;
    const result = setupSlider(sliderId, valueId, cssVariable);
    // If setupSlider found the elements and returned references, store them
    if (result) {
        sliderSetups.push(result);
    }
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

/**
 * Toggles between Pre-Accept and Post-Accept phases, saves to localStorage.
 */
function togglePhase() {
    const isPostAccept = phaseToggle.checked;
    updateSetting('phaseToggle', isPostAccept);

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
    updatePrizeText(); // Update prize text visibility
}

/**
 * Toggles the Use Continue functionality, saves to localStorage.
 */
function toggleUseContinue() {
    const useContinue = useContinueToggle.checked;
    updateSetting('useContinue', useContinue);
    updateButtonVisibility();
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

/* ============================================================
   4. Apply Phase & Continue After Page Load
   ============================================================ */
phaseToggle.addEventListener('change', togglePhase);
useContinueToggle.addEventListener('change', toggleUseContinue);

const prizeTextElement = document.getElementById('fallback-prize');

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
function applyTextShadowValue(checked, offsetXVal, offsetYVal, blurVal, colorVal) {
    if (checked) {
        return `${offsetXVal}px ${offsetYVal}px ${blurVal}px ${colorVal}`;
    }
    return 'none';
}

/**
 * Initializes and binds color picker and shadow controls for a specific text element.
 */
function setupTextStyling(config) {
    const {
        elementId,
        cssColorVar,
        cssShadowVar,
        cssFontWeightVar,
        cssWidthVar // New: Add cssWidthVar
    } = config;

    // Color Picker
    const colorPicker = document.getElementById(`${elementId}-text-color`);
    const shadowToggle = document.getElementById(`${elementId}-drop-shadow-toggle`);
    const shadowOffsetX = document.getElementById(`${elementId}-shadow-offset-x`);
    const shadowOffsetY = document.getElementById(`${elementId}-shadow-offset-y`);
    const shadowBlur = document.getElementById(`${elementId}-shadow-blur`);
    const shadowColor = document.getElementById(`${elementId}-shadow-color`);
    const boldToggle = document.getElementById(`${elementId}-bold-toggle`);
    const widthSlider = document.getElementById(`${elementId}-width-slider`); // New: Width Slider
    const widthValue = document.getElementById(`${elementId}-width-value`); // New: Width Value Display

    // Define unique keys for local storage
    const colorKey     = `${elementId}-text-color-value`;
    const shadowKey    = `${elementId}-drop-shadow-toggle`;
    const offsetXKey   = `${elementId}-shadow-offset-x-value`;
    const offsetYKey   = `${elementId}-shadow-offset-y-value`;
    const blurKey      = `${elementId}-shadow-blur-value`;
    const shadowColKey = `${elementId}-shadow-color-value`;
    const boldKey      = `${elementId}-bold-toggle-value`;
    const widthKey     = `${elementId}-width-slider-value`; // New: Width Key

    function updateTextStyles() {
        // Gather current values
        const color = colorPicker ? colorPicker.value : '#ffffff';
        const isShadowEnabled = shadowToggle && shadowToggle.checked;
        const offX = shadowOffsetX ? parseInt(shadowOffsetX.value, 10) || 0 : 0;
        const offY = shadowOffsetY ? parseInt(shadowOffsetY.value, 10) || 0 : 0;
        const blr = shadowBlur ? parseInt(shadowBlur.value, 10) || 0 : 0;
        const shColor = shadowColor ? shadowColor.value : '#000000';
        const isBold = boldToggle && boldToggle.checked;
        const width = widthSlider ? widthSlider.value : 80; // Default width

        // Apply to CSS
        document.documentElement.style.setProperty(cssColorVar, color);
        const shadowVal = applyTextShadowValue(isShadowEnabled, offX, offY, blr, shColor);
        document.documentElement.style.setProperty(cssShadowVar, shadowVal);
        document.documentElement.style.setProperty(cssFontWeightVar, isBold ? 'bold' : 'normal');
        document.documentElement.style.setProperty(cssWidthVar, `${width}%`); // Apply width

        // Update width display
        if (widthValue) {
            widthValue.textContent = `${width}%`;
        }

        // Save to localStorage
        if (colorPicker)   updateSetting(colorKey, color);
        if (shadowToggle)  updateSetting(shadowKey, isShadowEnabled);
        if (shadowOffsetX) updateSetting(offsetXKey, offX);
        if (shadowOffsetY) updateSetting(offsetYKey, offY);
        if (shadowBlur)    updateSetting(blurKey, blr);
        if (shadowColor)   updateSetting(shadowColKey, shColor);
        if (boldToggle)    updateSetting(boldKey, isBold);
        if (widthSlider)   updateSetting(widthKey, width);
    }

    // Attach event listeners
    if (colorPicker) {
        colorPicker.addEventListener('input', updateTextStyles);
    }
    if (shadowToggle) shadowToggle.addEventListener('change', updateTextStyles);
    if (shadowOffsetX) shadowOffsetX.addEventListener('input', updateTextStyles);
    if (shadowOffsetY) shadowOffsetY.addEventListener('input', updateTextStyles);
    if (shadowBlur) shadowBlur.addEventListener('input', updateTextStyles);
    if (shadowColor) shadowColor.addEventListener('input', updateTextStyles);
    if (boldToggle) boldToggle.addEventListener('change', updateTextStyles);
    if (widthSlider) widthSlider.addEventListener('input', updateTextStyles); // New: Width Slider Event

    // On load, if we have saved settings, apply them to the DOM elements
    if (settings[colorKey] && colorPicker) {
        colorPicker.value = settings[colorKey];
    }
    if (settings[shadowKey] !== undefined && shadowToggle) {
        shadowToggle.checked = settings[shadowKey];
    }
    if (settings[offsetXKey] !== undefined && shadowOffsetX) {
        shadowOffsetX.value = settings[offsetXKey];
    }
    if (settings[offsetYKey] !== undefined && shadowOffsetY) {
        shadowOffsetY.value = settings[offsetYKey];
    }
    if (settings[blurKey] !== undefined && shadowBlur) {
        shadowBlur.value = settings[blurKey];
    }
    if (settings[shadowColKey] && shadowColor) {
        shadowColor.value = settings[shadowColKey];
    }
    if (settings[boldKey] !== undefined && boldToggle) {
        boldToggle.checked = settings[boldKey];
    }
    if (settings[widthKey] !== undefined && widthSlider && widthValue) { // New: Width Settings
        widthSlider.value = settings[widthKey];
        widthValue.textContent = `${settings[widthKey]}%`;
    }

    // Run once to ensure current settings are applied visually
    updateTextStyles();
}

// Updated text elements configuration to include width variables
const textElements = [
    // Pre-accept heading
    {
        elementId: 'heading',
        cssColorVar: '--fallback-heading-color',
        cssShadowVar: '--fallback-heading-text-shadow',
        cssFontWeightVar: '--fallback-heading-font-weight',
        cssWidthVar: '--fallback-heading-width' // New: Width Variable
    },
    // Pre-accept description
    {
        elementId: 'description',
        cssColorVar: '--fallback-description-color',
        cssShadowVar: '--fallback-description-text-shadow',
        cssFontWeightVar: '--fallback-description-font-weight',
        cssWidthVar: '--fallback-description-width' // New: Width Variable
    },
    // Post-accept heading
    {
        elementId: 'post-accept-heading',
        cssColorVar: '--post-accept-fallback-heading-color',
        cssShadowVar: '--post-accept-fallback-heading-text-shadow',
        cssFontWeightVar: '--post-accept-fallback-heading-font-weight',
        cssWidthVar: '--post-accept-fallback-heading-width' // New: Width Variable
    },
    // Post-accept description
    {
        elementId: 'post-accept-description',
        cssColorVar: '--post-accept-fallback-description-color',
        cssShadowVar: '--post-accept-fallback-description-text-shadow',
        cssFontWeightVar: '--post-accept-fallback-description-font-weight',
        cssWidthVar: '--post-accept-fallback-description-width' // New: Width Variable
    },
    // Post-accept prize
    {
        elementId: 'post-accept-prize',
        cssColorVar: '--post-accept-fallback-prize-color',
        cssShadowVar: '--post-accept-fallback-prize-text-shadow',
        cssFontWeightVar: '--post-accept-fallback-prize-font-weight',
        cssWidthVar: '--post-accept-fallback-prize-width' // New: Width Variable
    }
];

// Initialize text styling for each element
textElements.forEach((config) => {
    setupTextStyling(config);
});

/* ============================================================
   8. Button Styling Functionality
   ============================================================ */

/**
 * Creates a text-shadow string if the toggle is on, else "none".
 */
function applyTextShadow(checked, offsetX, offsetY, blur, color) {
    if (checked) {
        return `${offsetX}px ${offsetY}px ${blur}px ${color}`;
    }
    return 'none';
}

/**
 * Sets up color pickers and toggles for a single button, updating the relevant CSS variables.
 * Also persists to localStorage.
 */
function setupButtonStyling(config) {
    const {
        elementPrefix,
        varBg,
        varFg,
        varBorderColor,
        varBorderWidth,
        varTextShadow,
        varFontWeight,
        varBorderRadius
    } = config;

    // HTML Inputs
    const bgPicker = document.getElementById(`${elementPrefix}-bg-color`);
    const fgPicker = document.getElementById(`${elementPrefix}-fg-color`);
    const boldToggle = document.getElementById(`${elementPrefix}-bold-toggle`);
    const borderColorPicker = document.getElementById(`${elementPrefix}-border-color`);
    const borderWidthInput = document.getElementById(`${elementPrefix}-border-width`);
    const shadowToggle = document.getElementById(`${elementPrefix}-shadow-toggle`);
    const shadowOffsetX = document.getElementById(`${elementPrefix}-shadow-offset-x`);
    const shadowOffsetY = document.getElementById(`${elementPrefix}-shadow-offset-y`);
    const shadowBlur = document.getElementById(`${elementPrefix}-shadow-blur`);
    const shadowColor = document.getElementById(`${elementPrefix}-shadow-color`);
    const borderRadiusInput = document.getElementById(`${elementPrefix}-border-radius`);

    // Unique localStorage keys
    const bgKey         = `${elementPrefix}-bg-color-value`;
    const fgKey         = `${elementPrefix}-fg-color-value`;
    const boldKey       = `${elementPrefix}-bold-toggle-value`;
    const borderColKey  = `${elementPrefix}-border-color-value`;
    const borderWKey    = `${elementPrefix}-border-width-value`;
    const shadowTKey    = `${elementPrefix}-shadow-toggle-value`;
    const shadowOffXKey = `${elementPrefix}-shadow-offset-x-value`;
    const shadowOffYKey = `${elementPrefix}-shadow-offset-y-value`;
    const shadowBlurKey = `${elementPrefix}-shadow-blur-value`;
    const shadowColKey  = `${elementPrefix}-shadow-color-value`;
    const borderRadKey  = `${elementPrefix}-border-radius-value`;

    function updateButtonStyles() {
        // Gather values
        const bgVal = bgPicker ? bgPicker.value : '#444444';
        const fgVal = fgPicker ? fgPicker.value : '#ffffff';
        const isBold = boldToggle && boldToggle.checked;
        const bordColor = borderColorPicker ? borderColorPicker.value : '#ffffff';
        const bordWidth = borderWidthInput ? parseInt(borderWidthInput.value, 10) || 0 : 0;
        const isShadOn = shadowToggle && shadowToggle.checked;
        const offX = shadowOffsetX ? parseInt(shadowOffsetX.value, 10) || 0 : 0;
        const offY = shadowOffsetY ? parseInt(shadowOffsetY.value, 10) || 0 : 0;
        const shBlur = shadowBlur ? parseInt(shadowBlur.value, 10) || 0 : 0;
        const shColor = shadowColor ? shadowColor.value : '#000000';
        const radVal = borderRadiusInput ? parseInt(borderRadiusInput.value, 10) || 0 : 0;

        // Apply to CSS
        document.documentElement.style.setProperty(varBg, bgVal);
        document.documentElement.style.setProperty(varFg, fgVal);
        document.documentElement.style.setProperty(varFontWeight, isBold ? 'bold' : 'normal');
        document.documentElement.style.setProperty(varBorderColor, bordColor);
        document.documentElement.style.setProperty(varBorderWidth, `${bordWidth}px`);

        const shadowVal = applyTextShadow(isShadOn, offX, offY, shBlur, shColor);
        document.documentElement.style.setProperty(varTextShadow, shadowVal);

        document.documentElement.style.setProperty(varBorderRadius, `${radVal}px`);

        // Save to localStorage
        if (bgPicker)           updateSetting(bgKey, bgVal);
        if (fgPicker)           updateSetting(fgKey, fgVal);
        if (boldToggle)         updateSetting(boldKey, isBold);
        if (borderColorPicker)  updateSetting(borderColKey, bordColor);
        if (borderWidthInput)   updateSetting(borderWKey, bordWidth);
        if (shadowToggle)       updateSetting(shadowTKey, isShadOn);
        if (shadowOffsetX)      updateSetting(shadowOffXKey, offX);
        if (shadowOffsetY)      updateSetting(shadowOffYKey, offY);
        if (shadowBlur)         updateSetting(shadowBlurKey, shBlur);
        if (shadowColor)        updateSetting(shadowColKey, shColor);
        if (borderRadiusInput)  updateSetting(borderRadKey, radVal);
    }

    // Attach event listeners
    if (bgPicker) bgPicker.addEventListener('input', updateButtonStyles);
    if (fgPicker) fgPicker.addEventListener('input', updateButtonStyles);
    if (boldToggle) boldToggle.addEventListener('change', updateButtonStyles);
    if (borderColorPicker) borderColorPicker.addEventListener('input', updateButtonStyles);
    if (borderWidthInput) borderWidthInput.addEventListener('input', updateButtonStyles);
    if (shadowToggle) shadowToggle.addEventListener('change', updateButtonStyles);
    if (shadowOffsetX) shadowOffsetX.addEventListener('input', updateButtonStyles);
    if (shadowOffsetY) shadowOffsetY.addEventListener('input', updateButtonStyles);
    if (shadowBlur) shadowBlur.addEventListener('input', updateButtonStyles);
    if (shadowColor) shadowColor.addEventListener('input', updateButtonStyles);
    if (borderRadiusInput) borderRadiusInput.addEventListener('input', updateButtonStyles);

    // On load, if we have saved settings, apply them to the DOM inputs
    if (settings[bgKey] && bgPicker) {
        bgPicker.value = settings[bgKey];
    }
    if (settings[fgKey] && fgPicker) {
        fgPicker.value = settings[fgKey];
    }
    if (settings[boldKey] !== undefined && boldToggle) {
        boldToggle.checked = settings[boldKey];
    }
    if (settings[borderColKey] && borderColorPicker) {
        borderColorPicker.value = settings[borderColKey];
    }
    if (settings[borderWKey] !== undefined && borderWidthInput) {
        borderWidthInput.value = settings[borderWKey];
    }
    if (settings[shadowTKey] !== undefined && shadowToggle) {
        shadowToggle.checked = settings[shadowTKey];
    }
    if (settings[shadowOffXKey] !== undefined && shadowOffsetX) {
        shadowOffsetX.value = settings[shadowOffXKey];
    }
    if (settings[shadowOffYKey] !== undefined && shadowOffsetY) {
        shadowOffsetY.value = settings[shadowOffYKey];
    }
    if (settings[shadowBlurKey] !== undefined && shadowBlur) {
        shadowBlur.value = settings[shadowBlurKey];
    }
    if (settings[shadowColKey] && shadowColor) {
        shadowColor.value = settings[shadowColKey];
    }
    if (settings[borderRadKey] !== undefined && borderRadiusInput) {
        borderRadiusInput.value = settings[borderRadKey];
    }

    // Run once so the UI & preview reflect these stored values
    updateButtonStyles();
}

// Configuration for each button
const buttonConfigs = [
    {
        elementPrefix: 'accept-button',
        varBg: '--accept-button-bg',
        varFg: '--accept-button-fg',
        varBorderColor: '--accept-button-border-color',
        varBorderWidth: '--accept-button-border-width',
        varTextShadow: '--accept-button-text-shadow',
        varFontWeight: '--accept-button-font-weight',
        varBorderRadius: '--accept-button-border-radius'
    },
    {
        elementPrefix: 'play-now-button',
        varBg: '--play-now-button-bg',
        varFg: '--play-now-button-fg',
        varBorderColor: '--play-now-button-border-color',
        varBorderWidth: '--play-now-button-border-width',
        varTextShadow: '--play-now-button-text-shadow',
        varFontWeight: '--play-now-button-font-weight',
        varBorderRadius: '--play-now-button-border-radius'
    },
    {
        elementPrefix: 'play-later-button',
        varBg: '--play-later-button-bg',
        varFg: '--play-later-button-fg',
        varBorderColor: '--play-later-button-border-color',
        varBorderWidth: '--play-later-button-border-width',
        varTextShadow: '--play-later-button-text-shadow',
        varFontWeight: '--play-later-button-font-weight',
        varBorderRadius: '--play-later-button-border-radius'
    },
    {
        elementPrefix: 'continue-button',
        varBg: '--continue-button-bg',
        varFg: '--continue-button-fg',
        varBorderColor: '--continue-button-border-color',
        varBorderWidth: '--continue-button-border-width',
        varTextShadow: '--continue-button-text-shadow',
        varFontWeight: '--continue-button-font-weight',
        varBorderRadius: '--continue-button-border-radius'
    }
];

// Initialize button styling for each button
buttonConfigs.forEach(cfg => {
    setupButtonStyling(cfg);
});

/* ============================================================
   9. Export Style Functionality
   ============================================================ */

/**
 * Exports the current CSS variables as a style.css file.
 */
function exportStyle() {
    const exportButton = document.getElementById('export-style-button');
    if (!exportButton) {
        console.warn('Export Style button not found.');
        return;
    }

    // Define groups and their variables
    const variableGroups = [
        {
            title: 'Text Position Variables - Initial Phase',
            variables: [
                '--fallback-heading-top',
                '--fallback-description-top',
                '--fallback-button-accept-top'
            ]
        },
        {
            title: 'Text Width Variables - Initial Phase', // New
            variables: [
                '--fallback-heading-width',
                '--fallback-description-width'
            ]
        },
        {
            title: 'Text Position Variables - Post-Accept Phase',
            variables: [
                '--post-accept-fallback-heading-top',
                '--post-accept-fallback-description-top',
                '--post-accept-fallback-prize-top',
                '--post-accept-fallback-button-play-now-top',
                '--post-accept-fallback-button-play-later-top',
                '--post-accept-fallback-button-continue-top'
            ]
        },
        {
            title: 'Text Width Variables - Post-Accept Phase', // New
            variables: [
                '--post-accept-fallback-heading-width',
                '--post-accept-fallback-description-width',
                '--post-accept-fallback-prize-width'
            ]
        },
        {
            title: 'PRE-ACCEPT PHASE STYLES',
            variables: [
                '--fallback-heading-color',
                '--fallback-heading-text-shadow',
                '--fallback-heading-font-weight',
                '--fallback-description-color',
                '--fallback-description-text-shadow',
                '--fallback-description-font-weight'
            ]
        },
        {
            title: 'POST-ACCEPT PHASE STYLES',
            variables: [
                '--post-accept-fallback-heading-color',
                '--post-accept-fallback-heading-text-shadow',
                '--post-accept-fallback-heading-font-weight',
                '--post-accept-fallback-description-color',
                '--post-accept-fallback-description-text-shadow',
                '--post-accept-fallback-description-font-weight',
                '--post-accept-fallback-prize-color',
                '--post-accept-fallback-prize-text-shadow',
                '--post-accept-fallback-prize-font-weight'
            ]
        },
        {
            title: 'BUTTON STYLING VARIABLES',
            variables: [
                // Accept Button
                '--accept-button-bg',
                '--accept-button-fg',
                '--accept-button-border-color',
                '--accept-button-border-width',
                '--accept-button-text-shadow',
                '--accept-button-font-weight',
                '--accept-button-border-radius',
                // Play Now Button
                '--play-now-button-bg',
                '--play-now-button-fg',
                '--play-now-button-border-color',
                '--play-now-button-border-width',
                '--play-now-button-text-shadow',
                '--play-now-button-font-weight',
                '--play-now-button-border-radius',
                // Play Later Button
                '--play-later-button-bg',
                '--play-later-button-fg',
                '--play-later-button-border-color',
                '--play-later-button-border-width',
                '--play-later-button-text-shadow',
                '--play-later-button-font-weight',
                '--play-later-button-border-radius',
                // Continue Button
                '--continue-button-bg',
                '--continue-button-fg',
                '--continue-button-border-color',
                '--continue-button-border-width',
                '--continue-button-text-shadow',
                '--continue-button-font-weight',
                '--continue-button-border-radius'
            ]
        },
        {
            title: 'BUTTON BORDER RADIUS VARIABLES',
            variables: [
                '--accept-button-border-radius',
                '--play-now-button-border-radius',
                '--play-later-button-border-radius',
                '--continue-button-border-radius'
            ]
        }
    ];

    let cssContent = ':root {\n';

    variableGroups.forEach(group => {
        cssContent += `    /* ${group.title} */\n`;
        group.variables.forEach(varName => {
            const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            cssContent += `    ${varName}: ${value};\n`;
        });
        cssContent += '\n';
    });

    cssContent += '}';

    // Create a blob from the CSS content
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'style.css';
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Event Listener for Export Style Button
document.getElementById('export-style-button').addEventListener('click', exportStyle);

/* ============================================================
   10. Maximize Toggle Functionality
   ============================================================ */
const previewPanel = document.querySelector('.fallback');
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

// 1) Phase Toggle
if (typeof settings.phaseToggle === 'boolean') {
    phaseToggle.checked = settings.phaseToggle;
}
// 2) Use Continue
if (typeof settings.useContinue === 'boolean') {
    useContinueToggle.checked = settings.useContinue;
}

// 3) Now that each slider is set up, let's see if we have stored values for them
sliderConfigs.forEach(({ sliderId, valueId, cssVariable }) => {
    const savedKey = `${sliderId}-value`;
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);

    if (slider && settings[savedKey] !== undefined) {
        slider.value = settings[savedKey];
        // Call the same logic as "updateValue()"
        const value = slider.value;
        valueDisplay.textContent = `${value}%`;
        document.documentElement.style.setProperty(cssVariable, `${value}%`);
    }
});

// Navigation tab

// Tab Navigation
let tabBtns = document.querySelectorAll('.tab-btn');
let tabContents = document.querySelectorAll('.options-tab');

tabBtns.forEach((btn) => {
    triggerTabNav(btn);
}); 

function triggerTabNav(btn) {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        tabBtns.forEach((tabBtn) => {
            tabBtn.classList.remove('active');
            tabBtn.classList.add('inactive');
        });

        // Add active class to clicked button
        btn.classList.remove('inactive');
        btn.classList.add('active');

        // Hide all tab contents
        tabContents.forEach((tabContent) => {
            tabContent.style.display = 'none';
        });

        // Show the corresponding tab content
        let tabContent = document.getElementById(btn.dataset.tab); 
        tabContent.style.display = 'block';
    });    
}

function applyTabSettings() {
    // Get active element
    let activeElement = document.querySelector('.tab-btn.active');

    // Hide all tab contents
    tabContents.forEach((tabContent) => {
        tabContent.style.display = 'none';
    });

    // Show the corresponding tab content
    let tabContent = document.getElementById(activeElement.dataset.tab); 
    tabContent.style.display = 'block';
}

applyTabSettings();

// Re-apply phase toggles
togglePhase();
toggleUseContinue();
updatePrizeText();
