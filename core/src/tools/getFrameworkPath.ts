import path from 'path';

import getProjectPath from './getProjectPath';
import fs from '../util/fs';
import out from '../util/out';
import { framework, fullPath } from '../util/terminalStyles';

let frameworkPath = '';

const getFrameworkPath = async (): Promise<string> => {
  const projectPath = await getProjectPath();
  const modulePackageJson = path.join(projectPath, 'node_modules', 'a2r', 'package.json');
  const exists = await fs.exists(modulePackageJson);
  if (!frameworkPath) {
    if (exists) {
      frameworkPath = path.dirname(modulePackageJson);
      out.verbose(
        `${framework} is installed on project, framework path is ${fullPath(frameworkPath)}`,
      );
      return frameworkPath;
    }
  }
  if (!frameworkPath) {
    const parts = __dirname.split(path.sep);
    out.verbose(
      `${framework} is not installed on project, looking for framework path in ${fullPath(
        __dirname,
      )}`,
    );
    for (let i = parts.length - 1; i >= 0 && !frameworkPath; i -= 1) {
      if (parts[i] === 'a2r') {
        frameworkPath = parts.slice(0, i + 1).join(path.sep);
      }
    }
    out.verbose(
      `${framework} is not installed on project, framework path is ${fullPath(frameworkPath)}`,
    );
  }
  return frameworkPath;
};

export default getFrameworkPath;
