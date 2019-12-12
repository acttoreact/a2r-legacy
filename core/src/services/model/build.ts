import path from 'path';

import fs from '../../util/fs';
import out from '../../util/out';
import getProjectPath from '../../tools/getProjectPath';
import getFrameworkPath from '../../tools/getFrameworkPath';
import getImports from './getImports';
import { fullPath } from '../../util/terminalStyles';

import settings from '../../config/settings';

const { modelPath } = settings;

const build = async (): Promise<void> => {
  out.verbose('Building Model');
  const projectPath = await getProjectPath();
  const modelProjectPath = path.resolve(projectPath, modelPath);
  out.verbose(`Model project path: ${fullPath(modelProjectPath)}`);
  const frameworkPath = await getFrameworkPath();
  const modelFrameworkPath = path.resolve(frameworkPath, modelPath);
  const mainFilePath = path.resolve(modelFrameworkPath, 'index.ts');
  const imports = await getImports(modelProjectPath, projectPath);
  const content = imports.map((imp): string => `export * from '${imp}';`).join('\n');
  out.verbose(`Writing to file ${fullPath(mainFilePath)} the following content:\n${content}`);
  await fs.writeFile(mainFilePath, content);
  delete require.cache[mainFilePath];
};

export default build;
