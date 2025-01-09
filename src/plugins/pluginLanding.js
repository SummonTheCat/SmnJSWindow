import { logColor } from "../utils/log.js";
import path from 'path'; // Import the path module

const PluginLanding = {
    pluginName: 'PluginLanding',
    pluginInit: () => {},
    pluginCatch: (path) => {
        if (path === '/') {
            return true;
        }
    },
    pluginServe: (req, res) => {
        const reqMethod = req.method;
        
        // Get the file path
        const filePath = 'index.html';
        const rootPath = process.cwd();
        const staticDir = "static";
        const fullPath = path.join(rootPath, staticDir, filePath); 
        logColor(`Static Path: ${fullPath}`, 'maroon');

        // Send the file
        res.sendFile(fullPath);
    }
};

export default PluginLanding;
