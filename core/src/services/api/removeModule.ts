import colors from 'colors';
import out from '../../util/out';
import removeModuleFromSubModuleDictionary from './removeModuleFromSubModuleDictionary';
import api, { moduleToPathDictionary, pathToModuleDictionary } from './api';
import buildClientApi from '../client-api';

/**
 * Remove a single module from API
 * @param {string} moduleName Module name (file name without extension)
 * @returns {Promise<void>}
 */
const removeModuleFromApi = async (moduleName: string): Promise<void> => {
  const mod = api[moduleName];
  if (mod) {
    if (mod.dispose) {
      out.verbose(
        `Module ${colors.italic(moduleName)} has dispose method. Calling it...`,
      );
      await mod.dispose();
      out.verbose(
        `Disposal method done for module ${colors.italic(moduleName)}`,
      );
    }
    delete api[moduleName];
    const modulePath = moduleToPathDictionary[moduleName];
    delete moduleToPathDictionary[moduleName];
    delete pathToModuleDictionary[modulePath];
    removeModuleFromSubModuleDictionary(moduleName);
    await buildClientApi();
    out.verbose(
      `API module ${colors.italic(moduleName)} has been ${colors.green.bold(
        'successfully',
      )} disposed`,
    );
  } else {
    out.warn(`Couldn't find any module for name ${colors.italic(moduleName)}`);
  }
};

export default removeModuleFromApi;
