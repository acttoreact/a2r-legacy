import path from 'path';

import getProjectPath from '../../tools/getProjectPath';

import settings from '../../config/settings';

const { modelPath } = settings;

const getModelPackagePath = async (): Promise<string> => {
  const projectPath = await getProjectPath();
  return path.resolve(projectPath, 'node_modules', modelPath);
};

export default getModelPackagePath;
