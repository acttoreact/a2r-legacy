import windowSize from './useWindowSize';
import { useSessionId, usePageProps } from '../pages/_app';

export { useSessionId, usePageProps } from '../pages/_app';
export const useWindowSize = windowSize;

export default {
  useWindowSize: windowSize,
  useSessionId,
  usePageProps,
};
