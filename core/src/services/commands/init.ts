import colors from 'colors';
import path from 'path';

import getFrameworkPath from '../../tools/getFrameworkPath';
import exec from '../../util/exec';
import fs from '../../util/fs';
import out from '../../util/out';
import {
  terminalCommand,
  framework,
  fileName,
  fullPath,
} from '../../util/terminalStyles';
import copyModelContents from '../../tools/copyModelContents';
import ensureNpmInit from '../../tools/ensureNpmInit';
import packageSetup from '../../tools/packageSetup';

import settings from '../../config/settings';

const { boilerplatePath } = settings;

/**
 * Init method. Called when using `a2r --init` command.
 * @param {string} [projectPath=process.cwd()] Destination path containing project
 * @returns {Promise<void>}
 */
const init = async (projectPath: string = process.cwd()): Promise<void> => {
  out.info(colors.yellow.bold(`>>> Initializing project with ${framework}`));
  const modulePath = await getFrameworkPath();
  await fs.ensureDir(projectPath);
  out.verbose(`Framework path is ${fullPath(modulePath)}`);
  out.verbose(`Project path is ${fullPath(projectPath)}`);
  const modelPath = path.resolve(modulePath, boilerplatePath);
  out.verbose(`Model path is ${fullPath(modelPath)}`);

  out.verbose(`Ensuring npm is initialized in path ${fullPath(projectPath)}`);
  await ensureNpmInit(projectPath);
  out.verbose(`Copying model contents from path ${fullPath(modelPath)}`);
  await copyModelContents(modelPath, projectPath);
  out.verbose(colors.yellow.bold('Model contents copied'));
  await packageSetup();
  out.verbose(
    `Project ${fileName('package.json')} ready, running ${terminalCommand(
      'npm install',
    )}`,
  );
  await exec('npm', 'install');
};

export default init;
