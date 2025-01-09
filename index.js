import { logLineHeader } from './src/utils/log.js';
import createServer from './src/server.js';

(async () => {
    logLineHeader('Plugin Setup', 50, 'cyan');
    // Create the server instance
    const server = createServer();
    // Add plugins in the desired order
    await server.addPlugin('pluginToolFallbackCreator.js');
    await server.addPlugin('pluginToolDownScalar.js');
    await server.addPlugin('pluginLanding.js');
    await server.addPlugin('pluginStatics.js');

    // Log messages
    logLineHeader('Server Start', 50, 'cyan');

    // Run the server on port 3000
    server.run(3000);
})();
