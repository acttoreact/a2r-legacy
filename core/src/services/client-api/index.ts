import path from 'path';

import fs from '../../util/fs';
import getFrameworkPath from '../../tools/getFrameworkPath';
import build from './build';
import getPath from './getPath';

const buildClientApi = async(): Promise<void> => {
  const frameworkPath = await getFrameworkPath();
  const clientPath = path.resolve(frameworkPath, 'client');
  await fs.ensureDir(clientPath);
  const mainFilePath = path.resolve(clientPath, 'api.ts');
  await build(mainFilePath);
  const apiModulePath = await getPath();
  // Copy files
  // Compile?
  // Build main file: imports, export default like an object
  // Build package.json and stuff
  // delete require.cache[path] (indexOf('/api'))
  // Copy contents to node_modules/api
};

export * from './client-api';

export default buildClientApi;
