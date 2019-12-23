import path from 'path';

import fs from '../util/fs';
import getProjectPath from './getProjectPath';

const touchTsConfig = async (): Promise<void> => {
  const projectPath = await getProjectPath();
  const tsConfigPath = path.resolve(projectPath, 'tsconfig.json');
  const tsConfigEslintPath = path.resolve(projectPath, 'tsconfig.eslint.json');
  await fs.touchFile(tsConfigPath);
  await fs.touchFile(tsConfigEslintPath);
};

export default touchTsConfig;
