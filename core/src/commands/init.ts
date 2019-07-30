import colors from 'colors';
import path from 'path';
import fs from 'fs';
import util from 'util';
import { exec } from 'child_process';
import out from '../util/out';

export default async (): Promise<void> => {
  out.info(
    colors.yellow.bold(`>>> Initializing project for ${colors.yellow.magenta('A2R')} Framework`)
  );
  out.verbose(`Current path is ${__dirname}`);

  const basePackagePath = path.join(__dirname, '../..');

  const modelPath = `${basePackagePath}/model`;
  const targetPath = path.join(__dirname, '../../../..');
  out.verbose(`Model path is ${modelPath}`);
  out.verbose(`Target path is ${targetPath}`);

  const execPromise = util.promisify(exec);

  function existsPath(pathToCheck: string): Promise<boolean> {
    return new Promise<boolean>(
      (resolve: (result: boolean) => void): void => {
        fs.exists(
          pathToCheck,
          (exists: boolean): void => {
            resolve(exists);
          }
        );
      }
    );
  }

  const packageJsonPath = `${targetPath}/package.json`;

  const packageJsonA2RPath = `${basePackagePath}/package.json`;

  const isNPMInit = await existsPath(packageJsonPath);

  async function copyModelContents(relPath: string): Promise<void> {
    out.verbose(`Processing path: ${relPath}`);
    const contents = await fs.promises.readdir(modelPath + relPath);
    await Promise.all(
      contents.map(
        async (content: string): Promise<void> => {
          let newContent = content;

          const fullSourcePath = `${modelPath}${relPath}/${content}`;
          let fullDestinationPath = `${targetPath}${relPath}/${content}`;

          out.verbose(`Full source path: ${fullSourcePath}`);

          if (fullDestinationPath.endsWith('.model')) {
            fullDestinationPath = fullDestinationPath.substring(0, fullDestinationPath.length - 6);
            newContent = newContent.substring(0, newContent.length - 6);
          }

          out.verbose(`Full destination path: ${fullDestinationPath}`);

          const info = await fs.promises.lstat(fullSourcePath);

          out.verbose(`Source is directory: ${info.isDirectory()}`);

          if (info.isDirectory()) {
            out.verbose(`Checking if path exists: ${fullDestinationPath}`);
            const existsDestiny = await existsPath(fullDestinationPath);
            if (!existsDestiny) {
              out.verbose(`Creating directory: ${fullDestinationPath}`);
              await fs.promises.mkdir(fullDestinationPath);
              out.verbose(`Directory created: ${fullDestinationPath}`);
            }
            await copyModelContents(`${relPath}/${content}`);
          } else {
            out.info(
              colors.green(
                `Generating file ${colors.yellow.bold.cyan(`${relPath}/${newContent}`)}.`
              )
            );
            await fs.promises.copyFile(fullSourcePath, fullDestinationPath);
          }
        }
      )
    );
  }

  if (!isNPMInit) {
    out.error(
      colors.yellow.bold(
        `It is required to run ${colors.yellow.green(
          'npm init'
        )} in the project path to initialize the ${colors.yellow.magenta('A2R')} Framework`
      )
    );
  } else {
    const packageJsonText: string = await fs.promises.readFile(packageJsonPath, {
      encoding: 'utf-8'
    });

    const packageJsonA2RText: string = await fs.promises.readFile(packageJsonA2RPath, {
      encoding: 'utf-8'
    });

    out.info(colors.green(`Parsing ${colors.yellow.bold.cyan('package.json')}.`));

    let parsedPackage = JSON.parse(packageJsonText);
    const parsedA2RPackage = JSON.parse(packageJsonA2RText);

    delete parsedA2RPackage.devDependencies['ts-node-dev'];

    if (
      parsedPackage.scripts &&
      parsedPackage.scripts.test &&
      parsedPackage.scripts.test.indexOf('no test specified') !== -1
    ) {
      delete parsedPackage.scripts.test;
    }

    parsedPackage = {
      ...parsedPackage,
      dependencies: {
        a2r: `^${parsedA2RPackage.version}`,
        ...parsedPackage.dependencies,
        typescript: parsedA2RPackage.devDependencies.typescript
      },
      scripts: {
        "dev": "a2r --dev --port 9000",
        ...parsedPackage.scripts
      },
      devDependencies: {
        ...parsedA2RPackage.devDependencies,
        ...parsedPackage.devDependencies
      }
    };

    fs.promises.writeFile(packageJsonPath, JSON.stringify(parsedPackage), {
      encoding: 'utf-8'
    });

    await execPromise('npm install');
    await copyModelContents('');
  }
};
