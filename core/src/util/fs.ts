import fs from 'fs';
import rimraf from 'rimraf';
import util from 'util';


export default {
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
