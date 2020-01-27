import React, { useEffect } from 'a2r/react';
import Link from 'a2r/link';
import styled from 'a2r/styled-components';
import api from 'a2r/api';
import { transparentize } from 'a2r/polished';

import { GetPageData } from '../config/data';
import { Data } from '../model/data';

const H1  = styled.h1`
  color: ${transparentize(0.5, '#636')};
  text-align: center;
`;

const Index = (props: Data ): JSX.Element => {
  useEffect(() => {
    api.ping().then((res) => {
      console.log('Ping result: ', res);
    });
  }, []);
  return (
    <>
      <H1>Welcome to the A2R Framework</H1>
      <div>
        Data: {props.info}
        <br />
        <Link href="/test">
          <a>Test</a>
        </Link>
      </div>
      <img src="/img/logo-principal.svg" alt="A2R Framework" />
    </>
  );
};

export const getData: GetPageData<Data> = async () => {
  const data = await api.getData();
  return {...data};
};

export default Index;
