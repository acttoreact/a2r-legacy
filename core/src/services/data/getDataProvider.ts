/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import getProjectPath from '../../tools/getProjectPath';
import { setDataProvider } from './getDataByServer';
import { BasicContext } from '../../model/data';

const getDataProvider = async (
  pathname: string,
): Promise<(a2rContext: BasicContext) => any> => {
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
