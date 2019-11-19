import path from 'path';
import colors from 'colors';
import packageInfoManager from '../tools/packageInfoManager';
import { addCommand } from './consoleCommands';

const basePackagePath = path.join(__dirname, '../..');
const commands = packageInfoManager(`${basePackagePath}/package.json`);
export const updateCurrentA2RPackageInfo = commands.savePackage;
export default commands.loadPackage;

addCommand({
  name: 'currentA2RPackageInfo',
  description: `Gets the information of the current ${colors.magenta(
    'A2R'
  )} Framework ${colors.green('package.json')}`,
  onExecute: async (): Promise<void> => {
    const info = await commands.loadPackage();
    process.stdout.write(
      `Current ${colors.magenta('A2R')} Framework ${colors.green('package.json')}:\n ${colors.cyan(
        JSON.stringify(info, null, 2)
      )}`
    );
  },
});
