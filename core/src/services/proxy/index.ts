import path from 'path';

import fs from '../../util/fs';
import getFrameworkPath from '../../tools/getFrameworkPath';
import buildSocketProvider from './buildSocketProvider';
import buildDataProvider from './buildDataProvider';

const setupClientApi = async (port: number): Promise<void> => {
  const frameworkPath = await getFrameworkPath();
  const clientApiPath = path.resolve(frameworkPath, 'api');
  await fs.ensureDir(clientApiPath);
  await buildSocketProvider(clientApiPath, port);
  await buildDataProvider(clientApiPath);
};

export * from '../../model/client';
export default setupClientApi;
