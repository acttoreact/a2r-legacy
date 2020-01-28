import React from 'react';
import { A2RApp, SessionProvider, PagePropsProvider } from 'a2r';
import Head from 'a2r/head';

import '../config/data';

class MyApp extends A2RApp {
  public render = () => (
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