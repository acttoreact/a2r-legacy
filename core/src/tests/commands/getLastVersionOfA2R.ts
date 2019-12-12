import getLastVersionOfA2R from '../../tools/getLastVersionOfA2R';

describe('Framework Commands', (): void => {
  test('Get Last Version Of A2R Framework', async (): Promise<void> => {
    try {
      const res = await getLastVersionOfA2R();
      expect(res.split('.').length).toBe(3);
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});
