import colors from 'colors';
import path from 'path';
import out from '../util/out';
import fs from '../util/fs';

const increaseVersion = async (): Promise<string> => {
  out.setLevel('verbose');

  out.info(
    colors.yellow.bold(
      `>>> Increasing package version for ${colors.magenta('A2R')} Framework`
    )
  );

  const packageJsonPath = path.join(__dirname, '../../package.json');

  out.verbose(`package.son path is ${packageJsonPath}`);

  const packageJsonText: string = await fs.readFile(packageJsonPath, {
    encoding: 'utf-8',
  });

  const parsedPackage = JSON.parse(packageJsonText);

  const currentVersion = parsedPackage.version;

  const currentVersionValues = currentVersion
    .split('.')
    .map((value: string): number => parseInt(value, 10));

  currentVersionValues[2] += 1;

  const newVersion = currentVersionValues.join('.');
  parsedPackage.version = newVersion;

  const { scripts } = parsedPackage;
  const versionRX = new RegExp(`a2r@${currentVersion}`, 'g');
  Object.keys(scripts).forEach(
    (key): void => {
      scripts[key] = (scripts[key] as string).replace(
        versionRX,
        `a2r@${newVersion}`
      );
    }
  );
  await fs.writeFile(packageJsonPath, JSON.stringify(parsedPackage, null, 2), {
    encoding: 'utf-8',
  });
  return newVersion;
};

increaseVersion()
  .then(
    (newVersion): void => {
      out.info(
        colors.yellow(`Version increased to ${colors.green.bold(newVersion)}`)
      );
    }
  )
  .catch(
    (err: Error): void => {
      out.error(err.message, { stack: err.stack });
    }
  );
