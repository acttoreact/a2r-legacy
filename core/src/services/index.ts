import colors from 'colors';

import watcher from './watcher';
import out from '../util/out';

const services = async (): Promise<void> => {
  out.verbose(`Starting services...`);
  try {
    await watcher();
  } catch (ex) {
    out.error(`Error in framework services: ${ex.message}`, { stack: ex.stack });
  }
  out.verbose(`Services ${colors.green('started')}`);
};

export default services;
