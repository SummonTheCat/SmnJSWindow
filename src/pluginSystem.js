import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { logColor } from './utils/log.js';

const plugins = [];

/**
 * Adds a plugin to the system by its filename.
 * @param {string} pluginFileName - The filename of the plugin (e.g., 'helloWorld.js').
 */
async function addPlugin(pluginFileName) {
    // Resolve __dirname in ES Modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const pluginsDir = path.join(__dirname, 'plugins');
    const pluginPath = path.join(pluginsDir, pluginFileName);

    if (!existsSync(pluginPath)) {
        logColor(`Plugin file "${pluginFileName}" not found.`, 'red');
        return;
    }

    try {
        const module = await import(`file://${pluginPath}`);
        const plugin = module.default;

        if (plugin && typeof plugin.pluginName === 'string') {
            plugins.push(plugin);
            logColor(`Plugin "${plugin.pluginName}" added.`, 'green');
        } else {
            console.error(`Invalid plugin structure in "${pluginFileName}".`);
        }
    } catch (err) {
        console.error(`Failed to load plugin "${pluginFileName}":`, err);
    }
}

/**
 * Initializes all added plugins by calling their `pluginInit` functions.
 */
function initializePlugins() {
    plugins.forEach(plugin => {
        if (typeof plugin.pluginInit === 'function') {
            plugin.pluginInit();
        }
    });
}

/**
 * Sets up the catch-all route to delegate requests to plugins.
 * Plugins are processed in the order they were added.
 * @param {Express.Application} app - The Express app instance.
 */
function servePlugins(app) {
    app.all('*', (req, res) => {
        for (const plugin of plugins) {
            if (plugin.pluginCatch(req.path)) {
                return plugin.pluginServe(req, res);
            }
        }
        res.set('Content-Type', 'application/json');
        res.status(404).send({ error: 'Not Found' });
    });
}

export { addPlugin, initializePlugins, servePlugins };
