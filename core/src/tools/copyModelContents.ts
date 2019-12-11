import fsModule from 'fs';
import path from 'path';

import out from '../util/out';
import fs from '../util/fs';
import { fullPath, fileName } from '../util/terminalStyles';

const modelExtensionRegExp = /\.template$/i;

const filesToIgnore = ['.gitkeep'];

/**
 * Copies contents recursively from `fromPath` to `destPath`
 * @param {string} fromPath Source path
 * @param {string} destPath Destination path
 * @param {string} [relativePath=''] Relative path
 */
const copyContents = async (
  fromPath: string,
  destPath: string,
  relativePath: string = '',
): Promise<void> => {
  const contentsPath = path.resolve(fromPath, relativePath);
  out.verbose(`Processing path ${fullPath(contentsPath)}`);
  await fs.ensureDir(destPath);
  const contents = await fs.readDir(contentsPath, { withFileTypes: true });
  await Promise.all(
    contents.map(
      async (pathInfo: fsModule.Dirent): Promise<void> => {
        const { name: relPath } = pathInfo;
        const fullRelPath = path.join(relativePath, relPath);
        const sourcePath = path.resolve(fromPath, fullRelPath);
        const targetPath = path
          .resolve(destPath, fullRelPath)
          .replace(modelExtensionRegExp, '');

        if (pathInfo.isDirectory()) {
          out.verbose(`Path ${fileName(relPath)} is directory`);
          await fs.ensureDir(targetPath);
          await copyContents(fromPath, destPath, fullRelPath);
        } else if (filesToIgnore.indexOf(relPath) === -1) {
          out.verbose(
            `Copying ${fullPath(sourcePath)} to ${fullPath(targetPath)}`,
          );
          await fs.copyFile(sourcePath, targetPath);
        }
      },
    ),
  );
};

/**
 * Copies contents from `/model` folder to base project folder
 * @param {string} modelPath Model folder path
 * @param {string} destPath Base target project folder
 */
const copyModelContents = async (
  modelPath: string,
  destPath: string,
): Promise<void> => {
  return copyContents(modelPath, destPath);
}

export default copyModelContents;
