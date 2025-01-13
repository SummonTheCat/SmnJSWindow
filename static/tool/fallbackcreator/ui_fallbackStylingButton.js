/**
 * Creates a text-shadow string if the toggle is on, else "none".
 */
function applyTextShadow(checked, offsetX, offsetY, blur, color) {
    if (checked) {
        return `${offsetX}px ${offsetY}px ${blur}px ${color}`;
    }
    return 'none';
}

function setupButtonStyling(config) {
    const {
        elementPrefix,
        varBg,
        varBgHover, // Added hover variable
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
    const bgHoverPicker = document.getElementById(`${elementPrefix}-bg-color-hover`); // Hover color picker
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
    const bgKey = `${elementPrefix}-bg-color-value`;
    const bgHoverKey = `${elementPrefix}-bg-color-hover-value`; // Hover key
    const fgKey = `${elementPrefix}-fg-color-value`;
    const boldKey = `${elementPrefix}-bold-toggle-value`;
    const borderColKey = `${elementPrefix}-border-color-value`;
    const borderWKey = `${elementPrefix}-border-width-value`;
    const shadowTKey = `${elementPrefix}-shadow-toggle-value`;
    const shadowOffXKey = `${elementPrefix}-shadow-offset-x-value`;
    const shadowOffYKey = `${elementPrefix}-shadow-offset-y-value`;
    const shadowBlurKey = `${elementPrefix}-shadow-blur-value`;
    const shadowColKey = `${elementPrefix}-shadow-color-value`;
    const borderRadKey = `${elementPrefix}-border-radius-value`;
    const fontSizeKey = `${elementPrefix}-font-size-slider-value`;

    function updateButtonStyles() {
        // Gather values
        const bgVal = bgPicker ? bgPicker.value : '#444444';
        const bgHoverVal = bgHoverPicker ? bgHoverPicker.value : '#666666'; // Hover value
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
        document.documentElement.style.setProperty(varBgHover, bgHoverVal); // Apply hover background
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
        if (bgPicker) updateSetting(bgKey, bgVal);
        if (bgHoverPicker) updateSetting(bgHoverKey, bgHoverVal); // Save hover value
        if (fgPicker) updateSetting(fgKey, fgVal);
        if (boldToggle) updateSetting(boldKey, isBold);
        if (borderColorPicker) updateSetting(borderColKey, bordColor);
        if (borderWidthInput) updateSetting(borderWKey, bordWidth);
        if (shadowToggle) updateSetting(shadowTKey, isShadOn);
        if (shadowOffsetX) updateSetting(shadowOffXKey, offX);
        if (shadowOffsetY) updateSetting(shadowOffYKey, offY);
        if (shadowBlur) updateSetting(shadowBlurKey, shBlur);
        if (shadowColor) updateSetting(shadowColKey, shColor);
        if (borderRadiusInput) updateSetting(borderRadKey, radVal);
        if (fontSizeSlider) updateSetting(fontSizeKey, fontSize);
    }

    // Attach event listeners
    if (bgPicker) bgPicker.addEventListener('input', updateButtonStyles);
    if (bgHoverPicker) bgHoverPicker.addEventListener('input', updateButtonStyles); // Hover picker listener
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
    if (settings[bgHoverKey] && bgHoverPicker) { // Apply hover value on load
        bgHoverPicker.value = settings[bgHoverKey];
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

function initStylingButtons() {
    // Configuration for each button
    const buttonConfigs = [
        {
            elementPrefix: 'accept-button',
            varBg: '--accept-button-bg',
            varBgHover: '--accept-button-bg-hover', // Hover variable
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
            varBgHover: '--play-now-button-bg-hover', // Hover variable
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
            varBgHover: '--play-later-button-bg-hover', // Hover variable
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
            varBgHover: '--continue-button-bg-hover', // Hover variable
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
}