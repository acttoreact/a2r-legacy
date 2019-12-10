import colors from 'colors';

import watcher from './watcher';
import out from '../util/out';
import getApiWatcherOptions from './watcher/apiOptions';
import getModelWatcherOptions from './watcher/modelOptions';

const services = async (): Promise<void> => {
  out.verbose(`Starting services...`);
  try {
    const modelWatcherOptions = await getModelWatcherOptions();
    await watcher(modelWatcherOptions);
    const apiWatcherOptions = await getApiWatcherOptions();
    await watcher(apiWatcherOptions);
  } catch (ex) {
    out.error(`Error in framework services: ${ex.message}`, { stack: ex.stack });
  }
  out.verbose(`Services ${colors.green('started')}`);
};

export default services;
