import path from 'path';

import { GetData } from '../../model/data';
import getProjectPath from '../../tools/getProjectPath';

const getDataProvider = async <ReturnType>(pathname: string): Promise<GetData<ReturnType>> => {
  const projectPath = await getProjectPath();
  const componentPath = path.resolve(projectPath, pathname);
  const component = await import(componentPath);
  const { getData } = component;
  return getData;
};

export default getDataProvider;
