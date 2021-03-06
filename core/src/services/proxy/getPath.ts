import path from 'path';

import getProjectPath from '../../tools/getProjectPath';

let clientApiPath = '';

const getPath = async (): Promise<string> => {
  const projectPath = await getProjectPath();
  if (!clientApiPath) {
    clientApiPath = path.normalize(path.resolve(projectPath, 'node_modules', 'api'));
  }
  return clientApiPath;
};

export default getPath;
