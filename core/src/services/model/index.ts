import path from 'path';

import addCommandsFromPath from '../commands/addCommandsFromPath';
import model from './model';
import getPackageJson from './getPackageJson';
import getModelPackagePath from './getModelPackagePath';
import fs from '../../util/fs';
import getFrameworkPath from '../../tools/getFrameworkPath';
import { fullPath, terminalCommand } from '../../util/terminalStyles';
import out from '../../util/out';

import settings from '../../config/settings';

const { modelPath: modelPathName } = settings;

const clean = async (paths: string[]): Promise<void> => {
  await Promise.all(paths.map(async (folderPath): Promise<void> => {
    const exists = await fs.exists(folderPath);
    if (exists) {
      try {
        await fs.rimraf(folderPath);
      } catch (ex) {
        out.error(
          `Model: Error calling ${terminalCommand('rimraf')}: ${
            ex.message
          }\n${ex.stack}`,
        );
      }
    }
    await fs.mkDir(folderPath, { recursive: true });
  }));
}

export const setupModel = async (): Promise<void> => {
  const frameworkPath = await getFrameworkPath();
  const modelPath = await getModelPackagePath();
  const modelFrameworkPath = path.resolve(frameworkPath, modelPathName);
  out.verbose(`Model framework path: ${fullPath(modelFrameworkPath)}`);
  out.verbose(`Model package path: ${fullPath(modelPath)}`);
  await clean([modelPath, modelFrameworkPath]);
  const packageJson = await getPackageJson();
  const packageJsonPath = path.resolve(modelPath, 'package.json');
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson));
  const commandsPath = path.resolve(__dirname, 'commands');
  await addCommandsFromPath(commandsPath);
};

export default model;
