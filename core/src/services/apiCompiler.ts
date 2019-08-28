import path from 'path';
import compiler from './compiler';

const sourcePathDir = path.join(__dirname, '../../../..');
const destPathDir = path.join(__dirname, '../../../../.a2r/api/server');

const apiCompiler = (): Promise<void> => compiler(sourcePathDir, destPathDir);

export default apiCompiler;
