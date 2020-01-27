import { GetData, Session } from 'a2r';

/**
 * App Global Props interface
 */
export interface GlobalProps {
  title: string;
}

/**
 * App Session Props  interface
 */
export interface ProjectSession extends Session {
  country: string;
}

export type GetPageData<PageData> = GetData<PageData, GlobalProps, ProjectSession>;

/**
 * Global Props provider. Will be called to obtain global props. Runs only on server side
 */
export const globalProvider = (): GlobalProps => {
  return {
    title: 'A2R Framework',
  };
};
