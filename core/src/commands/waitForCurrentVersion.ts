import colors from 'colors';
import out from '../util/out';
import getLastVersionOfA2R from './getLastVersionOfA2R';
import { addCommand } from './consoleCommands';
import getCurrentA2RPackageInfo from './getCurrentA2RPackageInfo';

const getVersion = async (): Promise<void> => {

  const parsedA2RPackage = await getCurrentA2RPackageInfo();

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
