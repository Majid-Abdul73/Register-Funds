import { useState } from 'react';

interface MultipleImageUploadProps {
  campaignId: string;
  existingImages?: string[];
  onImagesUpdate: (images: string[]) => void;
}

export default function MultipleImageUpload({ campaignId, existingImages = [], onImagesUpdate }: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const uploadMultipleFiles = async (files: FileList) => {
    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `${Date.now()}-${i}`;
        
        // Validate file
        if (file.size > 4 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 4MB.`);
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File ${file.name} is not a valid image format.`);
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        // Simulate upload progress
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // Simulate upload with progress
        await new Promise<void>(resolve => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 20;
            setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
            if (progress >= 100) {
              clearInterval(interval);
              resolve();
            }
          }, 200);
        });

        // Mock URL for the uploaded image
        const mockUrl = `https://mock-image-server.com/campaigns/${campaignId}/additional/${fileName}`;
        uploadedUrls.push(mockUrl);
      }

      // Update with new image URLs
      const updatedImages = [...existingImages, ...uploadedUrls];
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onImagesUpdate(updatedImages);
      setUploadProgress({});
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageUrl: string) => {
    try {
      const updatedImages = existingImages.filter(url => url !== imageUrl);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onImagesUpdate(updatedImages);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && uploadMultipleFiles(e.target.files)}
          className="hidden"
          id="multiple-image-upload"
          disabled={uploading}
        />
        <label
          htmlFor="multiple-image-upload"
          className={`cursor-pointer flex flex-col items-center justify-center space-y-2 ${
            uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
        >
          <span className="text-2xl text-gray-400">📷</span>
          <span className="text-sm text-gray-500">
            {uploading ? 'Uploading...' : 'Click to add more images'}
          </span>
          <span className="text-xs text-gray-400">
            Support: JPEG, PNG, GIF, WebP (Max 4MB each)
          </span>
        </label>
      </div>

      {/* Existing Images Grid */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {existingImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Campaign image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(imageUrl)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}