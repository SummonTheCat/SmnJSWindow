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
        cssWidthVar, 
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
    const colorKey = `${elementId}-text-color-value`;
    const shadowKey = `${elementId}-drop-shadow-toggle`;
    const offsetXKey = `${elementId}-shadow-offset-x-value`;
    const offsetYKey = `${elementId}-shadow-offset-y-value`;
    const blurKey = `${elementId}-shadow-blur-value`;
    const shadowColKey = `${elementId}-shadow-color-value`;
    const boldKey = `${elementId}-bold-toggle-value`;
    const widthKey = `${elementId}-width-slider-value`;
    const fontSizeKey = `${elementId}-font-size-slider-value`;

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
        if (colorPicker) updateSetting(colorKey, color);
        if (shadowToggle) updateSetting(shadowKey, isShadowEnabled);
        if (shadowOffsetX) updateSetting(offsetXKey, offX);
        if (shadowOffsetY) updateSetting(offsetYKey, offY);
        if (shadowBlur) updateSetting(blurKey, blr);
        if (shadowColor) updateSetting(shadowColKey, shColor);
        if (boldToggle) updateSetting(boldKey, isBold);
        if (widthSlider) updateSetting(widthKey, width);
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

function initStylingText() {
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
}