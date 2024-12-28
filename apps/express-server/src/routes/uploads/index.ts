import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer 저장소 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/images');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${fileExtension}`);
  },
});

// Multer 미들웨어 생성
const upload = multer({ storage });

// 파일 업로드 라우트
router.post('/', upload.single('image'), (req: Request, res: Response) => {
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
    console.error('Error uploading file:', error);
    return res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
