import colors from 'colors';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';
import fs from '../util/fs';
import out from '../util/out';
import getCurrentA2RPackageInfo from './getCurrentA2RPackageInfo';
import getCurrentProjectInfo, {
  updateCurrentProjectPackageInfo,
} from './getCurrentProjectInfo';

export default async (): Promise<void> => {
  out.info(
    colors.yellow.bold(
      `>>> Patching project for ${colors.magenta('A2R')} Framework`
    )
  );
  out.verbose(`Current path is ${__dirname}`);

  const basePackagePath = path.join(__dirname, '../..');

  const modelPath = `${basePackagePath}/model`;
  const targetPath = path.join(__dirname, '../../../..');
  out.verbose(`Model path is ${modelPath}`);
  out.verbose(`Target path is ${targetPath}`);

  const execPromise = util.promisify(exec);

  async function copyModelContents(relPath: string): Promise<void> {
    out.verbose(`Processing path: ${relPath}`);
    const contents = await fs.readDir(modelPath + relPath);
    await Promise.all(
      contents.map(
        async (content: string): Promise<void> => {
          let newContent = content;

          const fullSourcePath = `${modelPath}${relPath}/${content}`;
          let fullDestinationPath = `${targetPath}${relPath}/${content}`;

          out.verbose(`Full source path: ${fullSourcePath}`);

          if (fullDestinationPath.endsWith('.model')) {
            fullDestinationPath = fullDestinationPath.substring(
              0,
              fullDestinationPath.length - 6
            );
            newContent = newContent.substring(0, newContent.length - 6);
          }

          out.verbose(`Full destination path: ${fullDestinationPath}`);

          const info = await fs.lStat(fullSourcePath);

          out.verbose(`Source is directory: ${info.isDirectory()}`);

          if (info.isDirectory()) {
            out.verbose(`Checking if path exists: ${fullDestinationPath}`);
            const existsDestiny = await fs.exists(fullDestinationPath);
            if (!existsDestiny) {
              out.verbose(`Creating directory: ${fullDestinationPath}`);
              await fs.mkDir(fullDestinationPath);
              out.verbose(`Directory created: ${fullDestinationPath}`);
            }
            await copyModelContents(`${relPath}/${content}`);
          } else {
            out.info(
              colors.green(
                `Generating file ${colors.yellow.bold.cyan(
                  `${relPath}/${newContent}`
                )}.`
              )
            );
            await fs.copyFile(fullSourcePath, fullDestinationPath);
          }
        }
      )
    );
  }

  out.info(colors.green(`Parsing ${colors.yellow.bold.cyan('package.json')}.`));

  let parsedPackage = await getCurrentProjectInfo();
  const parsedA2RPackage = await getCurrentA2RPackageInfo();

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
      typescript: parsedA2RPackage.devDependencies.typescript,
    },
    devDependencies: {
      ...parsedA2RPackage.devDependencies,
      ...parsedPackage.devDependencies,
    },
  };

  await updateCurrentProjectPackageInfo(parsedPackage);
  await execPromise('npm install');
  await copyModelContents('');
};
