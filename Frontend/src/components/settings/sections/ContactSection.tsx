import { useState } from 'react';
import { EditableSectionProps } from '../../../types/schoolProfile';

export default function ContactSection({
  schoolData,
  formData,
  saving,
  onInputChange,
  onSave,
  onCancel
}: EditableSectionProps) {
  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    await onSave();
    setEditing(false);
  };

  const handleCancel = () => {
    onCancel();
    setEditing(false);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4 border-t-2 py-4">
        <h2 className="text-lg font-medium text-register-green">Contact Information</h2>
        {editing ? (
          <div className="flex gap-2">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-register-green text-white rounded-lg"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setEditing(true)}
            className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
          >
            Edit
          </button>
        )}
      </div>
      
      {editing ? (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData?.email || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData?.phone || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Postal Address</label>
            <input
              type="text"
              name="postalAddress"
              value={formData?.postalAddress || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., P.O. Box 241, Cape Coast, Central Region"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">Email Address</p>
            <p>{schoolData.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone</p>
            <p>{schoolData.phone}</p>
          </div>
          <div className="">
            <p className="text-sm text-gray-500 mb-1">Postal Address</p>
            <p>{schoolData.postalAddress || 'Not provided'}</p>
          </div>
        </div>
      )}
    </section>
  );
}