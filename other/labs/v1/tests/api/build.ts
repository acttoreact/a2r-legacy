import path from 'path';
import fs from '../../util/fs';
import apiCompiler from '../../services/apiCompiler';
import api, { apiPathKey, moduleToPathDictionary } from '../../services/api/api';

const apiPath = path.resolve(__dirname, '../../../../test2/api');

beforeAll(async (): Promise<void> => {
  await apiCompiler();
}, 10000);

describe('API Build', (): void => {
  test('Same amount of root files and one level API keys', async (): Promise<void> => {
    const contents = await fs.readDir(apiPath, { withFileTypes: true });
    const files = contents.filter((c): boolean => c.isFile());
    const apiFirstLevelKeys = Object.keys(api).filter((k): boolean => k.indexOf('.') === -1);
    expect(apiFirstLevelKeys.length).toBe(files.length);
  });

  test('API module to path dictionary must contain main path', (): void => {
    expect(Object.keys(moduleToPathDictionary)).toContain(apiPathKey);
  });
});