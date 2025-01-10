/* ============================================================
   SLIDER SETUP
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
        if (cssVariable.includes('font-size')) {
            valueDisplay.textContent = `${value}px`;
            document.documentElement.style.setProperty(cssVariable, `${value}px`);
        } else {
            valueDisplay.textContent = `${value}%`;
            document.documentElement.style.setProperty(cssVariable, `${value}%`);
        }

        // Save to localStorage
        const savedKey = `${sliderId}-value`;
        updateSetting(savedKey, value);
    }
    
    // Listen for slider changes
    slider.addEventListener('input', updateValue);

    // Return the function so we can call it during applySettings()
    return { slider, updateValue };
}

function createSliders() {
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
}