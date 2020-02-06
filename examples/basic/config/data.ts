import { GetData, A2RSession, A2RGlobalProps, registerGlobal } from 'a2r';

/**
 * App Global Props interface
 */
export interface GlobalProps extends A2RGlobalProps {
  title: string;
}

/**
 * App Session Props  interface
 */
export interface ProjectSession extends A2RSession {
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

registerGlobal<GlobalProps>(globalProvider);
