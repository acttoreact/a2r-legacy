import colors from 'colors';
import out from '../util/out';
import getCurrentA2RPackageInfo, {updateCurrentA2RPackageInfo} from '../commands/getCurrentA2RPackageInfo';

const increaseVersion = async (): Promise<string> => {

  const parsedPackage = await getCurrentA2RPackageInfo();

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
  await updateCurrentA2RPackageInfo(parsedPackage);
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
