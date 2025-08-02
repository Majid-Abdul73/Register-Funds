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
export const uploadMultipleMiddleware = upload.array('files', 10); // Allow up to 10 files

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

// New function to handle multiple file uploads
export const uploadMultipleFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'No files provided' });
      return;
    }

    const { folder = 'uploads' } = req.body;
    
    // Upload all files to AWS S3
    const uploadPromises = files.map(file => 
      fileUploadService.uploadFile(
        file.buffer,
        folder,
        file.originalname
      )
    );

    const urls = await Promise.all(uploadPromises);

    res.status(200).json({ 
      urls,
      message: `${files.length} files uploaded successfully to S3`
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload files to S3',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Check file existence and get metadata
export const checkFileStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileUrl } = req.query;
    
    if (!fileUrl || typeof fileUrl !== 'string') {
      res.status(400).json({ message: 'File URL is required' });
      return;
    }
    
    const fileStatus = await fileUploadService.checkFileExists(fileUrl);
    
    if (fileStatus.exists) {
      const metadata = await fileUploadService.getFileMetadata(fileUrl);
      
      res.status(200).json({
        exists: true,
        fileName: metadata.fileName,
        size: fileStatus.size,
        lastModified: fileStatus.lastModified,
        contentType: fileStatus.contentType,
        formattedSize: formatFileSize(fileStatus.size || 0)
      });
    } else {
      res.status(200).json({
        exists: false
      });
    }
  } catch (error) {
    console.error('File status check error:', error);
    res.status(500).json({ 
      message: 'Failed to check file status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};