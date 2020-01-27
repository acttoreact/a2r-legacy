import api from 'a2r/api';
import { GetPageData } from '../config/data';

export interface PageData {}

const getData: GetPageData<PageData> = async () => {
  const data = await api.getData();
  return data;
};

export default getData;
