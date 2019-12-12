import path from 'path';

import fs from '../../util/fs';
import getFrameworkPath from '../../tools/getFrameworkPath';
import build from './build';

const buildClientApi = async(): Promise<void> => {
  const frameworkPath = await getFrameworkPath();
  const clientPath = path.resolve(frameworkPath, 'api');
  await fs.ensureDir(clientPath);
  const mainFilePath = path.resolve(clientPath, 'index.ts');
  await build(mainFilePath);
};

export * from '../../model/client';
export default buildClientApi;
