import getLastVersionOfA2R from './getLastVersionOfA2R';
import getCurrentA2RPackageInfo from './getCurrentA2RPackageInfo';

const getVersion = async (): Promise<void> => {
  const { version: currentVersion } = await getCurrentA2RPackageInfo();
  let lastVersion = await getLastVersionOfA2R();
  while (lastVersion !== currentVersion) {
    // eslint-disable-next-line no-await-in-loop
    lastVersion = await getLastVersionOfA2R();
  }
};

export default getVersion;
