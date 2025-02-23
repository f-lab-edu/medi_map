import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    file?: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer?: Buffer;
    };
  }
}
