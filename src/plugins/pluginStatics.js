import mime from 'mime';
import { logColor } from "../utils/log.js";
import path from 'path'; // Import the path module
import fs from 'fs'; // Import the fs module

const pluginStatics = {
    pluginName: 'PluginStatics',
    pluginInit: () => {},
    pluginCatch: (reqPath) => {
        // Check if the path starts with '/' and has a valid MIME type
        if (reqPath.startsWith('/') && mime.getType(reqPath)) {
            return true;
        }
        return false;
    },
    pluginServe: (req, res) => {
        const reqMethod = req.method;
        const originalUrl = req.originalUrl || req.url; // Get the original URL
        logColor(`Request: ${reqMethod} ${originalUrl}`, 'salmon');

        // Only handle GET and HEAD requests for serving files
        if (reqMethod !== 'GET' && reqMethod !== 'HEAD') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        // ============================================================
        // Strip Query Parameters from the URL
        // ============================================================
        const cleanPath = originalUrl.split('?')[0]; // Remove query string
        logColor(`Clean Path: ${cleanPath}`, 'yellow');

        // Get the file's MIME type
        const mimeType = mime.getType(cleanPath) || 'application/octet-stream';
        res.setHeader('Content-Type', mimeType);

        // Get the file path
        const filePath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;
        const rootPath = process.cwd();
        const staticDir = 'static';
        const fullPath = path.join(rootPath, staticDir, filePath);
        logColor(`Static Path: ${fullPath}`, 'green');

        // Check if the file exists
        fs.access(fullPath, fs.constants.F_OK, (err) => {
            if (err) {
                logColor(`File not found: ${fullPath}`, 'red');
                res.status(404).send('File Not Found');
                return;
            }

            // ============================================================
            // Set Headers to Disable Caching
            // ============================================================
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache'); // HTTP 1.0 compatibility
            res.setHeader('Expires', '0'); // Proxies
            res.setHeader('Surrogate-Control', 'no-store'); // For CDNs and reverse proxies

            // Optionally, remove ETag and Last-Modified headers if necessary
            res.removeHeader('ETag');
            res.removeHeader('Last-Modified');

            // Send the file
            res.sendFile(fullPath, (err) => {
                if (err) {
                    logColor(`Error sending file: ${err}`, 'red');
                    res.status(err.status || 500).send('Internal Server Error');
                }
            });
        });
    }
};

export default pluginStatics;
