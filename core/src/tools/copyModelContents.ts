import fsModule from 'fs';
import path from 'path';

import out from '../util/out';
import fs from '../util/fs';
import { fullPath, fileName } from '../util/terminalStyles';

const templateExtensionRegExp = /\.template$/i;

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
  hard: boolean,
  relativePath = '',
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
          .replace(templateExtensionRegExp, '');

        if (pathInfo.isDirectory()) {
          out.verbose(`Path ${fileName(relPath)} is directory`);
          await fs.ensureDir(targetPath);
          await copyContents(fromPath, destPath, hard, fullRelPath);
        } else if (!filesToIgnore.includes(relPath)) {
          const write = hard || !(await fs.exists(targetPath));
          if (write) {
            out.verbose(
              `Copying ${fullPath(sourcePath)} to ${fullPath(targetPath)}`,
            );
            await fs.copyFile(sourcePath, targetPath);
          }
        }
      },
    ),
  );
};

/**
 * Copies contents from `/template` folder to base project folder
 * @param {string} templatePath Template folder path
 * @param {string} destPath Base target project folder
 */
const copyTemplateContents = async (
  templatePath: string,
  destPath: string,
  hard = false,
): Promise<void> => {
  return copyContents(templatePath, destPath, hard);
}

export default copyTemplateContents;
