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

interface PathsDictionary {
  [id: string]: string;
}

const pathsDictionary: PathsDictionary = {};
const api: APIStructure = {};

const importModules = async (
  folder: string,
  prefix?: string,
): Promise<APIStructure> => {
  out.verbose(`Import modules from ${folder}`);
  let res: APIStructure = {};

  const contents = await fs.readDir(folder, { withFileTypes: true });
  const methods: string[] = [];
  const subModules: string[] = [];

  await Promise.all(
    contents.map(
      async (content): Promise<void> => {
        const { name } = content;
        out.verbose(`Processing content ${name}`);
        const cleanName = name.replace(/\.js$/, '');
        const moduleName: string = [prefix, cleanName]
          .filter((s): boolean => !!s)
          .join('.');
        if (content.isDirectory()) {
          subModules.push(name);
        } else if (path.extname(name).toLowerCase() === '.js') {
          const pathName = path.resolve(folder, name);
          methods.push(cleanName);
          await import(pathName).then((mod): void => {
            res[moduleName] = mod;
            pathsDictionary[pathName] = moduleName;
          });
        }
      },
    ),
  );

  await Promise.all(
    subModules.map(
      async (name): Promise<void> => {
        const modulePrefix: string = [prefix, name]
          .filter((s): boolean => !!s)
          .join('.');
        if (methods.indexOf(name) === -1) {
          const pathName = path.resolve(folder, name);
          const subModule = await importModules(pathName, modulePrefix);
          res = {
            ...res,
            ...subModule,
          };
        } else {
          out.error(
            `API Module ${colors.yellow(
              modulePrefix,
            )} can't be processed. There's already a method with that name`,
          );
        }
      },
    ),
  );

  return res;
};

export const disposeModule = async (modulePath: string): Promise<void> => {
  const moduleName = pathsDictionary[modulePath];
  if (moduleName) {
    const mod = api[moduleName] as APIModule;
    if (mod) {
      if (mod.dispose) {
        out.verbose(
          `Module ${colors.italic(
            moduleName,
          )} has dispose method. Calling it...`,
        );
        await mod.dispose();
        out.verbose(`Dispose done for module ${colors.italic(moduleName)}`);
      }
      delete api[moduleName];
      delete pathsDictionary[modulePath];
      out.verbose(
        `API module ${colors.italic(moduleName)} has been ${colors.green.bold(
          'successfully',
        )} disposed`,
      );
    } else {
      out.warn(
        `Couldn't find any module for name ${colors.italic(moduleName)}`,
      );
    }
  } else {
    out.warn(
      `Couldn't find any module name for path ${colors.yellow(modulePath)}`,
    );
  }
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
    out.info(`${colors.yellow.bold('API')} built ${colors.green.bold('OK')}`);
  } else {
    out.error(`API main path not found: ${colors.grey(apiPath)}`);
  }

  return api;
};

export default api;
