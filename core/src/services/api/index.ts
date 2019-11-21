import path from 'path';
import colors from 'colors';

import fs from '../../util/fs';
import out from '../../util/out';
import { api as apiInLogs, fullPath } from '../../util/terminalStyles';
import addModuleToApi from './addModuleToApi';
import removeModuleFromApi from './removeModuleFromApi';
import api, {
  APIStructure,
  APIModule,
  apiPathKey,
  pathToModuleDictionary,
  pathToSubModuleDictionary,
  moduleToPathDictionary,
} from './api';
import addCommandsFromPath from '../commands/addCommandsFromPath'

/**
 * Update an existing API module from a given path
 *
 * Will check for an existing module coming from the given path.
 * If an API module is found, it will be disposed (module `dispose` method will be called if exists)
 * and then replaced by the new module.
 *
 * @param {string} modulePath Absolute file path for module
 * @returns {Promise<APIStructure>} The resulting APIStructure object
 */
export const updateModule = async (
  modulePath: string,
): Promise<APIStructure> => {
  const normalizedPath = path.normalize(modulePath);
  const moduleName = pathToModuleDictionary[normalizedPath];
  if (moduleName) {
    const mod = api[moduleName] as APIModule;
    if (mod) {
      delete require.cache[normalizedPath];
      await import(normalizedPath)
        .then(
          async (newMod): Promise<void> => {
            if (mod.dispose) {
              out.verbose(
                `${apiInLogs}: Module ${colors.italic(
                  moduleName,
                )} has dispose method. Calling it...`,
              );
              await mod.dispose();
              out.verbose(
                `${apiInLogs}: Disposal method done for module ${colors.italic(moduleName)}`,
              );
            }
            delete api[moduleName];
            api[moduleName] = newMod;
          },
        )
        .catch((ex): void => {
          out.error(
            `${apiInLogs}: Error importing module ${fullPath(normalizedPath)} for update: ${
              ex.message
            }\n${ex.stack}`,
          );
        });
      out.verbose(
        `${apiInLogs}: Module ${colors.italic(moduleName)} has been ${colors.green.bold(
          'successfully',
        )} updated`,
      );
    } else {
      out.warn(
        `${apiInLogs}: Couldn't find any module for name ${colors.italic(moduleName)}`,
      );
    }
  } else {
    out.warn(
      `${apiInLogs}: Couldn't find any module or sub-module name for path ${fullPath(
        normalizedPath,
      )}`,
    );
  }
  return api;
};

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
export const disposeModule = async (
  modulePath: string,
): Promise<APIStructure> => {
  const normalizedPath = path.normalize(modulePath);
  const moduleName = pathToModuleDictionary[normalizedPath];
  const modulesNames = pathToSubModuleDictionary[normalizedPath];
  if (moduleName) {
    delete require.cache[normalizedPath];
    await removeModuleFromApi(moduleName);
  } else if (modulesNames) {
    await Promise.all(
      modulesNames.map(
        (modName): Promise<void> => {
          const modPath = moduleToPathDictionary[modName];
          if (modPath) {
            delete require.cache[modPath];
          }
          return removeModuleFromApi(modName)
        },
      ),
    );
  } else {
    out.warn(
      `${apiInLogs}: Couldn't find any module name for path ${fullPath(modulePath)}`,
    );
  }
  return api;
};

/**
 * Import a single module to API from a single path
 *
 * @param {string} modulePath Module path (file path)
 * @returns {Promise<APIStructure>} The resulting APIStructure object
 */
export const importModule = async (
  modulePath: string,
): Promise<APIStructure> => {
  const apiPath = moduleToPathDictionary[apiPathKey];
  const relativePath = path.relative(apiPath, modulePath);
  const pathLevels = relativePath.split(path.sep);
  const fileName = pathLevels.pop();
  if (fileName) {
    const prefix = pathLevels.join('.');
    const folderPath = modulePath.replace(new RegExp(`${fileName}$`), '');
    await addModuleToApi(
      folderPath,
      fileName,
      fileName.replace(/\.js$/, ''),
      prefix,
    );
  } else {
    out.error(
      `${apiInLogs}: Wrong path given when trying to import ${fullPath(modulePath)}`,
    );
  }
  return api;
};

/**
 * Import modules and sub-modules from a given path
 *
 * @param {string} folder Path to process
 * @param {string} [prefix] Prefix for method key
 */
const importModules = async (
  folder: string,
  prefix?: string,
): Promise<APIStructure> => {
  const folderPath = path.normalize(folder);
  out.verbose(`${apiInLogs}: Importing modules from ${fullPath(folderPath)}`);
  const contents = await fs.readDir(folderPath, { withFileTypes: true });
  const methods: string[] = [];
  const subModules: string[] = [];

  await Promise.all(
    contents.map(
      async (content): Promise<void> => {
        const { name: fileName } = content;
        if (content.isDirectory()) {
          subModules.push(fileName);
        } else {
          const extension = path.extname(fileName);
          if (extension.toLowerCase() === '.js') {
            out.verbose(`${apiInLogs}: Processing content ${fileName}`);
            const cleanName = path.basename(fileName, extension);
            methods.push(cleanName);
            addModuleToApi(folderPath, fileName, cleanName, prefix);
          }
        }
      },
    ),
  );

  await Promise.all(
    subModules.map(
      async (name): Promise<void> => {
        const modulePrefix: string = [prefix, name]
          .filter((s): boolean => !!s)
          .join('.');
        if (methods.indexOf(name) === -1) {
          const pathName = path.resolve(folderPath, name);
          await importModules(pathName, modulePrefix);
        } else {
          out.error(
            `${apiInLogs}: Module ${colors.yellow(
              modulePrefix,
            )} can't be processed. There's already a method with that name`,
          );
        }
      },
    ),
  );

  return api;
};

/**
 * Build API structure from a given path
 *
 * Will import recursively modules and sub-modules starting from the given path building API
 * structure based on folders and files names
 *
 * @param {string} mainPath Main API path to process
 * @returns {Promise<APIStructure>} The resulting APIStructure object
 */
export const buildApi = async (mainPath: string): Promise<APIStructure> => {
  const apiPath = path.normalize(path.resolve(mainPath, 'api'));
  const exists = await fs.exists(apiPath);

  if (exists) {
    out.verbose(`${apiInLogs}: Building...`);
    moduleToPathDictionary[apiPathKey] = apiPath;
    await importModules(apiPath);
    out.info(`${apiInLogs}: Built ${colors.green.bold('OK')}`);
    const commandsPath = path.resolve(__dirname, 'commands');
    await addCommandsFromPath(commandsPath);
  } else {
    out.error(`${apiInLogs}: Main path not found: ${fullPath(apiPath)}`);
  }

  return api;
};

export default api;
