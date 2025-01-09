import { logColor } from "../utils/log.js";

const pluginToolimagedownscaler = {
    pluginName: 'pluginToolimagedownscaler',
    pluginInit: () => {},
    pluginCatch: (reqPath) => {
        return reqPath.startsWith('/tool/imagedownscaler/');
    },
    pluginServe: (req, res) => {
        const reqPath = req.path;
        const reqPathSuffix = reqPath.split('/').pop();
        logColor(`Request: ${reqPath}`, 'salmon');
        // match load function and a fallback function
        switch (reqPathSuffix) {
            case 'load':
                return pluginToolimagedownscaler.load(req, res);
            default:
                return pluginToolimagedownscaler.fallback(req, res);
        }
    },

    load: (req, res) => {
        // Get tool html file
        const pathRoot = process.cwd();
        const staticDir = 'static';
        const toolDir = 'tool';
        const imagedownscalerDir = 'imagedownscaler';
        const toolHtml = 'ui.html';
        const fullPath = `${pathRoot}/${staticDir}/${toolDir}/${imagedownscalerDir}/${toolHtml}`;

        // Send the file
        res.sendFile(fullPath);
    },

    fallback: (req, res) => {
        logColor('Fallback function called', 'salmon');
        res.send('Fallback function called');
    }
};

export default pluginToolimagedownscaler;
