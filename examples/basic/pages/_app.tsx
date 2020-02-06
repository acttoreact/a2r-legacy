import React from 'a2r/react';
import { A2RApp, SessionProvider, PagePropsProvider } from 'a2r';
import Head from 'a2r/head';

import 'a2r/api/getData';
import '../config/data';

class MyApp extends A2RApp {
  public render = (): JSX.Element => (
    <>
      <Head>
        <title>{this.props.pageProps.title}</title>
      </Head>
      <SessionProvider value={this.props.pageProps.sessionId}>
        <PagePropsProvider value={this.props.pageProps}>
          {this.getMemoComponent()}
        </PagePropsProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;