import { GetPageData } from '../../../config/data';
import { TestProps } from '../../../pages/project/[projectName]/[id]';

const getData: GetPageData<TestProps> = (a2rContext) => {
  const { globalProps, session } = a2rContext;
  return {
    ...globalProps,
    userName: `user_${session.id}`,
  };
};

export default getData;
