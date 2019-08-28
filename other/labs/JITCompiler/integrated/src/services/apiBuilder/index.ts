import path from 'path';
import colors from 'colors';
import fs from '../../util/fs';
import out from '../../util/out';

export interface APIModule {
  default: (...args: any[]) => Promise<any>;
  dispose?: () => Promise<void>;
}

export type APIStructure = {[id: string]: APIModule | APIStructure};

let api: APIStructure = {};

// const module = res['asd'] as APIModule;
// if (module) {
//   const a = await module.default();
  
//   if(module.dispose) {
//     await module.dispose();
//   }
// }

const importModules = async (
  folder: string,
  prefix?: string
): Promise<APIStructure> => {
  out.verbose(`Import modules from ${folder}`);
  const res: APIStructure = {};

  await fs.readDir(folder, { withFileTypes: true }).then(async (contents) => {
    await Promise.all(contents.map(async (content) => {
      const { name } = content;
      out.verbose(`Processing content ${name}`);
      const pathName = path.resolve(folder, name);
      if (content.isDirectory()) {
        res[name] = await importModules(pathName);
      } else if (path.extname(name).toLowerCase() === '.js') {
        const moduleName = name.replace(/\.js$/, '');
        await import(pathName).then((mod) => {
          res[moduleName] = mod;
        });
      }
    }));
  });

  return res;
};

export const buildApi = async (
  mainPath: string,
): Promise<APIStructure> => {
  const apiPath = path.resolve(mainPath, 'api');

  // Check apiPath exists
  
  out.verbose('Building API');
  api = await importModules(apiPath);
  out.info(`${colors.yellow.bold('API')} build ${colors.green.bold('OK')}`)

  return api;
};

export default api;