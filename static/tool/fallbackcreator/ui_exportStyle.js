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
                '--accept-button-bg-hover', // Added
                '--accept-button-fg',
                '--accept-button-border-color',
                '--accept-button-border-width',
                '--accept-button-text-shadow',
                '--accept-button-font-weight',
                '--accept-button-border-radius',
                '--accept-button-font-size',
                // Play Now Button
                '--play-now-button-bg',
                '--play-now-button-bg-hover', // Added
                '--play-now-button-fg',
                '--play-now-button-border-color',
                '--play-now-button-border-width',
                '--play-now-button-text-shadow',
                '--play-now-button-font-weight',
                '--play-now-button-border-radius',
                '--play-now-button-font-size',
                // Play Later Button
                '--play-later-button-bg',
                '--play-later-button-bg-hover', // Added
                '--play-later-button-fg',
                '--play-later-button-border-color',
                '--play-later-button-border-width',
                '--play-later-button-text-shadow',
                '--play-later-button-font-weight',
                '--play-later-button-border-radius',
                '--play-later-button-font-size',
                // Continue Button
                '--continue-button-bg',
                '--continue-button-bg-hover', // Added
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

function initExportFunction() {
    // Event Listener for Export Style Button
    document.getElementById('export-style-button').addEventListener('click', exportStyle);
}