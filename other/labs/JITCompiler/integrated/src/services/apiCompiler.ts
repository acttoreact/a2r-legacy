import colors from 'colors';
import path from 'path';
import out from '../util/out';
import watcher from './watcher';
import compiler from './tsCompiler/index';
import { buildApi } from './api';
import fs from '../util/fs';

out.setLevel('verbose');

const sourcePathDir = path.join(__dirname, '../../../test/api');
const destPathDir = path.join(__dirname, '../../../test/server');
const newDestPathDir = path.join(__dirname, '../../../test/server/api2');
const configPath = path.join(__dirname, '../../../test/tsconfig-api.json');

const apiCompiler = async (): Promise<void> => {
  out.verbose(
    `Compiling A2R API from ${colors.yellow(sourcePathDir)} to ${colors.yellow(
      destPathDir,
    )}`,
  );
  const a2rPath = path.join(destPathDir, '../../');
  const existsA2RPath = await fs.exists(a2rPath);
  if (!existsA2RPath) {
    await fs.mkDir(a2rPath);
  }
  const apiPath = path.join(destPathDir, '../');
  const existsAPIPath = await fs.exists(apiPath);
  if (!existsAPIPath) {
    await fs.mkDir(apiPath);
  }
  await compiler(sourcePathDir, destPathDir);

  watcher(sourcePathDir, newDestPathDir, configPath);

  // const api = await buildApi(destPathDir);
  // console.log(api);
};

export default apiCompiler;
