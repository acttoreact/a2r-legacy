import colors from 'colors';
import path from 'path';

import exec from '../util/exec';
import fs from '../util/fs';
import out from '../util/out';
import copyModelContents from '../tools/copyModelContents';
import ensureNpmInit from '../tools/ensureNpmInit';
import getCurrentA2RPackageInfo from './getCurrentA2RPackageInfo';
import getCurrentProjectInfo, {
  updateCurrentProjectPackageInfo,
} from './getCurrentProjectInfo';

const getProjectPath = async (destPath?: string): Promise<string> => {
  if (destPath) {
    await fs.ensureDir(destPath);
    return destPath;
  }
  // `__dirname` should be like `[projectPath]/node_modules/a2r/dist/commands
  return path.resolve(__dirname, '../../../..');
};

/**
 * Init method. Called when using `a2r --init` command.
 * @param {string?} destPath Destination path containing project
 * @returns {Promise<void>}
 */
const init = async (destPath?: string): Promise<void> => {
  out.info(
    colors.yellow.bold(
      `>>> Initializing project for ${colors.magenta('A2R')} Framework`
    )
  );
  out.verbose(`Current path is ${__dirname}`);

  const projectPath = await getProjectPath(destPath);
  const basePackagePath = path.resolve(projectPath, 'node_modules/a2r');
  const modelPath = path.resolve(basePackagePath, 'model');
  out.verbose(`Model path is ${modelPath}`);
  out.verbose(`Project path is ${projectPath}`);

  out.verbose(`Ensuring npm is initialized in path "${projectPath}"`);
  await ensureNpmInit(projectPath);

  out.verbose(`Copying model contents from path "${modelPath}"`);
  await copyModelContents(modelPath, projectPath);

  let parsedPackage = await getCurrentProjectInfo();
  const parsedA2RPackage = await getCurrentA2RPackageInfo();

  delete parsedA2RPackage.devDependencies['ts-node-dev'];

  if (
    parsedPackage.scripts &&
    parsedPackage.scripts.test &&
    parsedPackage.scripts.test.indexOf('no test specified') !== -1
  ) {
    delete parsedPackage.scripts.test;
  }

  parsedPackage = {
    ...parsedPackage,
    dependencies: {
      a2r: `^${parsedA2RPackage.version}`,
      ...parsedPackage.dependencies,
      typescript: parsedA2RPackage.devDependencies.typescript,
    },
    scripts: {
      dev: 'a2r --dev --port 9000',
      ...parsedPackage.scripts,
    },
    devDependencies: {
      ...parsedA2RPackage.devDependencies,
      ...parsedPackage.devDependencies,
    },
  };

  await updateCurrentProjectPackageInfo(parsedPackage);
  await exec('npm', 'install');
};

export default init;
