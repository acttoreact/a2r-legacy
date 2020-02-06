/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextPageContext } from 'next';
import { AppData } from '../../model/data';

type GetData = (ctx: NextPageContext) => Promise<AppData & { data: any }>;

let getData: any;

export const setGetData = (newGetData: GetData): void => {
  getData = newGetData;
};

export const getGetData = (): GetData => {
  return getData as GetData;
};
