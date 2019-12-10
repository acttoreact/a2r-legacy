import path from 'path';
import colors from 'colors';

import out from '../../util/out';
import { api as apiInLogs, fullPath } from '../../util/terminalStyles';
import { APIStructure } from '../../model/api';
import api, {
  pathToModuleDictionary,
  moduleToPathDictionary,
  apiPathKey,
} from './api';
import importModule from './importModule';
import { CompilerFileInfo } from '../compiler';

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
const updateModule = async (
  modulePath: string,
  compilerInfo: CompilerFileInfo,
): Promise<APIStructure> => {
  const normalizedPath = path.normalize(modulePath);
  const moduleName = pathToModuleDictionary[normalizedPath];
  out.verbose(`updateModule: ${fullPath(normalizedPath)} => ${moduleName}`);
  if (moduleName) {
    const mod = api[moduleName];
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
            const apiPath = moduleToPathDictionary[apiPathKey];
            const relativePath = path.relative(apiPath, modulePath);
            api[moduleName] = {
              ...newMod,
              relativePath,
              compilerInfo,
            };
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
      out.warn(`${apiInLogs}: Couldn't find any module for name ${colors.italic(moduleName)}`);
    }
  } else {
    await importModule(modulePath, compilerInfo);
  }
  return api;
};

export default updateModule;
