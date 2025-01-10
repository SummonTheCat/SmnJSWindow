import { log } from "console";
import { logColor } from "../utils/log.js";
import fs from 'fs';

const pluginToolFallbackCreator = {
    pluginName: 'PluginToolFallbackCreator',
    pluginInit: () => {},
    pluginCatch: (reqPath) => {
        return reqPath.startsWith('/tool/fallbackcreator/');
    },
    pluginServe: (req, res) => {
        const reqPath = req.path;
        const reqPathSuffix = reqPath.split('/').pop();
        logColor(`Request: ${reqPath}`, 'salmon');
        // match load function and a fallback function
        switch (reqPathSuffix) {
            case 'load':
                return pluginToolFallbackCreator.load(req, res);
            default:
                return pluginToolFallbackCreator.fallback(req, res);
        }
    },

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
        const fullPathJs = `${pathRoot}/${staticDir}/${toolDir}/${fallbackCreatorDir}/${toolJs}`;
        const fullPathCss = `${pathRoot}/${staticDir}/${toolDir}/${fallbackCreatorDir}/${toolCss}`;

        // join the files
        // Get the html file
        const html = fs.readFileSync(fullPathHtml);
        const css = fs.readFileSync(fullPathCss);

        // convert the files to strings
        const htmlString = html.toString();
        const cssString = css.toString();

        // Get the js files
        // all js files in the tool's directory making sure ui.js is added last
        let jsFiles = fs.readdirSync(`${pathRoot}/${staticDir}/${toolDir}/${fallbackCreatorDir}`).filter(file => file.endsWith('.js') && file !== toolJs);
        jsFiles.push(toolJs);

        logColor(jsFiles, 'cyan');

        // read the files
        let jsString = '';
        jsFiles.forEach(file => {
            const js = fs.readFileSync(`${pathRoot}/${staticDir}/${toolDir}/${fallbackCreatorDir}/${file}`);
            jsString += js.toString();
        });

        // TEMP write the full js string to a file
        fs.writeFileSync(`${pathRoot}/${staticDir}/${toolDir}/${fallbackCreatorDir}/full`, jsString);

        // join the files together, surround js and css with script and style tags
        const response = `
            ${htmlString}
            <style>${cssString}</style>
            <script>${jsString}</script>
        `;

        // send the response
        res.send(response);

    },

    fallback: (req, res) => {
        logColor('Fallback function called', 'salmon');
        res.send('Fallback function called');
    }
};

export default pluginToolFallbackCreator;
