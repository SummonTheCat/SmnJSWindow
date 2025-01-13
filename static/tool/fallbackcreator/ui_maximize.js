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

function initMaximizeFunction() {
    window.previewPanel = document.querySelector('.fallback');
    window.closeMaximizeButton = document.getElementById('close-maximize-button');

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


}