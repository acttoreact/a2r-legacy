import colors from 'colors';
import util from 'util';
import path from 'path';
import { exec } from 'child_process';
import out from '../util/out';
import fs from '../util/fs';
import getLastVersionOfA2R from './getLastVersionOfA2R';

export default async (): Promise<void> => {
  out.info(
    colors.yellow.bold(
      `>>> Updating project for ${colors.magenta('A2R')} Framework`
    )
  );
  out.verbose(`Current path is ${__dirname}`);

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
        `Your project is using the last version (${colors.green(currentVersion)}) of the ${colors.magenta('A2R')} Framework`
      )
    );
  } else {
    out.info(
      colors.yellow.bold(
        `>>> Updating project for ${colors.magenta('A2R')} Framework from v${colors.green(currentVersion)} to v${colors.green(lastVersion)}.`
      )
    );
    await execPromise(`npm install a2r@${lastVersion} --save;`);
    await execPromise(`npx a2r@${lastVersion} --patch`);
  }
};
