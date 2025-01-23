import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// 업로드 경로 설정 및 폴더 생성
const uploadPath = path.join(__dirname, '../../uploads/images');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer 저장소 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${fileExtension}`);
  },
});

// Multer 미들웨어 생성
const upload = multer({ storage }).single('file') as unknown as NextFunction;

// 파일 업로드 라우트
router.post('/', upload, (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileInfo = {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
    };

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;

    return res.status(200).json({
      message: 'File uploaded successfully',
      file: fileInfo,
      url: imageUrl,
    });
  } catch (error) {
    console.error('Error uploading file:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Server Error', error: error instanceof Error ? error.message : error });
  }
});

export default router;
