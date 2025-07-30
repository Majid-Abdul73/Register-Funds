import { useState } from 'react';

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: any;
  field: 'title' | 'category' | 'description';
  onUpdate: (field: string, value: string) => void;
}

const categories = [
  'Computers & Devices', 'Capacity Building', 'Health & Wellness Support', 
  'Internet Connectivity', 'School Meals & Nutrition', 'Science or STEAM Labs', 
  'Electricity Access', 'Infrastructure',
];

export default function EditCampaignModal({ isOpen, onClose, campaign, field, onUpdate }: EditCampaignModalProps) {
  const [value, setValue] = useState(() => {
    switch (field) {
      case 'title': return campaign?.name || '';
      case 'category': return campaign?.category || '';
      case 'description': return campaign?.description || '';
      default: return '';
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!value.trim()) {
      setError('This field cannot be empty');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would update a database
      console.log(`Campaign updated: ${campaign.id}, Field: ${field}, Value: ${value}`);
      
      onUpdate(field, value);
      onClose();
    } catch (error) {
      console.error('Error updating campaign:', error);
      setError('Failed to update campaign. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Edit {field === 'title' ? 'Campaign Title' : field.charAt(0).toUpperCase() + field.slice(1)}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {field === 'category' ? (
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-register-green"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        ) : field === 'description' ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-register-green"
            placeholder={`Enter ${field}...`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-register-green"
            placeholder={`Enter ${field}...`}
          />
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !value.trim()}
            className="flex-1 py-2 px-4 bg-register-green text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? 'Saving' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}