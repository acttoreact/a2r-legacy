import path from 'path';
import { GetData, DataProvider } from '../../model/data';
import getProjectPath from '../../tools/getProjectPath';
import { setDataProvider } from '.';

const getDataProvider: DataProvider = async <R>(
  pathname: string,
): Promise<GetData<R>> => {
  const projectPath = await getProjectPath();
  const componentPath = path.resolve(
    projectPath,
    '.next/server/static/development/pages',
    pathname.slice(1) || 'index',
  );
  const component = await import(`${componentPath}.js`);
  const { getData } = component;
  return getData;
};

setDataProvider(getDataProvider);

export default getDataProvider;
