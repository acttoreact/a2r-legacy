import React from 'react';
import Head from 'next/head';

export default (): JSX.Element => (
  <React.Fragment>
    <Head>
      <title>Wellcome to A2R!</title>
    </Head>
    <h1>Wellcome to the A2R Framework</h1>
    <img src="/static/logo-principal.svg" alt="A2R Framework" />
  </React.Fragment>
);
