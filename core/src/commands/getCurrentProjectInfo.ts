import path from 'path';
import colors from 'colors';
import packageInfoManager from './packageInfoManager';
import { addCommand } from './consoleCommands';

const basePackagePath = path.join(__dirname, '../../../..');
const commands = packageInfoManager(`${basePackagePath}/package.json`);
export const updateCurrentProjectPackageInfo = commands.savePackage;
export default commands.loadPackage;

addCommand({
  name: 'currentPackageInfo',
  description: `Gets the information of the current project ${colors.green(
    'package.json'
  )}`,
  onExecute: async (): Promise<void> => {
    const info = await commands.loadPackage;
    process.stdout.write(
      `Current ${colors.green('package.json')}\n: ${colors.blue(
        JSON.stringify(info, null, 2)
      )}`
    );
  },
});
