import path from 'path';
import colors from 'colors';

import fs from '../../util/fs';
import out from '../../util/out';
import { api as apiInLogs, fullPath } from '../../util/terminalStyles';
// import addModule from './addModule';
import api, {
  APIStructure,
  apiPathKey,
  moduleToPathDictionary,
} from './api';
import addCommandsFromPath from '../commands/addCommandsFromPath';

/**
 * Import modules and sub-modules from a given path
 *
 * @param {string} folder Path to process
 * @param {string} [prefix] Prefix for method key
 */
// const importModules = async (
//   folder: string,
//   apiPath: string,
//   prefix?: string,
// ): Promise<APIStructure> => {
//   const folderPath = path.normalize(folder);
//   out.verbose(`${apiInLogs}: Importing modules from ${fullPath(folderPath)}`);
//   const contents = await fs.readDir(folderPath, { withFileTypes: true });
//   const methods: string[] = [];
//   const subModules: string[] = [];

//   await Promise.all(
//     contents.map(
//       async (content): Promise<void> => {
//         const { name: fileName } = content;
//         if (content.isDirectory()) {
//           subModules.push(fileName);
//         } else {
//           const extension = path.extname(fileName);
//           if (extension.toLowerCase() === '.js') {
//             out.verbose(`${apiInLogs}: Processing content ${fileName}`);
//             const cleanName = path.basename(fileName, extension);
//             methods.push(cleanName);
//             addModule(folderPath, fileName, cleanName, prefix);
//           }
//         }
//       },
//     ),
//   );

//   await Promise.all(
//     subModules.map(
//       async (name): Promise<void> => {
//         const modulePrefix: string = [prefix, name]
//           .filter((s): boolean => !!s)
//           .join('.');
//         if (methods.indexOf(name) === -1) {
//           const pathName = path.resolve(folderPath, name);
//           await importModules(pathName, modulePrefix);
//         } else {
//           out.error(
//             `${apiInLogs}: Module ${colors.yellow(
//               modulePrefix,
//             )} can't be processed. There's already a method with that name`,
//           );
//         }
//       },
//     ),
//   );

//   return api;
// };

/**
 * Build API structure from a given path
 *
 * Will import recursively modules and sub-modules starting from the given path building API
 * structure based on folders and files names
 *
 * @param {string} mainPath Main API path to process
 * @returns {Promise<APIStructure>} The resulting APIStructure object
 */
export const setupApi = async (mainPath: string): Promise<APIStructure> => {
  const apiPath = path.normalize(path.resolve(mainPath, 'api'));
  out.verbose(`${apiInLogs}: Path is ${fullPath(apiPath)}`);
  await fs.ensureDir(apiPath);

  // out.verbose(`${apiInLogs}: Building...`);
  moduleToPathDictionary[apiPathKey] = apiPath;
  // await importModules(apiPath, apiPath);

  out.info(`${apiInLogs}: Built ${colors.green.bold('OK')}`);
  const commandsPath = path.resolve(__dirname, 'commands');
  await addCommandsFromPath(commandsPath);

  return api;
};

export * from './api';

export default api;
