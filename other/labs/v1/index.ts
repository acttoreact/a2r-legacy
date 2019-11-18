import open from 'open';

import out from './util/out';
import getPort from './services/getPort';
// import startServices from './services';
import createServer from './server';

import settings from './config/settings';

if (settings.dev) {
  out.setLevel('verbose');
}

const startServer = async(): Promise<void> => {
  // Services (API, watcher...)
  // await startServices();
  const port = await getPort();

  createServer(settings.dev, port).then((server): void => {
    server.server.on('listening', (): void => {
      if (settings.dev && process.env.OPEN) {
        open(`http://localhost:${port}/`);
      }
    });
  });
};

startServer();