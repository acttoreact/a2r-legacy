import { registerGlobal } from 'a2r';
import App, { AppInitialProps, AppContext } from 'a2r/app';
import Head from 'a2r/head';
import getData from 'a2r/api/getData';
import React, { createContext, useContext } from 'react';
import { GlobalProps, globalProvider } from '../config/data';

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
  public getMemoComponent() {
    const MemoComponent = React.memo(this.props.Component);
    return <MemoComponent {...this.props.pageProps} />;
  }
}

export const useSessionId = (): string => useContext(SessionContext);

/*--------- Client ------------*/

registerGlobal(globalProvider);

class MyApp extends A2RApp {
  public render = () => (
    <>
      <Head>
        <title>{this.props.pageProps.title}</title>
      </Head>
      <SessionContext.Provider value={this.props.pageProps.sessionId}>
        {this.getMemoComponent()}
      </SessionContext.Provider>
    </>
  );
}

export default MyApp;