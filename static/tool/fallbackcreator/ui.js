// .\static\tool\fallbackcreator\ui.js

/* ============================================================
   GLOBAL STATE & LOCAL STORAGE HANDLING
   ============================================================ */
window.localStorageKey = 'fallbackCreatorSettings';

// We'll store user settings in this object:
window.settings = {};


console.log('Fallback Creator UI loaded');
loadSettings(); 
setupElementHandles()
setupConfigs();
setupPhaseTypeToggle();
setupFallbackButtonListeners();

initDynamicFallbackSized();
initMaximizeFunction();
createSliders();

initStylingText();
initStylingButtons();

initExportFunction();

initTabNavigation();
applyTabSettings();

// Re-apply phase toggles
togglePhase();
toggleUseContinue();
updatePrizeText();
initializeImageUpload();

