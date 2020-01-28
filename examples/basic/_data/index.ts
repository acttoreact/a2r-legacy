import api from 'a2r/api';
import { GetPageData } from '../config/data';
import { Data } from '../model/data';

export interface PageData extends Data {}

const getData: GetPageData<PageData> = async () => {
  const data = await api.getData();
  return {...data};
};

export default getData;
