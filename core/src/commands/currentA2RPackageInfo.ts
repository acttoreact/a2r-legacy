import colors from 'colors';

import { ConsoleCommand } from '../services/commands/consoleCommands';
import getCurrentA2RPackageInfo from '../tools/getCurrentA2RPackageInfo';
import { framework, fileName } from '../util/terminalStyles';

const logo: ConsoleCommand = {
  name: 'currentA2RPackageInfo',
  description: `Gets the information of the current ${colors.magenta(
    'A2R'
  )} Framework ${colors.green('package.json')}`,
  onExecute: async (): Promise<void> => {
    const info = await getCurrentA2RPackageInfo();
    process.stdout.write(
      `Current ${framework} ${fileName('package.json')}:\n ${colors.cyan(
        JSON.stringify(info, null, 2)
      )}`
    );
  },
};

export default logo;