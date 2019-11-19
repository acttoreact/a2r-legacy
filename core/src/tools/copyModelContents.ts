import originalFs from 'fs';
import path from 'path';
import colors from 'colors';

import out from '../util/out';
import fs from '../util/fs';

const modelExtensionRegExp = /\.model$/i;

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
  out.verbose(`Processing path "${contentsPath}"`);
  await fs.ensureDir(destPath);
  const contents = await fs.readDir(contentsPath, { withFileTypes: true });
  await Promise.all(
    contents.map(
      async (pathInfo: originalFs.Dirent): Promise<void> => {
        const { name: relPath } = pathInfo;
        const fullRelPath = path.resolve(relativePath, relPath);
        const sourcePath = path.resolve(fromPath, fullRelPath);
        const targetPath = path
          .resolve(destPath, fullRelPath)
          .replace(modelExtensionRegExp, '');

        if (pathInfo.isDirectory()) {
          out.verbose(`Path "${contentsPath}" is directory`);
          await copyContents(fromPath, destPath, fullRelPath);
        } else {
          out.verbose(
            `Copying ${colors.cyan(sourcePath)}" to "${colors.green(
              targetPath,
            )}"`,
          );
          await fs.copyFile(sourcePath, targetPath);
        }

        out.verbose(`Full source path: ${sourcePath}`);
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
