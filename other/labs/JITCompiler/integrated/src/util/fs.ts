import fs from 'fs';
import rimraf from 'rimraf';
import util from 'util';

const ensureDir = async (path: string): Promise<void> => {
  await new Promise((resolve, reject): void => {
    fs.mkdir(path, (err: NodeJS.ErrnoException | null): void => {
      if (err && err.code !== 'EEXIST') {
        reject(err);
      } else {
        resolve();
      }
    });
  })
};

export default {
  ensureDir,
  readFile: util.promisify(fs.readFile),
  readDir: util.promisify(fs.readdir),
  lStat: util.promisify(fs.lstat),
  mkDir: util.promisify(fs.mkdir),
  copyFile: util.promisify(fs.copyFile),
  writeFile: util.promisify(fs.writeFile),
  exists: util.promisify(fs.exists),
  unlink: util.promisify(fs.unlink),
  rmDir: util.promisify(fs.rmdir),
  rimraf: util.promisify(rimraf),
};
