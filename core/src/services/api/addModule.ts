import path from 'path';
import colors from 'colors';

import out from '../../util/out';
import { api as apiInLogs, fullPath } from '../../util/terminalStyles';
import addModuleToSubModuleDictionary from './addModuleToSubModuleDictionary';
import api, { pathToModuleDictionary, moduleToPathDictionary } from './api';

/**
 * Adds a single module to API
 *
 * @param {string} folderPath Path where module is
 * @param {string} fileName Module file name
 * @param {string} cleanName Like `fileName` without extension
 * @param {string} [prefix] Module prefix
 * @returns {Promise<void>}
 */
const addModuleToApi = async (
  folderPath: string,
  fileName: string,
  cleanName: string,
  prefix?: string,
): Promise<void> => {
  const moduleName: string = [prefix, cleanName]
    .filter((s): boolean => !!s)
    .join('.');
  const pathName = path.normalize(path.resolve(folderPath, fileName));
  await import(pathName)
    .then((mod): void => {
      if (!mod.default) {
        out.warn(
          `${apiInLogs}: Module imported from ${fullPath(
            pathName,
          )} doesn't contain a default property`,
        );
      }
      api[moduleName] = mod;
      pathToModuleDictionary[pathName] = moduleName;
      out.verbose(`Added module ${colors.italic(moduleName)} from path ${fullPath(pathName)}`);
      moduleToPathDictionary[moduleName] = pathName;
      if (prefix) {
        addModuleToSubModuleDictionary(folderPath, moduleName, prefix);
      }
    })
    .catch((ex): void => {
      out.error(
        `${apiInLogs}: Error importing module ${fullPath(pathName)}: ${
          ex.message
        }\n${ex.stack}`,
      );
    });
};

export default addModuleToApi;
