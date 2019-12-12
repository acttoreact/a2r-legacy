import path from 'path';

import fs from '../util/fs';
import out from '../util/out';
import { fileName, fullPath } from '../util/terminalStyles';

export const workingDirectory = process.cwd();
let projectPath = '';

const getProjectPath = async (targetPath: string = workingDirectory): Promise<string> => {
  if (projectPath) {
    return projectPath;
  }
  const packageJsonPath = path.join(targetPath, 'package.json');
  const exists = await fs.exists(packageJsonPath);
  if (exists) {
    projectPath = path.dirname(packageJsonPath);
    out.verbose(
      `${fileName('package.json')} found, project path is ${fullPath(
        projectPath,
      )}`,
    );
    return projectPath;
  }
  const nextTarget = path.dirname(targetPath);
  if (nextTarget !== '/') {
    return getProjectPath(nextTarget);
  }
  return workingDirectory;
};

export default getProjectPath;
