import { useState } from 'react';
import { EditableSectionProps } from '../../../types/schoolProfile';

interface BasicInfoSectionProps extends EditableSectionProps {
  schoolInitial: string;
}

export default function BasicInfoSection({
  schoolData,
  formData,
  saving,
  onInputChange,
  onSave,
  onCancel,
  schoolInitial
}: BasicInfoSectionProps) {
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-register-green">Basic Info</h2>
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">School Name</label>
            <input
              type="text"
              name="schoolName"
              value={formData?.schoolName || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">School Type</label>
            <select
              name="schoolType"
              value={formData?.schoolType || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select school type</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
            {schoolInitial}
          </div>
          <div>
            <h3 className="font-medium">{schoolData.schoolName}</h3>
            <p className="text-gray-500">{schoolData.schoolType} School</p>
          </div>
        </div>
      )}
    </section>
  );
}