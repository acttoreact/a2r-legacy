import path from 'path';

import modulePath from '../config/modulePath';
import packageInfoManager from './packageInfoManager';

const commands = packageInfoManager(path.join(modulePath, 'package.json'));
export const updateCurrentA2RPackageInfo = commands.savePackage;
export default commands.loadPackage;
