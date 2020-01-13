import path from 'path';
import colors from 'colors';

import fs from '../../util/fs';
import out from '../../util/out';
import { api as apiInLogs, fullPath } from '../../util/terminalStyles';
import api, { apiPathKey, moduleToPathDictionary } from './api';
import { APIModule } from '../../model/api';
import addCommandsFromPath from '../commands/addCommandsFromPath';

export const getModule = (methodName: string): APIModule => {
  return api[methodName];
}

/**
 * Setup API needed structure and commands
 *
 * @param {string} mainPath Main API path
 */
export const setupApi = async (mainPath: string): Promise<void> => {
  const apiPath = path.normalize(path.resolve(mainPath, 'api'));
  out.verbose(`${apiInLogs}: Path is ${fullPath(apiPath)}`);
  await fs.ensureDir(apiPath);
  moduleToPathDictionary[apiPathKey] = apiPath;
  out.info(`${apiInLogs}: Built ${colors.green.bold('OK')}`);
  const commandsPath = path.resolve(__dirname, 'commands');
  await addCommandsFromPath(commandsPath);
};

export * from '../../model/api';
export default api;
