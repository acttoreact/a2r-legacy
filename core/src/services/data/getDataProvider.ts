/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import fs from '../../util/fs';
// import out from '../../util/out';
import getFrameworkPath from '../../tools/getFrameworkPath';
import { setDataProvider } from './getDataByServer';
import { BasicContext } from '../../model/data';
import { pathCache, moduleCache } from './cache';
// import { fullPath } from '../../util/terminalStyles';

const getModulePath = async (pathname: string): Promise<string> => {
  if (!pathCache.has(pathname)) {
    const frameworkPath = await getFrameworkPath();
    const dataPath = path.resolve(frameworkPath, 'data', 'data', pathname.slice(1));
    let modulePath = `${dataPath}.js`;
    const isFile = await fs.isFile(modulePath);
    if (!isFile) {
      modulePath = `${dataPath}/index.js`;
    }
    pathCache.set(pathname, modulePath);
  }
  return pathCache.get(pathname) as string;
};

const getDataProvider = async (
  pathname: string,
): Promise<(a2rContext: BasicContext) => any> => {
  const modulePath = await getModulePath(pathname);
  if (!moduleCache.has(pathname)) {
    const getData = await import(modulePath);
    if (getData && getData.default) {
      moduleCache.set(pathname, getData.default);
    }
    // try {
    //   const getData = await import(modulePath);
    //   if (getData && getData.default) {
    //     moduleCache.set(pathname, getData.default);
    //   }
    // } catch (ex) {
    //   out.warn(`Couldn't find page data provider at ${fullPath(modulePath)}`);
    //   return (): {} => ({});
    // }
  }
  return moduleCache.get(pathname) as (a2rContext: BasicContext) => any;
};

setDataProvider(getDataProvider);

export default getDataProvider;
