import jsCookie from 'js-cookie';
import Cookies from 'universal-cookie';
import getId from 'shortid';
import React, { useContext } from 'react';
import { NextPageContext, NextComponentType } from 'next';
import getProjectInfo from '../tools/getCurrentProjectInfo';

interface Session {
  id: string;
}

interface Props {
  session: Session;
}

type HOCProps = React.PropsWithChildren<Props>;

const SessionContext = React.createContext<Session>({ id: '' });

// eslint-disable-next-line react/prop-types
const SessionProvider: NextComponentType<{},{},HOCProps> = ({ children, session }) => (
  <SessionContext.Provider value={session} >
    {children}
  </SessionContext.Provider>
);

// eslint-disable-next-line @typescript-eslint/unbound-method
SessionProvider.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const projectInfo = await getProjectInfo();
  const cookieKey = `a2r_${projectInfo.name}_sessionId`;
  const header = ctx.req && ctx.req.headers && ctx.req.headers.cookie;
  const cookies = new Cookies(header);
  let sessionId = cookies.get(cookieKey);

  if (!sessionId) {
    sessionId = getId();
    if (ctx.res) {
      ctx.res.setHeader(
        'Set-Cookie',
        `${encodeURIComponent(cookieKey)}=${encodeURIComponent(sessionId)}`,
      );
    } else {
      jsCookie.set(cookieKey, sessionId);
    }
  }

  const session: Session = {
    id: sessionId,
  };

  return {
    session,
  };
};

export const useSession = (): Session => useContext(SessionContext);

export default SessionProvider;
