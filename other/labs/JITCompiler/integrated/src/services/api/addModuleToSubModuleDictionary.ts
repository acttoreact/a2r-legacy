import path from 'path';
import { pathToSubModuleDictionary } from './api';

/**
 * Add module tu sub-module dictionary (`pathToSubModuleDictionary`)
 * @param {string} folderPath
 * @param {string} moduleName
 * @param {string} prefix
 */
const addModuleToSubModuleDictionary = (
  folderPath: string,
  moduleName: string,
  prefix: string,
): void => {
  const prefixes = prefix.split('.').reverse();
  let modulePath = path.normalize(folderPath);
  for (let i = 0, l = prefixes.length; i < l; i += 1) {
    if (!pathToSubModuleDictionary[modulePath]) {
      pathToSubModuleDictionary[modulePath] = [];
    }
    pathToSubModuleDictionary[modulePath].push(moduleName);
    modulePath = modulePath.replace(
      new RegExp(`${path.sep}${prefixes[i]}$`),
      '',
    );
  }
};

export default addModuleToSubModuleDictionary;