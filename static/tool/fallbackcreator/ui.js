// .\static\tool\fallbackcreator\ui.js

console.log('Fallback Creator UI loaded');
setupElementHandles()
setupConfigs();
setupPhaseTypeToggleListeners();
setupFallbackButtonListeners();

initDynamicFallbackSized();
createSliders();




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
        cssWidthVar, // Existing
        cssFontSizeVar
    } = config;

    // Color Picker
    const colorPicker = document.getElementById(`${elementId}-text-color`);
    const shadowToggle = document.getElementById(`${elementId}-drop-shadow-toggle`);
    const shadowOffsetX = document.getElementById(`${elementId}-shadow-offset-x`);
    const shadowOffsetY = document.getElementById(`${elementId}-shadow-offset-y`);
    const shadowBlur = document.getElementById(`${elementId}-shadow-blur`);
    const shadowColor = document.getElementById(`${elementId}-shadow-color`);
    const boldToggle = document.getElementById(`${elementId}-bold-toggle`);
    const widthSlider = document.getElementById(`${elementId}-width-slider`);
    const widthValue = document.getElementById(`${elementId}-width-value`); 
    const fontSizeSlider = document.getElementById(`${elementId}-font-size-slider`); 
    const fontSizeValue = document.getElementById(`${elementId}-font-size-value`);

    // Define unique keys for local storage
    const colorKey     = `${elementId}-text-color-value`;
    const shadowKey    = `${elementId}-drop-shadow-toggle`;
    const offsetXKey   = `${elementId}-shadow-offset-x-value`;
    const offsetYKey   = `${elementId}-shadow-offset-y-value`;
    const blurKey      = `${elementId}-shadow-blur-value`;
    const shadowColKey = `${elementId}-shadow-color-value`;
    const boldKey      = `${elementId}-bold-toggle-value`;
    const widthKey     = `${elementId}-width-slider-value`;
    const fontSizeKey  = `${elementId}-font-size-slider-value`;

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
        const fontSize = fontSizeSlider ? fontSizeSlider.value : 24; // Default font size

        // Apply to CSS
        document.documentElement.style.setProperty(cssColorVar, color);
        const shadowVal = applyTextShadowValue(isShadowEnabled, offX, offY, blr, shColor);
        document.documentElement.style.setProperty(cssShadowVar, shadowVal);
        document.documentElement.style.setProperty(cssFontWeightVar, isBold ? 'bold' : 'normal');
        document.documentElement.style.setProperty(cssWidthVar, `${width}%`); // Apply width
        document.documentElement.style.setProperty(cssFontSizeVar, `${fontSize}px`); // Apply font size

        // Update displays
        if (widthValue) {
            widthValue.textContent = `${width}%`;
        }
        if (fontSizeValue) {
            fontSizeValue.textContent = `${fontSize}px`;
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
        if (fontSizeSlider) updateSetting(fontSizeKey, fontSize);
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
    if (widthSlider) widthSlider.addEventListener('input', updateTextStyles); // Existing
    if (fontSizeSlider) fontSizeSlider.addEventListener('input', updateTextStyles);

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
    if (settings[widthKey] !== undefined && widthSlider && widthValue) {
        widthSlider.value = settings[widthKey];
        widthValue.textContent = `${settings[widthKey]}%`;
    }
    if (settings[fontSizeKey] !== undefined && fontSizeSlider && fontSizeValue) {
        fontSizeSlider.value = settings[fontSizeKey];
        fontSizeValue.textContent = `${settings[fontSizeKey]}px`;
    }

    // Run once to ensure current settings are applied visually
    updateTextStyles();
}

// Updated text elements configuration to include font-size variables
const textElements = [
    // Pre-accept heading
    {
        elementId: 'heading',
        cssColorVar: '--fallback-heading-color',
        cssShadowVar: '--fallback-heading-text-shadow',
        cssFontWeightVar: '--fallback-heading-font-weight',
        cssWidthVar: '--fallback-heading-width',
        cssFontSizeVar: '--fallback-heading-font-size'
    },
    // Pre-accept description
    {
        elementId: 'description',
        cssColorVar: '--fallback-description-color',
        cssShadowVar: '--fallback-description-text-shadow',
        cssFontWeightVar: '--fallback-description-font-weight',
        cssWidthVar: '--fallback-description-width',
        cssFontSizeVar: '--fallback-description-font-size'
    },
    // Post-accept heading
    {
        elementId: 'post-accept-heading',
        cssColorVar: '--post-accept-fallback-heading-color',
        cssShadowVar: '--post-accept-fallback-heading-text-shadow',
        cssFontWeightVar: '--post-accept-fallback-heading-font-weight',
        cssWidthVar: '--post-accept-fallback-heading-width',
        cssFontSizeVar: '--post-accept-fallback-heading-font-size'
    },
    // Post-accept description
    {
        elementId: 'post-accept-description',
        cssColorVar: '--post-accept-fallback-description-color',
        cssShadowVar: '--post-accept-fallback-description-text-shadow',
        cssFontWeightVar: '--post-accept-fallback-description-font-weight',
        cssWidthVar: '--post-accept-fallback-description-width',
        cssFontSizeVar: '--post-accept-fallback-description-font-size'
    },
    // Post-accept prize
    {
        elementId: 'post-accept-prize',
        cssColorVar: '--post-accept-fallback-prize-color',
        cssShadowVar: '--post-accept-fallback-prize-text-shadow',
        cssFontWeightVar: '--post-accept-fallback-prize-font-weight',
        cssWidthVar: '--post-accept-fallback-prize-width',
        cssFontSizeVar: '--post-accept-fallback-prize-font-size'
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
        varBorderRadius,
        varFontSize
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
    const fontSizeSlider = document.getElementById(`${elementPrefix}-font-size-slider`);
    const fontSizeValue = document.getElementById(`${elementPrefix}-font-size-value`);

    // Define unique localStorage keys
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
    const fontSizeKey   = `${elementPrefix}-font-size-slider-value`;

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
        const fontSize = fontSizeSlider ? fontSizeSlider.value : 16; // Default font size

        // Apply to CSS
        document.documentElement.style.setProperty(varBg, bgVal);
        document.documentElement.style.setProperty(varFg, fgVal);
        document.documentElement.style.setProperty(varFontWeight, isBold ? 'bold' : 'normal');
        document.documentElement.style.setProperty(varBorderColor, bordColor);
        document.documentElement.style.setProperty(varBorderWidth, `${bordWidth}px`);

        const shadowVal = applyTextShadow(isShadOn, offX, offY, shBlur, shColor);
        document.documentElement.style.setProperty(varTextShadow, shadowVal);

        document.documentElement.style.setProperty(varBorderRadius, `${radVal}px`);
        document.documentElement.style.setProperty(varFontSize, `${fontSize}px`); // Apply font size

        // Update displays
        if (fontSizeValue) {
            fontSizeValue.textContent = `${fontSize}px`;
        }

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
        if (fontSizeSlider)     updateSetting(fontSizeKey, fontSize);
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
    if (fontSizeSlider) fontSizeSlider.addEventListener('input', updateButtonStyles);

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
    if (settings[fontSizeKey] !== undefined && fontSizeSlider && fontSizeValue) {
        fontSizeSlider.value = settings[fontSizeKey];
        fontSizeValue.textContent = `${settings[fontSizeKey]}px`;
    }

    // Run once to ensure current settings are applied visually
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
        varBorderRadius: '--accept-button-border-radius',
        varFontSize: '--accept-button-font-size'
    },
    {
        elementPrefix: 'play-now-button',
        varBg: '--play-now-button-bg',
        varFg: '--play-now-button-fg',
        varBorderColor: '--play-now-button-border-color',
        varBorderWidth: '--play-now-button-border-width',
        varTextShadow: '--play-now-button-text-shadow',
        varFontWeight: '--play-now-button-font-weight',
        varBorderRadius: '--play-now-button-border-radius',
        varFontSize: '--play-now-button-font-size'
    },
    {
        elementPrefix: 'play-later-button',
        varBg: '--play-later-button-bg',
        varFg: '--play-later-button-fg',
        varBorderColor: '--play-later-button-border-color',
        varBorderWidth: '--play-later-button-border-width',
        varTextShadow: '--play-later-button-text-shadow',
        varFontWeight: '--play-later-button-font-weight',
        varBorderRadius: '--play-later-button-border-radius',
        varFontSize: '--play-later-button-font-size'
    },
    {
        elementPrefix: 'continue-button',
        varBg: '--continue-button-bg',
        varFg: '--continue-button-fg',
        varBorderColor: '--continue-button-border-color',
        varBorderWidth: '--continue-button-border-width',
        varTextShadow: '--continue-button-text-shadow',
        varFontWeight: '--continue-button-font-weight',
        varBorderRadius: '--continue-button-border-radius',
        varFontSize: '--continue-button-font-size'
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
            title: 'Text Width Variables - Initial Phase',
            variables: [
                '--fallback-heading-width',
                '--fallback-description-width'
            ]
        },
        {
            title: 'Text Font Size Variables - Initial Phase',
            variables: [
                '--fallback-heading-font-size',
                '--fallback-description-font-size'
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
            title: 'Text Width Variables - Post-Accept Phase',
            variables: [
                '--post-accept-fallback-heading-width',
                '--post-accept-fallback-description-width',
                '--post-accept-fallback-prize-width'
            ]
        },
        {
            title: 'Text Font Size Variables - Post-Accept Phase',
            variables: [
                '--post-accept-fallback-heading-font-size',
                '--post-accept-fallback-description-font-size',
                '--post-accept-fallback-prize-font-size'
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
                '--accept-button-font-size',
                // Play Now Button
                '--play-now-button-bg',
                '--play-now-button-fg',
                '--play-now-button-border-color',
                '--play-now-button-border-width',
                '--play-now-button-text-shadow',
                '--play-now-button-font-weight',
                '--play-now-button-border-radius',
                '--play-now-button-font-size',
                // Play Later Button
                '--play-later-button-bg',
                '--play-later-button-fg',
                '--play-later-button-border-color',
                '--play-later-button-border-width',
                '--play-later-button-text-shadow',
                '--play-later-button-font-weight',
                '--play-later-button-border-radius',
                '--play-later-button-font-size',
                // Continue Button
                '--continue-button-bg',
                '--continue-button-fg',
                '--continue-button-border-color',
                '--continue-button-border-width',
                '--continue-button-text-shadow',
                '--continue-button-font-weight',
                '--continue-button-border-radius',
                '--continue-button-font-size'
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
        },
        {
            title: 'BUTTON FONT SIZE VARIABLES',
            variables: [
                '--accept-button-font-size',
                '--play-now-button-font-size',
                '--play-later-button-font-size',
                '--continue-button-font-size'
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
        if (cssVariable.includes('font-size')) {
            valueDisplay.textContent = `${slider.value}px`;
            document.documentElement.style.setProperty(cssVariable, `${slider.value}px`);
        } else {
            valueDisplay.textContent = `${slider.value}%`;
            document.documentElement.style.setProperty(cssVariable, `${slider.value}%`);
        }
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
