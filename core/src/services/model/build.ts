import path from 'path';

import fs from '../../util/fs';
import out from '../../util/out';
import getProjectPath from '../../tools/getProjectPath';
import getFrameworkPath from '../../tools/getFrameworkPath';
import getModelPackagePath from './getModelPackagePath';
import getImports from './getImports';
import compileFile from '../compiler';
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
  const modelPackagePath = await getModelPackagePath();
  const imports = await getImports(modelProjectPath, projectPath);
  // const content = `${
  //   imports.map((imp, i): string => `import * as _${i} from '${imp}';export * from '${imp}';`).join('\n')
  // }\n\nexport default {${imports.map((_, i): string => `..._${i},`)}}`;
  const content = imports.map((imp): string => `export * from '${imp}';`).join('\n');
  out.verbose(`Writing to file ${fullPath(mainFilePath)} the following content:\n${content}`);
  await fs.writeFile(mainFilePath, content);
  const destPath = path.resolve(modelPackagePath, 'dist');
  out.verbose(`Compiling model to ${fullPath(destPath)}`);
  const rootFile = path.relative(projectPath, mainFilePath);
  const rootFiles = imports.reduce(
    (t, imp): string[] => {
      return [...t, `${path.relative(projectPath, path.resolve(modelFrameworkPath, imp))}.ts`];
    },
    [rootFile],
  );
  await compileFile(rootFiles, destPath, modelFrameworkPath);
  out.verbose('Model built!');
  const mainPackageFilePath = path.resolve(destPath, 'index.js');
  out.verbose(`Deleting from modules cache key "${mainPackageFilePath}"`);
  delete require.cache[mainPackageFilePath];
};

export default build;
