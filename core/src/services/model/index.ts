import path from 'path';

import addCommandsFromPath from '../commands/addCommandsFromPath';
import model from './model';
import fs from '../../util/fs';
import getFrameworkPath from '../../tools/getFrameworkPath';
import { fullPath } from '../../util/terminalStyles';
import out from '../../util/out';

import settings from '../../config/settings';

const { modelPath } = settings;

export const setupModel = async (): Promise<void> => {
  const frameworkPath = await getFrameworkPath();
  const modelFrameworkPath = path.resolve(frameworkPath, modelPath);
  out.verbose(`Model framework path: ${fullPath(modelFrameworkPath)}`);
  await fs.emptyFolders([modelFrameworkPath]);
  const commandsPath = path.resolve(__dirname, 'commands');
  await addCommandsFromPath(commandsPath);
};

export default model;
