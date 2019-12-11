import path from 'path';

import fs from '../../util/fs';
import out from '../../util/out';
import getProjectPath from '../../tools/getProjectPath';
import getModelPackagePath from './getModelPackagePath';
import getFrameworkPath from '../../tools/getFrameworkPath';
import compileFile from '../compiler';
import { fullPath } from '../../util/terminalStyles';

import settings from '../../config/settings';

const { modelPath } = settings;

const getImports = async (mainPath: string, fromPath?: string, recursive: boolean = true): Promise<string[]> => {
  const res = new Array<string>();
  const contents = await fs.readDir(mainPath, { withFileTypes: true });
  const subFolders = [];
  for (let i = 0, l = contents.length; i < l; i += 1) {
    const content = contents[i];
    const contentFullPath = path.resolve(mainPath, content.name);
    if (content.isDirectory()) {
      if (recursive) {
        subFolders.push(contentFullPath);
      }
    } else if (fromPath) {
      res.push(`.${path.sep}${path.relative(fromPath, contentFullPath).replace(/\.ts$/, '')}`);
    } else {
      res.push(`.${path.sep}${contentFullPath.replace(/\.ts$/, '')}`);
    }
  }
  const subImports = await Promise.all(subFolders.map((f): Promise<string[]> => getImports(f, fromPath, recursive)));
  for (let i = 0, l = subImports.length; i < l; i += 1) {
    res.push(...subImports[i]);
  }
  return res;
}

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
  const content = `${
    imports.map((imp, i): string => `import * as _${i} from '${imp}';export * from '${imp}';`).join('\n')
  }\n\nexport default {${imports.map((_, i): string => `..._${i},`)}}`;
  out.verbose(`Writing to file ${fullPath(mainFilePath)} the following content:\n${content}`);
  await fs.writeFile(mainFilePath, content);
  const destPath = path.resolve(modelPackagePath, 'dist');
  out.verbose(`Compiling model to ${fullPath(destPath)}`);
  const rootFile = path.relative(projectPath, mainFilePath);
  await compileFile(rootFile, destPath, modelFrameworkPath);
  out.verbose('Model built!');
  const mainPackageFilePath = path.resolve(destPath, 'index.js');
  out.verbose(`Deleting from modules cache key "${mainPackageFilePath}"`);
  delete require.cache[mainPackageFilePath];
};

export default build;
