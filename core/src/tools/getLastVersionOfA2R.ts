import exec from '../util/exec';

const getLastVersionOfA2R = async (): Promise<string> => {
  const res = await exec('npm', 'show', 'a2r', 'version');
  return res.out;
};

export default getLastVersionOfA2R;
