import path from 'path';
import express from 'express';
import cors from 'cors';

const staticPath = path.resolve(__dirname, '../static');

const applyMiddlewares = (expressApp: express.Application): void => {
  expressApp.use(express.static(staticPath));
  expressApp.use(cors());
};

export default applyMiddlewares;
