import path from 'path';
import processFiles from '../../helpers/api/processFiles';
import out from '../../util/out';

const normalizedPath = path.resolve('../other/labs/AST/samples');

out.setLevel('verbose');

test('basic', async (): Promise<void> => {
  out.verbose(`Running api process on ${normalizedPath}`)
  try {
    await processFiles(normalizedPath);
    expect(0).toBe(0);
  } catch (e) {
    expect(e).toMatch('error');
  }
});
