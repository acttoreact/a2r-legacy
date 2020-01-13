import path from 'path';

import fs from '../util/fs';

const setupForWork = async (): Promise<void> => {
  const corePath = path.resolve(__dirname, '../../');
  const destPath = path.resolve(corePath, 'node_modules', 'a2r');
  const exists = await fs.exists(destPath);
  if (exists) {
    await fs.rimraf(destPath);
  }
  await fs.symlink(corePath, destPath, 'dir');
};

setupForWork()
  .then(() => {
    console.log(`Setup done, you can now import 'a2r' like a final user`);
  })
  .catch((ex) => {
    console.log(`Problem during setup: ${ex.message}\n${ex.stack}`);
  });