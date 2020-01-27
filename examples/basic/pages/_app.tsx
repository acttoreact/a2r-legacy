import { registerGlobal } from 'a2r';
import App, { AppInitialProps, AppContext } from 'a2r/app';
import Head from 'a2r/head';
import React, { createContext, useContext } from 'a2r/react';
import getData from 'a2r/api/getData';

import { GlobalProps, globalProvider } from '../config/data';

registerGlobal(globalProvider);

const SessionContext = createContext<string>('');

class A2RApp extends App {
  public static async getInitialProps({ ctx }: AppContext): Promise<AppInitialProps> {
    const { data, sessionId } = await getData<GlobalProps>(ctx);

    console.log('Path: ', ctx.asPath, ctx.pathname, ctx.query);
    console.log('Data: ', {...data});
  
    return {
      pageProps: {
        sessionId,
        ...data,
      },
    };
  }

  public render(): JSX.Element {
    const {
      Component,
      pageProps: { sessionId, ...props },
    } = this.props;

    const { title } = props;

    const MemoComponent = React.memo(Component);

    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        <SessionContext.Provider value={sessionId}>
          <MemoComponent {...props} />
        </SessionContext.Provider>
      </>
    );
  }
}

export const useSessionId = (): string => useContext(SessionContext);

export default A2RApp;
