import { registerGlobal } from 'a2r';
import App, { AppInitialProps, AppContext } from 'a2r/app';
import Head from 'a2r/head';
import getData from 'a2r/api/getData';
import React, { createContext, useContext } from 'react';
import { GlobalProps, globalProvider } from '../config/data';

registerGlobal(globalProvider);

const SessionContext = createContext<string>('');

class A2RApp extends App {
  public static async getInitialProps({ ctx }: AppContext): Promise<AppInitialProps> {
    const { data, sessionId } = await getData<GlobalProps>(ctx);
    return {
      pageProps: {
        sessionId,
        ...data,
      },
    };    
  }
}

export const useSessionId = (): string => useContext(SessionContext);


class MyApp extends A2RApp {

  public render(): JSX.Element {    
    const MemoComponent = React.memo(this.props.Component);
    return (
      <>
        <Head>
          <title>{this.props.pageProps.title}</title>
        </Head>
        <SessionContext.Provider value={this.props.pageProps.sessionId}>
          <MemoComponent {...this.props.pageProps} />
        </SessionContext.Provider>
      </>
    );
  }

}

export default MyApp;










