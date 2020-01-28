import getApiWatcherOptions from '../api/getWatcherOptions';
import getModelWatcherOptions from '../model/getWatcherOptions';
import getDataWatcherOptions from '../data/getWatcherOptions';
import watchFolder from './watchFolder';

/**
 * Initializes needed watcher(s)
 * @returns {Promise<void>}
 */
const init = async (): Promise<void> => {
  const modelWatcherOptions = await getModelWatcherOptions();
  await watchFolder(modelWatcherOptions);
  const dataWatcherOptions = await getDataWatcherOptions();
  await watchFolder(dataWatcherOptions);
  const apiWatcherOptions = await getApiWatcherOptions();
  await watchFolder(apiWatcherOptions);
};

export default init;
