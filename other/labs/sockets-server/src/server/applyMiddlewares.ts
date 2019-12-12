import express from 'express';
import cors from 'cors';

const applyMiddlewares = (expressApp: express.Application): void => {
  expressApp.use(cors());
};

export default applyMiddlewares;
