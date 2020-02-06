import React, { Fragment } from 'a2r/react';
import Head from 'a2r/head';
import { useRouter } from 'a2r/router';

export interface TestProps {
  userName: string;
}

const Test = (): JSX.Element => {
  const router = useRouter();
  const { projectName, id } = router.query;
  return (
    <Fragment>
      <Head>
        <title>Project / User</title>
      </Head>
      <div>
        Project: {projectName}
        <br />
        User ID: {id}
        <br />
      </div>
    </Fragment>
  );
};

Test.displayName = 'Test';

export default Test;
