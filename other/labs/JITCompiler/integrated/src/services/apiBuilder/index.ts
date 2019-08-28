/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import colors from 'colors';
import fs from '../../util/fs';
import out from '../../util/out';

export interface APIModule {
  default: (...args: any[]) => Promise<any>;
  dispose?: () => Promise<void>;
}

export interface APIStructure {
  [id: string]: APIModule | APIStructure;
}

const api: APIStructure = {};

const importModules = async (
  folder: string,
  prefix?: string
): Promise<APIStructure> => {
  out.verbose(`Import modules from ${folder}`);
  let res: APIStructure = {};

  await fs.readDir(folder, { withFileTypes: true }).then(
    async (contents): Promise<void> => {
      await Promise.all(
        contents.map(
          async (content): Promise<void> => {
            const { name } = content;
            out.verbose(`Processing content ${name}`);
            const moduleName: string = [prefix, name.replace(/\.js$/, '')]
              .filter((s): boolean => !!s)
              .join('.');
            const pathName = path.resolve(folder, name);
            if (content.isDirectory()) {
              const modulePrefix: string = [prefix, name]
                .filter((s): boolean => !!s)
                .join('.');
              const subModule = await importModules(pathName, modulePrefix);
              res = {
                ...res,
                ...subModule,
              };
            } else if (path.extname(name).toLowerCase() === '.js') {
              await import(pathName).then((mod): void => {
                res[moduleName] = mod;
              });
            }
          }
        )
      );
    }
  );

  return res;
};

export const buildApi = async (mainPath: string): Promise<APIStructure> => {
  const apiPath = path.resolve(mainPath, 'api');

  const exists = await fs.exists(apiPath);

  if (exists) {
    out.verbose('Building API');
    const modules: APIStructure = await importModules(apiPath);
    Object.entries(modules).forEach((entry: [string, any]): void => {
      const [key, value] = entry;
      api[key] = value;
    });
    out.info(`${colors.yellow.bold('API')} build ${colors.green.bold('OK')}`);
  } else {
    out.error(`API main path not found: ${colors.grey(apiPath)}`);
  }

  return api;
};

export default api;
