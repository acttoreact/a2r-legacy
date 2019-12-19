import { useState, useEffect } from 'react';

export interface Size {
  width: number;
  height: number;
}

const useWindowSize = (): Size => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const onResize = (): void => {
    setSize({
      width: window ? window.innerWidth : 0,
      height: window ? window.innerHeight : 0,
    });
  };
  useEffect(() => {
    window.addEventListener('resize', onResize);
    onResize();
    return (): void => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return size;
};

export default useWindowSize;
