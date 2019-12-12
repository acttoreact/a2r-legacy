import getCurrentA2RPackageInfo from './getCurrentA2RPackageInfo';
import getCurrentProjectInfo, { updateCurrentProjectPackageInfo } from './getCurrentProjectInfo';

const packageSetup = async (): Promise<void> => {
  const parsedPackage = await getCurrentProjectInfo();
  const parsedA2RPackage = await getCurrentA2RPackageInfo();

  delete parsedA2RPackage.devDependencies['ts-node-dev'];

  if (
    parsedPackage.scripts &&
    parsedPackage.scripts.test &&
    parsedPackage.scripts.test.includes('no test specified')
  ) {
    delete parsedPackage.scripts.test;
  }

  const finalPackage = {
    ...parsedPackage,
    dependencies: {
      a2r: `^${parsedA2RPackage.version}`,
      ...parsedPackage.dependencies,
    },
    scripts: {
      dev: 'a2r --dev --port 9000',
      ...parsedPackage.scripts,
    },
    devDependencies: {
      ...parsedA2RPackage.devDependencies,
      ...parsedPackage.devDependencies,
    },
  };

  await updateCurrentProjectPackageInfo(finalPackage);
};

export default packageSetup;
