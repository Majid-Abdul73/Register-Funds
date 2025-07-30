import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
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
      // Generate a unique file name
      const fileExtension = originalName.split('.').pop();
      const fileName = `${folder}/${uuidv4()}.${fileExtension}`;
      
      // Upload the file to S3
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file,
        ContentType: this.getContentType(fileExtension || ''),
        ACL: 'public-read', // Make file publicly accessible
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
  
  /**
   * Delete a file from AWS S3
   * @param fileUrl The public URL of the file to delete
   * @returns Promise indicating success
   */
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
  
  /**
   * Get the content type based on file extension
   * @param extension File extension
   * @returns Content type string
   */
  private getContentType(extension: string): string {
    const contentTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'txt': 'text/plain'
    };
    
    return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
  }
}

export const fileUploadService = new FileUploadService();