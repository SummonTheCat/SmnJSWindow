// ./src/log.js

// Available Colors:
// Standard Foreground Colors (fg):
// black: '\x1b[30m'
// red: '\x1b[31m'
// green: '\x1b[32m'
// yellow: '\x1b[33m'
// blue: '\x1b[34m'
// magenta: '\x1b[35m'
// cyan: '\x1b[36m'
// white: '\x1b[37m'

// Standard Background Colors (bg):
// black: '\x1b[40m'
// red: '\x1b[41m'
// green: '\x1b[42m'
// yellow: '\x1b[43m'
// blue: '\x1b[44m'
// magenta: '\x1b[45m'
// cyan: '\x1b[46m'
// white: '\x1b[47m'

// Predefined True Colors:
// orange: { r: 255, g: 165, b: 0 }
// gold: { r: 255, g: 215, b: 0 }
// silver: { r: 192, g: 192, b: 192 }
// violet: { r: 238, g: 130, b: 238 }
// indigo: { r: 75, g: 0, b: 130 }
// turquoise: { r: 64, g: 224, b: 208 }
// pink: { r: 255, g: 192, b: 203 }
// lime: { r: 0, g: 255, b: 0 }
// navy: { r: 0, g: 0, b: 128 }
// olive: { r: 128, g: 128, b: 0 }
// teal: { r: 0, g: 128, b: 128 }
// maroon: { r: 128, g: 0, b: 0 }
// coral: { r: 255, g: 127, b: 80 }
// orchid: { r: 218, g: 112, b: 214 }
// salmon: { r: 250, g: 128, b: 114 }
// chocolate: { r: 210, g: 105, b: 30 }
// slateBlue: { r: 106, g: 90, b: 205 }
// darkGreen: { r: 0, g: 100, b: 0 }
// darkOrange: { r: 255, g: 140, b: 0 }
// deepPink: { r: 255, g: 20, b: 147 }
// deepSkyBlue: { r: 0, g: 191, b: 255 }
// darkSlateGray: { r: 47, g: 79, b: 79 }
// lightCoral: { r: 240, g: 128, b: 128 }
// mediumPurple: { r: 147, g: 112, b: 219 }
// darkSalmon: { r: 233, g: 150, b: 122 }
// mediumSeaGreen: { r: 60, g: 179, b: 113 }
// tomato: { r: 255, g: 99, b: 71 }
// hotPink: { r: 255, g: 105, b: 180 }
// paleGreen: { r: 152, g: 251, b: 152 }
// steelBlue: { r: 70, g: 130, b: 180 }

// 256-Color Codes:
// fg256[0] - fg256[255]: 256-color foreground codes
// bg256[0] - bg256[255]: 256-color background codes

const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',

    // Standard Foreground Colors
    fg: {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m'
    },
    // Standard Background Colors
    bg: {
        black: '\x1b[40m',
        red: '\x1b[41m',
        green: '\x1b[42m',
        yellow: '\x1b[43m',
        blue: '\x1b[44m',
        magenta: '\x1b[45m',
        cyan: '\x1b[46m',
        white: '\x1b[47m'
    },

    // Extended 256 Foreground and Background Colors
    fg256: {},
    bg256: {},

    // Truecolor (24-bit) Foreground and Background
    fg24: (r, g, b) => `\x1b[38;2;${r};${g};${b}m`,
    bg24: (r, g, b) => `\x1b[48;2;${r};${g};${b}m`,

    // Predefined True Colors
    trueColors: {
        orange: { r: 255, g: 165, b: 0 },
        gold: { r: 255, g: 215, b: 0 },
        silver: { r: 192, g: 192, b: 192 },
        violet: { r: 238, g: 130, b: 238 },
        indigo: { r: 75, g: 0, b: 130 },
        turquoise: { r: 64, g: 224, b: 208 },
        pink: { r: 255, g: 192, b: 203 },
        lime: { r: 0, g: 255, b: 0 },
        navy: { r: 0, g: 0, b: 128 },
        olive: { r: 128, g: 128, b: 0 },
        teal: { r: 0, g: 128, b: 128 },
        maroon: { r: 128, g: 0, b: 0 },
        coral: { r: 255, g: 127, b: 80 },
        orchid: { r: 218, g: 112, b: 214 },
        salmon: { r: 250, g: 128, b: 114 },
        chocolate: { r: 210, g: 105, b: 30 },
        slateBlue: { r: 106, g: 90, b: 205 },
        darkGreen: { r: 0, g: 100, b: 0 },
        darkOrange: { r: 255, g: 140, b: 0 },
        deepPink: { r: 255, g: 20, b: 147 },
        deepSkyBlue: { r: 0, g: 191, b: 255 },
        darkSlateGray: { r: 47, g: 79, b: 79 },
        lightCoral: { r: 240, g: 128, b: 128 },
        mediumPurple: { r: 147, g: 112, b: 219 },
        darkSalmon: { r: 233, g: 150, b: 122 },
        mediumSeaGreen: { r: 60, g: 179, b: 113 },
        tomato: { r: 255, g: 99, b: 71 },
        hotPink: { r: 255, g: 105, b: 180 },
        paleGreen: { r: 152, g: 251, b: 152 },
        steelBlue: { r: 70, g: 130, b: 180 },
        // Add more predefined truecolors as needed
    }
};

// Populate fg256 and bg256 with color codes 0-255
for (let i = 0; i < 256; i++) {
    COLORS.fg256[i] = `\x1b[38;5;${i}m`;
    COLORS.bg256[i] = `\x1b[48;5;${i}m`;
}

/**
 * Retrieves the ANSI escape code for a predefined truecolor foreground.
 * @param {string} colorName - The name of the predefined color.
 * @returns {string} The ANSI escape code for the foreground color.
 */
function getTrueColorFg(colorName) {
    const color = COLORS.trueColors[colorName.toLowerCase()];
    if (color) {
        return COLORS.fg24(color.r, color.g, color.b);
    }
    return COLORS.fg.white;
}

/**
 * Retrieves the ANSI escape code for a predefined truecolor background.
 * @param {string} colorName - The name of the predefined color.
 * @returns {string} The ANSI escape code for the background color.
 */
function getTrueColorBg(colorName) {
    const color = COLORS.trueColors[colorName.toLowerCase()];
    if (color) {
        return COLORS.bg24(color.r, color.g, color.b);
    }
    return COLORS.bg.black;
}

/**
 * Logs a simple message to the console.
 * @param {string} msg - The message to log.
 */
function log(msg) {
    console.log(msg);
}

/**
 * Logs a message with the specified foreground color.
 * Supports standard, bright, extended 256, and predefined truecolor names.
 * @param {string} msg - The message to log.
 * @param {string|number} color - The color name (e.g., 'red', 'green') or a 256-color code (0-255).
 */
function logColor(msg, color) {
    let colorCode = COLORS.fg.white; // Default color

    if (typeof color === 'number') {
        // 256-color code
        if (color >= 0 && color <= 255) {
            colorCode = COLORS.fg256[color];
        }
    } else if (COLORS.fg[color.toLowerCase()]) {
        // Standard or bright color
        colorCode = COLORS.fg[color.toLowerCase()];
    } else if (COLORS.trueColors[color.toLowerCase()]) {
        // Predefined truecolor name
        colorCode = getTrueColorFg(color);
    }

    console.log(`${colorCode}${msg}${COLORS.reset}`);
}

/**
 * Logs a horizontal line of a specified length and color.
 * Supports standard, bright, extended 256, and predefined truecolor names.
 * @param {number} lineLength - The number of characters in the line.
 * @param {string|number} color - The color name (e.g., 'red', 'green') or a 256-color code (0-255).
 */
function logLine(lineLength, color) {
    const line = '-'.repeat(lineLength);
    let colorCode = COLORS.fg.white; // Default color

    if (typeof color === 'number') {
        // 256-color code
        if (color >= 0 && color <= 255) {
            colorCode = COLORS.fg256[color];
        }
    } else if (COLORS.fg[color.toLowerCase()]) {
        // Standard or bright color
        colorCode = COLORS.fg[color.toLowerCase()];
    } else if (COLORS.trueColors[color.toLowerCase()]) {
        // Predefined truecolor name
        colorCode = getTrueColorFg(color);
    }

    console.log(`${colorCode}${line}${COLORS.reset}`);
}

/**
 * Logs a horizontal line with a centered message.
 * The total length of the line includes the message.
 * Supports standard, bright, extended 256, and predefined truecolor names.
 * @param {string} msg - The message to center within the line.
 * @param {number} lineLength - The total number of characters in the line, including the message.
 * @param {string|number} color - The color name (e.g., 'red', 'green') or a 256-color code (0-255).
 */
function logLineHeader(msg, lineLength, color) {
    const msgLength = msg.length;
    if (lineLength < msgLength + 4) { // Ensure there's space for padding
        console.error('Line length too short for the message.');
        return;
    }

    const totalDashes = lineLength - msgLength - 2; // 2 for padding spaces
    const halfDashes = Math.floor(totalDashes / 2);
    const extraDash = totalDashes % 2 === 0 ? '' : '-';

    const line = `${'-'.repeat(halfDashes)} ${msg} ${'-'.repeat(halfDashes)}${extraDash}`;
    let colorCode = COLORS.fg.white; // Default color

    if (typeof color === 'number') {
        // 256-color code
        if (color >= 0 && color <= 255) {
            colorCode = COLORS.fg256[color];
        }
    } else if (COLORS.fg[color.toLowerCase()]) {
        // Standard or bright color
        colorCode = COLORS.fg[color.toLowerCase()];
    } else if (COLORS.trueColors[color.toLowerCase()]) {
        // Predefined truecolor name
        colorCode = getTrueColorFg(color);
    }

    console.log(`${colorCode}${line}${COLORS.reset}`);
}

/**
 * Logs a message with both foreground and background colors.
 * Supports standard, bright, extended 256, and predefined truecolor names.
 * @param {string} msg - The message to log.
 * @param {string|number} fgColor - The foreground color name or 256-color code.
 * @param {string|number} bgColor - The background color name or 256-color code.
 */
function logColorBg(msg, fgColor, bgColor) {
    let fgCode = COLORS.fg.white; // Default foreground
    let bgCode = COLORS.bg.black; // Default background

    // Handle foreground color
    if (typeof fgColor === 'number') {
        if (fgColor >= 0 && fgColor <= 255) {
            fgCode = COLORS.fg256[fgColor];
        }
    } else if (COLORS.fg[fgColor.toLowerCase()]) {
        fgCode = COLORS.fg[fgColor.toLowerCase()];
    } else if (COLORS.trueColors[fgColor.toLowerCase()]) {
        fgCode = getTrueColorFg(fgColor);
    }

    // Handle background color
    if (typeof bgColor === 'number') {
        if (bgColor >= 0 && bgColor <= 255) {
            bgCode = COLORS.bg256[bgColor];
        }
    } else if (COLORS.bg[bgColor.toLowerCase()]) {
        bgCode = COLORS.bg[bgColor.toLowerCase()];
    } else if (COLORS.trueColors[bgColor.toLowerCase()]) {
        bgCode = getTrueColorBg(bgColor);
    }

    console.log(`${fgCode}${bgCode}${msg}${COLORS.reset}`);
}

/**
 * Logs a message using a predefined truecolor foreground.
 * @param {string} msg - The message to log.
 * @param {string} colorName - The predefined truecolor name.
 */
function logTrueColor(msg, colorName) {
    const colorCode = getTrueColorFg(colorName);
    console.log(`${colorCode}${msg}${COLORS.reset}`);
}

/**
 * Logs a message using a predefined truecolor background.
 * @param {string} msg - The message to log.
 * @param {string} colorName - The predefined truecolor name.
 */
function logTrueColorBg(msg, colorName) {
    const colorCode = getTrueColorBg(colorName);
    console.log(`${colorCode}${msg}${COLORS.reset}`);
}

/**
 * Logs a message with both predefined truecolor foreground and background.
 * @param {string} msg - The message to log.
 * @param {string} fgColorName - The predefined truecolor name for foreground.
 * @param {string} bgColorName - The predefined truecolor name for background.
 */
function logTrueColorFgBg(msg, fgColorName, bgColorName) {
    const fgCode = getTrueColorFg(fgColorName);
    const bgCode = getTrueColorBg(bgColorName);
    console.log(`${fgCode}${bgCode}${msg}${COLORS.reset}`);
}

/**
 * Logs a message using a specific 256-color foreground.
 * @param {string} msg - The message to log.
 * @param {number} colorCode - The 256-color code (0-255).
 */
function log256Color(msg, colorCode) {
    if (colorCode < 0 || colorCode > 255) {
        console.error('Color code must be between 0 and 255.');
        return;
    }
    console.log(`${COLORS.fg256[colorCode]}${msg}${COLORS.reset}`);
}

/**
 * Logs a message using a specific 256-color background.
 * @param {string} msg - The message to log.
 * @param {number} colorCode - The 256-color code (0-255).
 */
function log256BgColor(msg, colorCode) {
    if (colorCode < 0 || colorCode > 255) {
        console.error('Color code must be between 0 and 255.');
        return;
    }
    console.log(`${COLORS.bg256[colorCode]}${msg}${COLORS.reset}`);
}

// Export the functions
export { 
    log, 
    logColor, 
    logLine, 
    logLineHeader, 
    logColorBg, 
    log256Color, 
    log256BgColor, 
    logTrueColor, 
    logTrueColorBg,
    logTrueColorFgBg // Additional function for both fg and bg
};
