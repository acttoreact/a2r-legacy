import path from 'path';
import colors from 'colors';
import out from '../../util/out';
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
      api[moduleName] = mod;
      pathToModuleDictionary[pathName] = moduleName;
      moduleToPathDictionary[moduleName] = pathName;
      if (prefix) {
        addModuleToSubModuleDictionary(folderPath, moduleName, prefix);
      }
    })
    .catch((ex): void => {
      out.error(`Error importing module ${colors.yellow(pathName)}`);
      out.error(ex.stack);
    });
};

export default addModuleToApi;
