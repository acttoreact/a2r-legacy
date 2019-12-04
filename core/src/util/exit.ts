import { Closeable } from '../types';

const exit = (...closeableItems: Closeable[]): void => {
  closeableItems.forEach((closeable): void => closeable.close());
  process.stdin.destroy();
  process.exit();
};

export default exit;
