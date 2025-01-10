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
   ELEMENT HANDLE SETUP
   ============================================================ */
function setupElementHandles() {
    window.phaseToggle = document.getElementById('phase-toggle');
    window.useContinueToggle = document.getElementById('use-continue-toggle');
    window.fallbackDiv = document.getElementById('fallback-div');
    window.toolPanelOptions = document.querySelector('.tool-panel-options');

    window.fallbackButtons = document.getElementById('fallback-buttons');
    window.acceptButton = document.getElementById('fallback-button-accept');
    window.playNowButton = document.getElementById('fallback-button-play-now');
    window.playLaterButton = document.getElementById('fallback-button-play-later');
    window.continueButton = document.getElementById('fallback-button-continue');

    window.prizeTextElement = document.getElementById('fallback-prize');
}


/* ============================================================
   FALLBACK OVERLAY RESIZING
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

function initDynamicFallbackSized() {
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
}

/* ============================================================
   FALLBACK PHASE AND TYPE TOGGLE
   ============================================================ */

function setupPhaseTypeToggleListeners() {
    phaseToggle.addEventListener('change', togglePhase);
    useContinueToggle.addEventListener('change', toggleUseContinue);
}

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

