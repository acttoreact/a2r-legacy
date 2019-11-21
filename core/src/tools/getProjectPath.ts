import path from 'path';
import fs from 'fs';

export const workingDirectory = process.cwd();
let projectPath = '';

const getProjectPath = (targetPath: string = workingDirectory): string => {
  if (projectPath) {
    return projectPath;
  }
  const packageJsonPath = path.join(targetPath, 'package.json');
  const exists = fs.existsSync(packageJsonPath);
  if (exists) {
    projectPath = path.dirname(packageJsonPath);
    return packageJsonPath;
  }
  const nextTarget = path.dirname(targetPath);
  if (nextTarget !== '/') {
    return getProjectPath(nextTarget);
  }
  return workingDirectory;
};

export default getProjectPath;
