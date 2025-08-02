import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import RichTextEditor from './RichTextEditor';
import { useCreateCampaign } from '../../hooks/useCampaigns';
import { fileUploadService } from '../../services/fileUpload.service';

export default function CampaignForm() {
  const navigate = useNavigate();
  const createCampaignMutation = useCreateCampaign();
  
  const [formData, setFormData] = useState({
    name: '',
    media: null as File | null,
    category: '',
    description: '',
    donationTarget: '',
    additionalImages: [] as string[]
  });
  const [error, setError] = useState<string | null>(null);
  const [showDescriptionTips, setShowDescriptionTips] = useState(false);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Real authentication check using Firebase
  const checkAuth = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }
    return {
      id: currentUser.uid,
      email: currentUser.email || '',
      name: currentUser.displayName || 'User'
    };
  };

  const validateFile = (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      throw new Error('File size must be less than 4MB');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const currentUser = checkAuth();
    if (!currentUser) {
      setError('Please login to create a campaign');
      navigate('/login');
      return;
    }

    // Validate all required fields
    if (!formData.name.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    if (!formData.media) {
      setError('Please upload challenge media');
      return;
    }

    if (!formData.category) {
      setError('Please select a challenge category');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }

    const targetAmount = parseFloat(formData.donationTarget);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      setError('Please enter a valid donation target amount');
      return;
    }

    if (additionalImageFiles.length < 3) {
      setError('Please upload at least 3 additional images');
      return;
    }

    if (additionalImageFiles.length > 5) {
      setError('Please upload no more than 5 additional images');
      return;
    }

    try {
      setUploading(true);
      let mediaUrl = '';
      let additionalImageUrls: string[] = [];
      
      // Validate and upload main media
      if (formData.media) {
        validateFile(formData.media);
        mediaUrl = await fileUploadService.uploadFile(formData.media, 'campaigns');
      }

      // Validate and upload additional images
      if (additionalImageFiles.length > 0) {
        // Validate all files first
        additionalImageFiles.forEach(validateFile);
        additionalImageUrls = await fileUploadService.uploadMultipleFiles(additionalImageFiles, 'campaigns');
      }

      const campaignData = {
        name: formData.name,
        mediaUrl,
        category: formData.category,
        description: formData.description,
        goal: targetAmount,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        status: 'active',
        schoolId: currentUser.id,
        amountRaised: 0,
        additionalImages: additionalImageUrls
      };

      // Use the real API mutation
      await createCampaignMutation.mutateAsync(campaignData);
      
      // Reset form
      setFormData({
        name: '',
        media: null,
        category: '',
        description: '',
        donationTarget: '',
        additionalImages: []
      });
      setAdditionalImageFiles([]);
      
      navigate('/dashboard');

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error creating campaign');
      console.error('Error creating campaign:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, media: e.target.files![0] }));
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = [...additionalImageFiles, ...files].slice(0, 5);
      setAdditionalImageFiles(newFiles);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md">
          {error}
        </div>
      )}
      {/* Name of your challenge */}
      <div>
        <h2 className="text-lg font-medium mb-2">Name of your challenge</h2>
        <p className="text-sm text-gray-500 mb-2">
          Lorem ipsum dolor sit amet consectetur. Molestie leo nulla sed a facilisis aliquet massa.
        </p>
        <div className="relative">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 60) {
                setFormData(prev => ({ ...prev, name: value }));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-register-green"
            placeholder="Enter the title of the campaign"
            required
            maxLength={100}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">Maximum 60 characters</span>
            <span className={`text-xs ${
              formData.name.length > 50 ? 'text-red-500' : 'text-gray-400'
            }`}>
              {formData.name.length}/60
            </span>
          </div>
        </div>
      </div>

      {/* Upload Challenge Media */}
      <div>
        <h2 className="text-lg font-medium mb-2">Upload Challenge Media</h2>
        <p className="text-sm text-gray-500 mb-2">
          Lorem ipsum dolor sit amet consectetur. Molestie leo nulla sed a facilisis aliquet massa.
        </p>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const files = e.dataTransfer.files;
            if (files && files[0]) {
              setFormData(prev => ({ ...prev, media: files[0] }));
            }
          }}
        >
          {formData.media ? (
            <div className="relative">
              <img 
                src={URL.createObjectURL(formData.media)} 
                alt="Preview" 
                className="max-w-full max-h-[400px] mx-auto rounded"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, media: null }))}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <img src="/images/upload.svg" alt="upload" />
                <p className="text-sm text-register-green mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleMediaChange}
                className="hidden"
                id="media-upload"
                required
              />
              <label
                htmlFor="media-upload"
                className="mt-4 inline-block cursor-pointer"
              >
                <div className="bg-white text-register-green border border-register-green px-4 py-2 rounded-md hover:bg-register-green hover:text-white transition-colors">
                  Select Files
                </div>
              </label>
            </>
          )}
        </div>
      </div>

      {/* Additional Images Upload Section */}
      <div>
        <h2 className="text-lg font-medium mb-2">Additional Campaign Images</h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload 3-5 additional images to showcase your campaign. These images will help tell your story and engage potential donors.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Images uploaded: {additionalImageFiles.length}/5
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              additionalImageFiles.length >= 3 && additionalImageFiles.length <= 5
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {additionalImageFiles.length < 3 
                ? `Need ${3 - additionalImageFiles.length} more` 
                : additionalImageFiles.length > 5 
                ? `${additionalImageFiles.length - 5} too many`
                : 'Perfect!'}
            </span>
          </div>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleAdditionalImagesChange}
              className="hidden"
              id="additional-images-upload"
              disabled={additionalImageFiles.length >= 5}
            />
            <label
              htmlFor="additional-images-upload"
              className={`cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                additionalImageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl text-gray-400">📷</span>
              <span className="text-sm text-gray-500">
                {additionalImageFiles.length >= 5 ? 'Maximum images reached' : 'Click to add more images'}
              </span>
              <span className="text-xs text-gray-400">
                Support: JPEG, PNG, GIF, WebP (Max 4MB each)
              </span>
            </label>
          </div>

          {/* Images Preview Grid */}
          {additionalImageFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {additionalImageFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Additional image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Select Challenge Category */}
      <div>
        <h2 className="text-lg font-medium mb-2">Select Challenge Category</h2>
        <p className="text-sm text-gray-500 mb-4">
          Lorem ipsum dolor sit amet consectetur. Molestie leo nulla sed a facilisis aliquet massa.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Computers & Devices', 'Capacity Building', 'Health & Wellness Support', 'Internet Connectivity',
            'School Meals & Nutrition', 'Science or STEAM Labs', 'Electricity Access', 'Infrastructure'].map((cat, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                formData.category === cat
                  ? 'bg-register-green text-white hover:bg-green-600'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rich Text Description Editor */}
      <RichTextEditor
        value={formData.description}
        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
        placeholder="Tell your story."
        // maxLength={1000}
        showTips={showDescriptionTips}
        onToggleTips={() => setShowDescriptionTips(!showDescriptionTips)}
        onWriteWithAI={() => {
          // Add your AI integration logic here
          console.log('Write with AI clicked');
          // You can integrate with OpenAI, Claude, or other AI services
        }}
      />

      {/* Donation Target */}
      <div>
        <h2 className="text-lg font-medium mb-2">Donation Target</h2>
        <div className="relative inline-flex items-center border-gray-500">
          <div className='flex items-center'>
            <span className="absolute left-3 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.donationTarget}
              onChange={(e) => setFormData(prev => ({ ...prev, donationTarget: e.target.value }))}
              className="w-64 pl-7 pr-20 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-register-green"
              placeholder="1000.00"
              required
            />
          </div>
          
          <div className="absolute right-0 h-full px-8 text-gray-500 border-l-2 flex items-center rounded-r-md">
            USD
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          createCampaignMutation.isPending || 
          uploading || 
          !formData.name.trim() ||
          !formData.media ||
          !formData.category ||
          !formData.description.trim() ||
          !formData.donationTarget ||
          additionalImageFiles.length < 3 || 
          additionalImageFiles.length > 5
        }
        className={`bg-register-green text-white px-6 py-2 rounded-md transition-colors ${
          createCampaignMutation.isPending || 
          uploading || 
          !formData.name.trim() ||
          !formData.media ||
          !formData.category ||
          !formData.description.trim() ||
          !formData.donationTarget ||
          additionalImageFiles.length < 3 || 
          additionalImageFiles.length > 5
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-green-600'
        }`}
      >
        {createCampaignMutation.isPending || uploading ? 'Creating campaign...' : 'Start your campaign'}
      </button>
    </form>
  );
}
