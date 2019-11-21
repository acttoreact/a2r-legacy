import colors from 'colors';

import { ConsoleCommand } from '../services/commands/consoleCommands';
import getCurrentProjectInfo from '../tools/getCurrentProjectInfo';
import { fileName } from '../util/terminalStyles';

const logo: ConsoleCommand = {
  name: 'currentPackageInfo',
  description: `Gets the information of the current project ${colors.green(
    'package.json',
  )}`,
  onExecute: async (): Promise<void> => {
    const info = await getCurrentProjectInfo();
    process.stdout.write(
      `Current ${fileName('package.json')}:\n ${colors.cyan(
        JSON.stringify(info, null, 2),
      )}`,
    );
  },
};

export default logo;