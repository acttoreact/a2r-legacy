import path from 'path';
import packageInfoManager from './packageInfoManager';

const basePackagePath = path.join(__dirname, '../../../..');
const commands = packageInfoManager(`${basePackagePath}/package.json`);
export const updateCurrentProjectPackageInfo = commands.savePackage;
export default commands.loadPackage;
