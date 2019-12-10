import path from 'path';

import { APIStructure } from '../../model/api';
import out from '../../util/out';
import { api as apiInLogs, fullPath } from '../../util/terminalStyles';
import api, {
  pathToModuleDictionary,
  pathToSubModuleDictionary,
  moduleToPathDictionary,
} from './api';
import removeModule from './removeModule';
import buildClientApi from '../client';

/**
 * Dispose an existing API module from a given path
 *
 * Will check for an existing module coming from the given path.
 * If an API module is found, it will be disposed and module `dispose` method will be called if
 * exists.
 *
 * @param {string} modulePath
 * @returns {Promise<APIStructure>} The resulting APIStructure object
 */
const disposeModule = async (modulePath: string): Promise<APIStructure> => {
  const normalizedPath = path.normalize(modulePath);
  const moduleName = pathToModuleDictionary[normalizedPath];
  const modulesNames = pathToSubModuleDictionary[normalizedPath];
  if (moduleName) {
    delete require.cache[normalizedPath];
    await removeModule(moduleName);
    await buildClientApi();
  } else if (modulesNames) {
    await Promise.all(
      modulesNames.map(
        (modName): Promise<void> => {
          const modPath = moduleToPathDictionary[modName];
          if (modPath) {
            delete require.cache[modPath];
          }
          return removeModule(modName);
        },
      ),
    );
    await buildClientApi();
  } else {
    out.warn(`${apiInLogs}: Couldn't find any module name for path ${fullPath(modulePath)}`);
  }
  return api;
};

export default disposeModule;
