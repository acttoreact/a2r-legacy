import { useState, useEffect } from 'react';

export interface Size {
  width: number;
  height: number;
}

/**
 * Returns the size of the current browser window.
 * innerWidth as Width
 * innerHeight as Height
 */
const useWindowSize = (): Size => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const onResize = (): void => {
    setSize({
      width: window ? window.innerWidth : 0,
      height: window ? window.innerHeight : 0,
    });
  };
  useEffect(() => {
    const internalOnResize = onResize;
    window.addEventListener('resize', internalOnResize);
    onResize();
    return (): void => {
      window.removeEventListener('resize', internalOnResize);
    };
  }, []);

  return size;
};

export default useWindowSize;
