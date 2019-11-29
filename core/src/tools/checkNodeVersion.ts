import colors from 'colors';

import getNodeVersion from './getNodeVersion';
import out from '../util/out';

import settings from '../config/settings';

const { minNodeVersion } = settings;
const minVersionParts = minNodeVersion.split('.');

const checkNodeVersion = async (): Promise<void> => {
  const userNodeVersion = await getNodeVersion();
  const userVersionParts = userNodeVersion.split('.');

  for (let i = 0, l = minVersionParts.length; i < l; i += 0) {
    const minPart = parseInt(minVersionParts[i], 10);
    const userPart = parseInt(userVersionParts[i], 10);
    if (userPart < minPart) {
      throw Error(
        `Node.js version ${colors.bold('must')} be at least ${colors.green(
          minNodeVersion,
        )}`,
      );
    }
  }

  out.verbose(`Node.js version is ${colors.green(userNodeVersion)}, all good`);
};

export default checkNodeVersion;
