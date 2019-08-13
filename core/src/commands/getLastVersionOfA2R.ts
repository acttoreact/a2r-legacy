import util from 'util';
import { exec } from 'child_process';

const getLastVersionOfA2R = async (): Promise<string> => {
  const execPromise = util.promisify(exec);

  const res = await execPromise('npm show a2r version');

  const version = res.stdout.trim();

  return version;
};

export default getLastVersionOfA2R;
