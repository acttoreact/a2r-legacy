import { pathToSubModuleDictionary } from './api';

/**
 * Remove module from sub-module dictionary (`pathToSubModuleDictionary`)
 * @param {string} moduleName
 */
const removeModuleFromSubModuleDictionary = (moduleName: string): void => {
  const entries = Object.entries(pathToSubModuleDictionary);
  for (let i = 0, l = entries.length; i < l; i += 1) {
    const [modulePath, moduleNames] = entries[i];
    pathToSubModuleDictionary[modulePath] = moduleNames.filter(
      (n): boolean => n !== moduleName,
    );
  }
};

export default removeModuleFromSubModuleDictionary;
