import colors from 'colors';
import path from 'path';

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

import modulePath from '../../config/modulePath';

/**
 * Returns project path.
 * 
 * If a path is given by init command, that's the path we'll be using.
 * 
 * If not, working directory will be used.
 * @param {string} [destPath] Destination path passed by init command
 * @returns {Promise<string>} Project path
 */
const getProjectPath = async (destPath?: string): Promise<string> => {
  const projectPath = destPath || process.cwd();
  if (projectPath) {
    await fs.ensureDir(projectPath);
  }
  return projectPath;
};

/**
 * Init method. Called when using `a2r --init` command.
 * @param {string?} destPath Destination path containing project
 * @returns {Promise<void>}
 */
const init = async (destPath?: string): Promise<void> => {
  out.info(colors.yellow.bold(`>>> Initializing project with ${framework}`));
  const projectPath = await getProjectPath(destPath);
  out.verbose(`Framework path is ${fullPath(modulePath)}`);
  out.verbose(`Project path is ${fullPath(projectPath)}`);
  const modelPath = path.resolve(modulePath, 'model');
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
