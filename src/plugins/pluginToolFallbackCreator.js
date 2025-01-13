// plugins/pluginToolFallbackCreator.js

import { log } from "console";
import { logColor } from "../utils/log.js";
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import multer from 'multer'; // Import multer for handling file uploads

// Promisify fs functions for easier async/await usage
const mkdirAsync = promisify(fs.mkdir);
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);

// Configure multer storage
const storage = multer.memoryStorage(); // Store files in memory as Buffer objects

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only PNG images are allowed'), false);
        }
    }
}).single('image'); // Expecting a single file with the field name 'image'

const pluginToolFallbackCreator = {
    pluginName: 'PluginToolFallbackCreator',

    pluginInit: () => {
        // Initialize any required resources here (if necessary)
    },

    /**
     * Determines if the plugin should handle the given request path.
     * @param {string} reqPath - The request path.
     * @returns {boolean} - True if the plugin should handle the request.
     */
    pluginCatch: (reqPath) => {
        return reqPath.startsWith('/tool/fallbackcreator/');
    },

    /**
     * Serves requests based on the path segments.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     */
    pluginServe: (req, res) => {
        const reqPath = req.path;
        const pathSegments = reqPath.split('/').slice(1); // Remove the leading empty string
        logColor(`Request: ${reqPath}`, 'salmon');
        logColor(pathSegments, 'cyan');

        // Handle different routes based on path segments
        if (pathSegments.length === 3 && pathSegments[2] === 'load') {
            return pluginToolFallbackCreator.load(req, res);
        } else if (pathSegments.length === 4 && pathSegments[2] === 'setimg') {
            const imgType = pathSegments[3]; // 'intro' or 'outro'
            if (['intro', 'outro'].includes(imgType)) {
                // Use multer to handle the file upload
                upload(req, res, (err) => {
                    if (err instanceof multer.MulterError) {
                        // A Multer error occurred when uploading
                        logColor(`Multer error: ${err.message}`, 'red');
                        return res.status(400).send(`Upload error: ${err.message}`);
                    } else if (err) {
                        // An unknown error occurred when uploading
                        logColor(`Unknown error: ${err.message}`, 'red');
                        return res.status(400).send(`Error: ${err.message}`);
                    }

                    // Everything went fine
                    return pluginToolFallbackCreator.setImage(req, res, imgType);
                });
            } else {
                return pluginToolFallbackCreator.fallback(req, res);
            }
        } else {
            return pluginToolFallbackCreator.fallback(req, res);
        }
    },

    /**
     * Handles the 'load' route by serving the UI HTML, CSS, and JS.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     */
    load: (req, res) => {
        // Get tool html file
        const pathRoot = process.cwd();
        const staticDir = 'static';
        const toolDir = 'tool';
        const fallbackCreatorDir = 'fallbackcreator';
        const toolHtml = 'ui.html';
        const toolJs = 'ui.js';
        const toolCss = 'ui.css';
        const fullPathHtml = `${pathRoot}/${staticDir}/${toolDir}/${fallbackCreatorDir}/${toolHtml}`;
        const fullPathCss = `${pathRoot}/${staticDir}/${toolDir}/${fallbackCreatorDir}/${toolCss}`;

        // Read HTML and CSS files
        const html = fs.readFileSync(fullPathHtml);
        const css = fs.readFileSync(fullPathCss);

        // Convert the files to strings
        const htmlString = html.toString();
        const cssString = css.toString();

        // Get the JS files, ensuring ui.js is added last
        let jsFiles = fs.readdirSync(`${pathRoot}/${staticDir}/${toolDir}/${fallbackCreatorDir}`).filter(file => file.endsWith('.js') && file !== toolJs);
        jsFiles.push(toolJs);

        logColor(jsFiles, 'cyan');

        // Read the JS files and concatenate them
        let jsString = '';
        jsFiles.forEach(file => {
            const js = fs.readFileSync(`${pathRoot}/${staticDir}/${toolDir}/${fallbackCreatorDir}/${file}`);
            jsString += js.toString() + '\n';
        });

        // TEMP: Write the full JS string to a file for debugging
        fs.writeFileSync(`${pathRoot}/${staticDir}/${toolDir}/${fallbackCreatorDir}/full`, jsString);

        // Join the files together, surround JS and CSS with script and style tags
        const response = `
            ${htmlString}
            <style>${cssString}</style>
            <script>${jsString}</script>
        `;

        // Send the response
        res.send(response);
    },

    /**
     * Handles image uploads for Intro and Outro images.
     * Saves the uploaded PNG image to the designated directory with a fixed filename.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @param {string} imgType - The type of image ('intro' or 'outro').
     */
    setImage: async (req, res, imgType) => {
        try {
            const file = req.file; // Access the uploaded file

            if (!file) {
                res.status(400).send('Bad Request: No file uploaded');
                return;
            }

            // Ensure the file is a PNG (already handled by multer's fileFilter)
            if (file.mimetype !== 'image/png') {
                res.status(400).send('Bad Request: Only PNG images are accepted');
                return;
            }

            // Define the directory to save the image
            const pathRoot = process.cwd();
            const staticDir = 'static';
            const imgDir = path.join(pathRoot, staticDir, 'fallback');

            // Create the directory if it doesn't exist
            await mkdirAsync(imgDir, { recursive: true });

            // Define the fixed file name: intro.png or outro.png
            const fileName = `${imgType}.png`;
            const filePath = path.join(imgDir, fileName);

            // Save the image buffer to the file, overwriting if it exists
            await writeFileAsync(filePath, file.buffer);

            logColor(`Image saved: ${filePath}`, 'green');

            res.status(200).send(`Image ${fileName} saved successfully`);
        } catch (error) {
            logColor(`Error in setImage (${imgType}): ${error.message}`, 'red');
            res.status(500).send('Internal Server Error');
        }
    },

    /**
     * Handles fallback for undefined routes.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     */
    fallback: (req, res) => {
        logColor('Fallback function called', 'salmon');
        res.status(404).send('Route not found');
    }
};

export default pluginToolFallbackCreator;
