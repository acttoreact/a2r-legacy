import React, { Fragment } from 'a2r/react';
import Head from 'a2r/head';
import Link from 'a2r/link';
import styled from 'a2r/styled-components';

import { useSessionId } from './_app';

const H1  = styled.h1`
  color: #336;
  text-align: center;
`;

const Test = (): JSX.Element => {
  const sessionId = useSessionId();
  console.log('session id at test:', sessionId);
  return (
    <Fragment>
      <Head>
        <title>Testing A2R!</title>
      </Head>
      <H1>Testing Styled Components</H1>
      <br />
      <Link href="/">
        <a>Index</a>
      </Link>
    </Fragment>
  );
};

export default Test;
