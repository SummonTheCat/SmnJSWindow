import mime from 'mime';
import { logColor } from "../utils/log.js";
import path from 'path'; // Import the path module

const pluginStatics = {
    pluginName: 'PluginStatics',
    pluginInit: () => {},
    pluginCatch: (path) => {
        if (path.startsWith('/') && mime.getType(path)) {
            return true;
        }
    },
    pluginServe: (req, res) => {
        const reqMethod = req.method;
        const reqPath = req.path;
        logColor(`Request: ${reqMethod} ${reqPath}`, 'salmon');

        // Get the file's mime type
        const mimeType = mime.getType(reqPath);

        // Get the file path
        const filePath = reqPath.slice(1);
        const rootPath = process.cwd();
        const staticDir = "static";
        const fullPath = path.join(rootPath, staticDir, filePath); 
        logColor(`Static Path: ${fullPath}`, 'maroon');

        // Send the file
        res.sendFile(fullPath);
    }
};

export default pluginStatics;
