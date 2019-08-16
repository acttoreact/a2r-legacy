import colors from 'colors';
import util from 'util';
import { exec } from 'child_process';
import out from '../util/out';
import getLastVersionOfA2R from './getLastVersionOfA2R';
import getCurrentA2RPackageInfo from './getCurrentA2RPackageInfo';


export default async (): Promise<void> => {

  const execPromise = util.promisify(exec);

  const parsedA2RPackage = await getCurrentA2RPackageInfo();

  const lastVersion = await getLastVersionOfA2R();

  const currentVersion = parsedA2RPackage.version;

  if (lastVersion === currentVersion) {
    out.info(
      colors.yellow.bold(
        `Your project is using the last version (${colors.green(currentVersion)}) of the ${colors.magenta('A2R')} Framework 👌`
      )
    );
  } else {
    out.info(
      colors.yellow.bold(
        `>>> Updating project for ${colors.magenta('A2R')} Framework from v${colors.green(currentVersion)} to v${colors.green(lastVersion)}.`
      )
    );
    out.info(
      colors.yellow.bold(
        '... ⏰ this process will take some minutes to run 🤷‍ ...'
      )
    );
    await execPromise(`npm install a2r@${lastVersion} --save;`);
    await execPromise(`npx a2r@${lastVersion} --patch`);
  }
};
