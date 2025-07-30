import { Request, Response } from 'express';
import { fileUploadService } from '../services/file-upload.service';
import multer from 'multer';

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export const uploadMiddleware = upload.single('file');

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file provided' });
      return;
    }

    const { folder = 'uploads' } = req.body;
    
    // Upload file to AWS S3
    const url = await fileUploadService.uploadFile(
      req.file.buffer,
      folder,
      req.file.originalname
    );

    res.status(200).json({ 
      url,
      message: 'File uploaded successfully to S3'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload file to S3',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};