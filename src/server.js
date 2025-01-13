import express from 'express';
import { addPlugin, initializePlugins, servePlugins } from './pluginSystem.js';

/**
 * Creates and configures the Express server.
 * @returns {Object} An object containing methods to add plugins and run the server.
 */
function createServer() {
    const app = express();

    // Middleware to parse JSON requests with increased limit
    app.use(express.json({ limit: '10mb' })); // Adjust the limit as necessary

    // Optional: Middleware to parse URL-encoded data if needed
    app.use(express.urlencoded({ limit: '10mb', extended: true }));

    return {
        /**
         * Adds a plugin by its filename.
         * @param {string} pluginFileName - The filename of the plugin (e.g., 'helloWorld.js').
         */
        addPlugin,

        /**
         * Runs the server on the specified port after initializing plugins.
         * @param {number} port - The port number (e.g., 3000).
         */
        run: (port) => {
            initializePlugins();
            servePlugins(app);
            app.listen(port, () => {
                console.log(`Server is running on http://localhost:${port}`);
            });
        }
    };
}

export default createServer;
