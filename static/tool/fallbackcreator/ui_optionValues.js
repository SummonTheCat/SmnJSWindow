

function setupConfigs() {
    // Updated slider configurations including width and font-size sliders
    window.sliderConfigs = [
        // Initial Phase Position Sliders
        { sliderId: 'heading-position-slider', valueId: 'heading-position-value', cssVariable: '--fallback-heading-top' },
        { sliderId: 'description-position-slider', valueId: 'description-position-value', cssVariable: '--fallback-description-top' },
        
        // Initial Phase Width Sliders
        { sliderId: 'heading-width-slider', valueId: 'heading-width-value', cssVariable: '--fallback-heading-width' },
        { sliderId: 'description-width-slider', valueId: 'description-width-value', cssVariable: '--fallback-description-width' },

        // Initial Phase Font Size Sliders
        { sliderId: 'heading-font-size-slider', valueId: 'heading-font-size-value', cssVariable: '--fallback-heading-font-size' },
        { sliderId: 'description-font-size-slider', valueId: 'description-font-size-value', cssVariable: '--fallback-description-font-size' },

        // Accept Button Position Slider
        { sliderId: 'accept-button-vertical-slider', valueId: 'accept-button-vertical-value', cssVariable: '--fallback-button-accept-top' },

        // Accept Button Font Size Slider
        { sliderId: 'accept-button-font-size-slider', valueId: 'accept-button-font-size-value', cssVariable: '--accept-button-font-size' }, // New CSS Variable

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
        { sliderId: 'post-accept-prize-width-slider', valueId: 'post-accept-prize-width-value', cssVariable: '--post-accept-fallback-prize-width' },

        // Post-Accept Phase Font Size Sliders
        { sliderId: 'post-accept-heading-font-size-slider', valueId: 'post-accept-heading-font-size-value', cssVariable: '--post-accept-fallback-heading-font-size' },
        { sliderId: 'post-accept-description-font-size-slider', valueId: 'post-accept-description-font-size-value', cssVariable: '--post-accept-fallback-description-font-size' },
        { sliderId: 'post-accept-prize-font-size-slider', valueId: 'post-accept-prize-font-size-value', cssVariable: '--post-accept-fallback-prize-font-size' },

        // Button Font Size Sliders
        { sliderId: 'play-now-button-font-size-slider', valueId: 'play-now-button-font-size-value', cssVariable: '--play-now-button-font-size' }, // New
        { sliderId: 'play-later-button-font-size-slider', valueId: 'play-later-button-font-size-value', cssVariable: '--play-later-button-font-size' }, // New
        { sliderId: 'continue-button-font-size-slider', valueId: 'continue-button-font-size-value', cssVariable: '--continue-button-font-size' } // New
    ];
}