import api from 'a2r/api';

export interface PageData {}

const getData: PageData = async () => {
  const data = await api.getData();
  return {...data};
};

export default getData;
