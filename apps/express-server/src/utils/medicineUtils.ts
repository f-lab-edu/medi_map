import { Response } from 'express';

export const sendResponse = (res: Response, status: number, data: object) => {
  res.status(status).json(data);
};
