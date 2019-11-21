/* eslint-disable @typescript-eslint/no-explicit-any */

const replacer = (key: string, value: any): any => {
  if (key === 'default') {
    return 'module default async method';
  }
  if (key === 'dispose') {
    return 'module dispose async method';
  }
  return value;
};

export default replacer;
