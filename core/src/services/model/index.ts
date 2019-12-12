import path from 'path';

import addCommandsFromPath from '../commands/addCommandsFromPath';
import model from './model';
import buildA2RModel from './buildA2RModel';
import getModelPackagePath from './getModelPackagePath';
import fs from '../../util/fs';
import getFrameworkPath from '../../tools/getFrameworkPath';
import { fullPath } from '../../util/terminalStyles';
import out from '../../util/out';

import settings from '../../config/settings';

const { modelPath } = settings;

export const setupModel = async (): Promise<void> => {
  const frameworkPath = await getFrameworkPath();
  const modelPackagePath = await getModelPackagePath();
  const modelFrameworkPath = path.resolve(frameworkPath, modelPath);
  out.verbose(`Model framework path: ${fullPath(modelFrameworkPath)}`);
  out.verbose(`Model package path: ${fullPath(modelPackagePath)}`);
  await fs.emptyFolders([modelPackagePath, modelFrameworkPath]);
  await buildA2RModel(frameworkPath, modelFrameworkPath);
  const commandsPath = path.resolve(__dirname, 'commands');
  await addCommandsFromPath(commandsPath);
};

export default model;
