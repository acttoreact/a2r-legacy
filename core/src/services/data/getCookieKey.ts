import getProjectInfo from '../../tools/getCurrentProjectInfo';

let cookieKey = '';

const getCookieKey = async (): Promise<string> => {
  if (!cookieKey) {
    const projectInfo = await getProjectInfo();
    cookieKey = `a2r_${projectInfo.name}_sessionId`;
  }
  return cookieKey;
};

export default getCookieKey;
