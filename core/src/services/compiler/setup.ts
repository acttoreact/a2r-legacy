import path from 'path';
import fs from '../../util/fs';
import getProjectPath from '../../tools/getProjectPath';
import getFrameworkPath from '../../tools/getFrameworkPath';

const setup = async (): Promise<void> => {
  const projectPath = await getProjectPath();
  const frameworkPath = await getFrameworkPath();
  const typesDestFolder = path.resolve(projectPath, 'node_modules', '@types', 'a2r');
  await fs.ensureDir(typesDestFolder);
  const typesFile = path.resolve(frameworkPath, 'types', 'index.d.ts');
  const typesDestFile = path.resolve(typesDestFolder, 'index.d.ts');
  await fs.copyFile(typesFile, typesDestFile);
};

export default setup;
