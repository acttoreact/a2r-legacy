import fs from '../../util/fs';


beforeAll(async (): Promise<void> => {
  console.log('Inicia cosas requeridas por todos los test del fichero.');
});

afterAll(async (): Promise<void> => {
  console.log('Purga.');
});

beforeEach(async (): Promise<void> => {
  console.log('En cada test.');
});

afterEach(async (): Promise<void> => {
  console.log('Tras cada test.');
});

describe('Básicos', (): void => {  

  test('adds 1 + 2 to equal 3', (): void => {
    expect(1 + 2).toBe(3);
  });

  test('Root must be a directory', async (): Promise<void> => {
    const list = await fs.lStat('/');
    expect(list.isDirectory()).toBe(true);
  });
});
