import colors from 'colors';
import path from 'path';

import exec from '../util/exec';
import out from '../util/out';
import getFrameworkPath from './getFrameworkPath';
import getProjectPath from './getProjectPath';
import packageSetup from './packageSetup';
import copyTemplateContents from './copyModelContents';

import settings from '../config/settings';

const { boilerplatePath } = settings;

export default async (hard = false): Promise<void> => {
  out.info(colors.yellow.bold(`>>> Patching project for ${colors.magenta('A2R')} Framework`));

  const modulePath = await getFrameworkPath();
  const modelPath = path.resolve(modulePath, boilerplatePath);
  const projectPath = await getProjectPath();

  out.verbose(`Model path is ${modelPath}`);
  out.verbose(`Target path is ${projectPath}`);

  out.info(colors.green(`Parsing ${colors.yellow.bold.cyan('package.json')}.`));

  await packageSetup();
  await exec('npm', 'install');
  await copyTemplateContents(modelPath, projectPath, hard);
};
