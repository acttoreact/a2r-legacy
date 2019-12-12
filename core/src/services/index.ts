import colors from 'colors';

import setupClientApi from './client';
import watcher from './watcher';
import out from '../util/out';

/**
 * Starts A2R needed services
 * @returns {Promise<void>}
 */
const services = async (port: number): Promise<void> => {
  out.verbose(`Starting services...`);
  try {
    await setupClientApi(port);
    await watcher();
  } catch (ex) {
    out.error(`Error in framework services: ${ex.message}`, { stack: ex.stack });
  }
  out.verbose(`Services ${colors.green('started')}`);
};

export default services;
