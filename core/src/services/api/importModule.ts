import path from 'path';

import out from '../../util/out';
import { api as apiInLogs, fullPath } from '../../util/terminalStyles';
import api, { APIStructure, apiPathKey, moduleToPathDictionary } from './api';
import addModule from './addModule';
import { CompilerFileInfo } from '../compiler';

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
    await addModule(
      folderPath,
      fileName,
      fileName.replace(/\.js$/, ''),
      relativePath,
      compilerInfo,
      prefix,
    );
  } else {
    out.error(
      `${apiInLogs}: Wrong path given when trying to import ${fullPath(modulePath)}`,
    );
  }
  return api;
};

export default importModule;
