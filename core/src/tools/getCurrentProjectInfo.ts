import path from 'path';

import getProjectPath from './getProjectPath';
import packageInfoManager from './packageInfoManager';

const projectPath = getProjectPath();
const commands = packageInfoManager(path.join(projectPath, 'package.json'));
export const updateCurrentProjectPackageInfo = commands.savePackage;
export default commands.loadPackage;
