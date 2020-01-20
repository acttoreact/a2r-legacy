import path from 'path';
import { GetData, DataProvider } from '../../model/data';
import getProjectPath from '../../tools/getProjectPath';
import { setDataProvider } from '.';

const getDataProvider: DataProvider = async <ReturnType>(pathname: string): Promise<GetData<ReturnType>> => {
  const projectPath = await getProjectPath();
  const componentPath = path.resolve(projectPath, pathname);
  const component = await import(componentPath);
  const { getData } = component;
  return getData;
};

setDataProvider(getDataProvider);

export default getDataProvider;
