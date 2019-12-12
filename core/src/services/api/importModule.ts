import path from 'path';

import out from '../../util/out';
import { api as apiInLogs, fullPath, fileName as fileNameOnLogs } from '../../util/terminalStyles';
import { APIStructure } from '../../model/api';
import api, { apiPathKey, moduleToPathDictionary } from './api';
import addModule from './addModule';
import { CompilerFileInfo } from '../compiler';

// apiPath: /Users/miguel/Proyectos/test-virgin-a2r/node_modules/a2r/server/api
// modulePath: /Users/miguel/Proyectos/test-virgin-a2r/node_modules/a2r/server/api/ping.js
// folderPath: server/api/

/**
 * Import a single module to API from a single path
 *
 * @param {string} modulePath Module path (file path)
 * @returns {Promise<APIStructure>} The resulting APIStructure object
 */
const importModule = async (
  modulePath: string,
  compilerInfo: CompilerFileInfo,
): Promise<APIStructure> => {
  const apiPath = moduleToPathDictionary[apiPathKey];
  const relativePath = path.relative(apiPath, modulePath);
  const { name, ext, dir: prefix } = path.parse(relativePath);
  const fileName = `${name}${ext}`;
  if (fileName) {
    const folderPath = modulePath.replace(new RegExp(`${fileName}$`), '');
    out.verbose(
      `Importing module with folderPath ${fullPath(folderPath)}, fileName ${fileNameOnLogs(
        fileName,
      )} and prefix "${prefix}"`,
    );
    await addModule(
      folderPath,
      fileName,
      fileName.replace(/\.js$/, ''),
      compilerInfo,
      prefix,
    );
  } else {
    out.error(`${apiInLogs}: Wrong path given when trying to import ${fullPath(modulePath)}`);
  }
  return api;
};

export default importModule;
