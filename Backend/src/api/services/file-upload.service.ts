import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import environment from '../../config/environment';

export class FileUploadService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: environment.aws.region,
      credentials: {
        accessKeyId: environment.aws.accessKeyId!,
        secretAccessKey: environment.aws.secretAccessKey!,
      },
    });
    this.bucketName = environment.aws.s3BucketName!;
  }

  /**
   * Upload a file to AWS S3
   * @param file The file buffer to upload
   * @param folder The folder path in storage
   * @param originalName Original file name
   * @returns Promise with the public URL of the uploaded file
   */
  async uploadFile(file: Buffer, folder: string, originalName: string): Promise<string> {
    try {
      // Preserve original filename with timestamp prefix for uniqueness
      const timestamp = Date.now();
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
      const fileName = `${folder}/${timestamp}_${sanitizedName}`;
      
      // Get file extension for content type
      const fileExtension = originalName.split('.').pop();
      
      // Upload the file to S3
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file,
        ContentType: this.getContentType(fileExtension || ''),
      });
      
      await this.s3Client.send(command);
      
      // Return the public URL
      const publicUrl = `https://${this.bucketName}.s3.${environment.aws.region}.amazonaws.com/${fileName}`;
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  }
  
  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Extract the file key from the URL
      const baseUrl = `https://${this.bucketName}.s3.${environment.aws.region}.amazonaws.com/`;
      const fileKey = fileUrl.replace(baseUrl, '');
      
      // Delete the file from S3
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });
      
      await this.s3Client.send(command);
      
      return true;
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error('Failed to delete file from S3');
    }
  }
  
  private getContentType(extension: string): string {
    const contentTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif',
      'webp': 'image/webp', 'pdf': 'application/pdf', 'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'txt': 'text/plain'
    };
    
    return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  /**
   * Check if a file exists in S3 and get its metadata
   * @param fileUrl The public URL of the file
   * @returns Promise with file existence status and metadata
   */
  async checkFileExists(fileUrl: string): Promise<{
    exists: boolean;
    size?: number;
    lastModified?: Date;
    contentType?: string;
  }> {
    try {
      // Extract the file key from the URL
      const baseUrl = `https://${this.bucketName}.s3.${environment.aws.region}.amazonaws.com/`;
      const fileKey = fileUrl.replace(baseUrl, '');
      
      // Check if file exists using HeadObjectCommand
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });
      
      const response = await this.s3Client.send(command);
      
      return {
        exists: true,
        size: response.ContentLength,
        lastModified: response.LastModified,
        contentType: response.ContentType,
      };
    } catch (error: any) {
      // If error code is NoSuchKey or NotFound, file doesn't exist
      if (error.name === 'NoSuchKey' || error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return { exists: false };
      }
      
      console.error('Error checking file existence:', error);
      throw new Error('Failed to check file existence');
    }
  }

  /**
   * Get file metadata from URL
   * @param fileUrl The public URL of the file
   * @returns Promise with file metadata
   */
  async getFileMetadata(fileUrl: string): Promise<{
    fileName: string;
    size?: number;
    contentType?: string;
  }> {
    const fileStatus = await this.checkFileExists(fileUrl);
    
    // Extract filename from URL
    const urlParts = fileUrl.split('/');
    const fullFileName = urlParts[urlParts.length - 1];
    
    // Clean filename by removing timestamp prefix
    const cleanFileName = fullFileName.replace(/^\d+_/, '');
    
    return {
      fileName: cleanFileName,
      size: fileStatus.size,
      contentType: fileStatus.contentType,
    };
  }
}

export const fileUploadService = new FileUploadService();