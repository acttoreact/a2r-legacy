import getLastVersionOfA2R from '../../../tools/getLastVersionOfA2R';

describe('Framework Tools', (): void => {
  test('A2R last version should have three numeration levels', async (): Promise<void> => {
    try {
      const res = await getLastVersionOfA2R();
      expect(res.split('.').length).toBe(3);
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});
