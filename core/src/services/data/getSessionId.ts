import Cookies from 'universal-cookie';
import jsCookie from 'js-cookie';
import getId from 'shortid';
import { NextPageContext } from "next";

import getCookieKey from './getCookieKey';

const getSessionId = async (ctx: NextPageContext): Promise<string> => {
  const cookieKey = await getCookieKey();
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

  return sessionId;
};

export default getSessionId;
