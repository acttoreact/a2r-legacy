import path from 'path';
import colors from 'colors';

import fs from '../util/fs';
import out from '../util/out';
import exec from '../util/exec';
import { terminalCommand, framework } from '../util/terminalStyles';

/**
 * Ensures a `package.json` file exists. If not, runs `npm init` with `--force` flag
 * @param {string} projectPath Project base path
 */
const ensureNpmInit = async (projectPath: string): Promise<void> => {
  const packageJsonPath = path.resolve(projectPath, 'package.json');
  const isNPMInit = await fs.exists(packageJsonPath);

  if (!isNPMInit) {
    out.verbose(
      colors.yellow.bold(
        `Running ${terminalCommand('npm init')} in the project path to initialize the ${framework}`,
      )
    );

    await exec('npm', 'init', '--force');
  }
};

export default ensureNpmInit;
