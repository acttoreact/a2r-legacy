import colors from 'colors';

import exec from '../util/exec';
import out from '../util/out';
import getLastVersionOfA2R from './getLastVersionOfA2R';
import getCurrentA2RPackageInfo from './getCurrentA2RPackageInfo';
import { framework } from '../util/terminalStyles';

const version = colors.green;
const log = (message: string): void => {
  out.info(colors.yellow.bold(message));
};

/**
 * Updates and installs latest A2R Framework version on project
 * @returns {Promise<void>}
 */
const update = async (updateHard = false): Promise<void> => {
  const parsedA2RPackage = await getCurrentA2RPackageInfo();
  const lastVersion = await getLastVersionOfA2R();
  const { version: currentVersion } = parsedA2RPackage;

  if (lastVersion === currentVersion) {
    log(
      `Your project is already using the latest version (${version(
        currentVersion,
      )}) of ${framework} 👌`,
    );
  } else {
    log(
      `>>> Updating project for ${framework} from v${version(
        currentVersion,
      )} to v${version(lastVersion)}.`,
    );
    log('... ⏰ this process might take some minutes 🤷‍ ...');
    await exec('npm', 'install', `a2r@${lastVersion}`, '--save;');
    await exec('npx', `a2r@${lastVersion}`, updateHard ? '--patchHard' : '--patch');
  }
};

export default update;
