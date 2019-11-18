import getPort from 'get-port';

import out from './util/out';
import createServer from './server';
import setup from './commands/setup';

import settings from './config/settings';

const { dev, defaultPort } = settings;

if (dev) {
  out.setLevel('verbose');
}

const startServer = async (): Promise<void> => {
  const port = dev ? (await getPort({ port: defaultPort })) : 80;
  createServer(port).then((server): void => {
    if (dev) {
      setup(server);
    }
  });
};

startServer();
