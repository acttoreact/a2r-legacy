import getPort from 'get-port';

import settings from '../config/settings';

/**
 * Returns application port.
 * If working in development, will try to use `defaultPort` from settings.
 * If not working in development, will return 80.
 * @returns {Promise<number>}
 */
const main = async (): Promise<number> => {
  if (!settings.dev) {
    return 80;
  }
  const port = await getPort({ port: settings.defaultPort });
  return port;
};

export default main;
