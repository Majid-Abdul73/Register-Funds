import { useState } from 'react';
import { EditableSectionProps } from '../../../types/schoolProfile';

export default function AddressSection({
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
        <h2 className="text-lg font-medium text-register-green">Address</h2>
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
            <label className="block text-sm text-gray-500 mb-1">Address Line 1</label>
            <input
              type="text"
              name="addressLine1"
              value={formData?.addressLine1 || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Opposite Aboom Clinic"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Address Line 2</label>
            <input
              type="text"
              name="addressLine2"
              value={formData?.addressLine2 || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Pedu Estate, Cape Coast"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Digital Address</label>
            <input
              type="text"
              name="digitalAddress"
              value={formData?.digitalAddress || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., CC-123-4567"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Town/City</label>
            <select
              name="city"
              value={formData?.city || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select city</option>
              <option value="Accra">Accra</option>
              <option value="Kumasi">Kumasi</option>
              <option value="Cape Coast">Cape Coast</option>
              <option value="Tamale">Tamale</option>
              <option value="Sekondi-Takoradi">Sekondi-Takoradi</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-500 mb-1">District/Region</label>
            <input
              type="text"
              name="district"
              value={formData?.district || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Cape Coast Metropolis, Central Region"
              list="district-suggestions"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">Address Line 1</p>
            <p>{schoolData.addressLine1 || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Address Line 2</p>
            <p>{schoolData.addressLine2 || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Digital Address</p>
            <p>{schoolData.digitalAddress || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Town/City</p>
            <p>{schoolData.city}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500 mb-1">District/Region</p>
            <p>{schoolData.district || 'Not provided'}</p>
          </div>
        </div>
      )}
    </section>
  );
}