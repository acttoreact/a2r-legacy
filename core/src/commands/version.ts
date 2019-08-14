import colors from 'colors';
import util from 'util';
import path from 'path';
import { exec } from 'child_process';
import out from '../util/out';
import fs from '../util/fs';
import getLastVersionOfA2R from './getLastVersionOfA2R';
import { addCommand } from './consoleCommands';

const getVersion = async (): Promise<void> => {
  const execPromise = util.promisify(exec);

  const basePackagePath = path.join(__dirname, '../..');

  const packageJsonA2RPath = `${basePackagePath}/package.json`;

  const packageJsonA2RText: string = await fs.readFile(packageJsonA2RPath, {
    encoding: 'utf-8',
  });

  const parsedA2RPackage = JSON.parse(packageJsonA2RText);

  const lastVersion = await getLastVersionOfA2R();

  const currentVersion = parsedA2RPackage.version;

  if (lastVersion === currentVersion) {
    out.info(
      colors.yellow.bold(
        `Your project is using the last version (${colors.green(
          currentVersion
        )}) of the ${colors.magenta('A2R')} Framework 👌`
      )
    );
  } else {
    out.info(
      colors.yellow.bold(
        `Your project is using version (${colors.green(
          currentVersion
        )}) of the ${colors.magenta(
          'A2R'
        )} Framework. There is a v${colors.green(
          lastVersion
        )} available use ${colors.bgBlue.magenta(
          'npx a2r ---update'
        )} to upgrade the project.`
      )
    );
  }
};

addCommand({
  name: 'version',
  description: 'Gets the current version of the A2R Framework',
  onExecute: async (): Promise<void> => {
    await getVersion();
  },
});

export default getVersion;
