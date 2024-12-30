import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response): Response => {
  return res.status(200).json({
    status: 'OK',
    message: 'Server is running smoothly',
    timestamp: new Date().toISOString(),
  });
};
