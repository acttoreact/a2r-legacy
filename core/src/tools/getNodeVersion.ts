import exec from '../util/exec';

const getNodeVersion = async (): Promise<string> => {
  const res = await exec('node', '--version');
  return res.out.trim();
};

export default getNodeVersion;
