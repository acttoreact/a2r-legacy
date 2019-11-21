import fs from 'fs';
import originalRimraf from 'rimraf';
import util from 'util';

const copyFile = util.promisify(fs.copyFile);
const exists = util.promisify(fs.exists);
const lStat = util.promisify(fs.lstat);
const mkDir = util.promisify(fs.mkdir);
const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const rimraf = util.promisify(originalRimraf);
const rmDir = util.promisify(fs.rmdir);
const unlink = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

/**
 * Ensures that given dir path exists
 *
 * @param {string} path Path to ensure
 */
const ensureDir = async (
  path: string,
  options?: fs.MakeDirectoryOptions,
): Promise<void> => {
  await new Promise((resolve, reject): void => {
    fs.mkdir(
      path,
      { ...(options || {}), recursive: true },
      (err: NodeJS.ErrnoException | null): void => {
        if (err && err.code !== 'EEXIST') {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
};

/**
 * Checks given path and returns `true` if path exists and is a file
 *
 * @param {string} path Path to check
 * @param {(fs.Stats | null | undefined)} stats Optional `fs.Stats` object
 */
const isFile = async (
  path: string,
  stats?: fs.Stats | undefined,
): Promise<boolean> => {
  const pathExists = await exists(path);
  if (pathExists) {
    if (stats) {
      return stats.isFile();
    }
    const stat = await lStat(path);
    return stat.isFile();
  }
  return false;
};

export default {
  copyFile,
  ensureDir,
  exists,
  isFile,
  lStat,
  mkDir,
  rmDir,
  rimraf,
  readDir,
  readFile,
  unlink,
  writeFile,
};
