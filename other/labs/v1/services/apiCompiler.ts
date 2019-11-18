import colors from 'colors';
import path from 'path';
import out from '../util/out';
import watcher from './watcher';
import fs from '../util/fs';

import settings from '../config/settings';

out.setLevel('verbose');

const sourcePath = path.resolve(settings.appPath, 'api');
const destPath = path.resolve(settings.appPath, 'server');

const apiCompiler = async (): Promise<void> => {
  out.verbose(
    `Compiling A2R API from ${colors.yellow(sourcePath)} to ${colors.yellow(
      destPath,
    )}`,
  );
  const a2rPath = path.join(destPath, '../../');
  const existsA2RPath = await fs.exists(a2rPath);
  if (!existsA2RPath) {
    await fs.mkDir(a2rPath);
  }
  const apiPath = path.join(destPath, '../');
  const existsAPIPath = await fs.exists(apiPath);
  if (!existsAPIPath) {
    await fs.mkDir(apiPath);
  }

  await watcher(sourcePath, destPath);
};

export default apiCompiler;
