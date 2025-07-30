import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Campaign {
  id: string;
  name: string;
  description: string;
  category: string;
  [key: string]: any;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  loading: boolean;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const EditModal = ({ isOpen, onClose, title, value, onChange, onSave, loading }: EditModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4 min-h-[100px]"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-register-green text-white rounded-md"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const DeleteModal = ({ isOpen, onClose, onConfirm, loading }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Delete Campaign</h2>
        <p className="mb-6">Are you sure you want to delete this campaign? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-register-red text-white rounded-md"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const useCampaignActions = (campaign: Campaign | null) => {
  const navigate = useNavigate();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editField, setEditField] = useState<'name' | 'category' | 'description' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openEditModal = (field: 'name' | 'category' | 'description') => {
    if (!campaign) return;
    
    setEditField(field);
    setEditValue(campaign[field === 'name' ? 'name' : field]);
  };

  const closeEditModal = () => {
    setEditField(null);
    setEditValue('');
  };

  const handleUpdate = async () => {
    if (!campaign || !editField || !editValue.trim()) return;
    
    setUpdateLoading(true);
    try {
      // Mock update - just log the change
      console.log(`Updating ${editField} to ${editValue}`);
      
      // In a real app, you would update the database here
      // await updateDoc(doc(db, 'campaigns', campaign.id), {
      //   [editField === 'name' ? 'name' : editField]: editValue.trim()
      // });
      
      // Close the modal
      closeEditModal();
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Failed to update campaign. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!campaign) return;
    
    setDeleteLoading(true);
    try {
      // Mock deletion - just navigate away
      // await deleteDoc(doc(db, 'campaigns', campaign.id));
      navigate('/campaigns');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign. Please try again.');
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return {
    editField,
    editValue,
    updateLoading,
    deleteLoading,
    isDeleteModalOpen,
    setEditValue,
    openEditModal,
    closeEditModal,
    handleUpdate,
    setIsDeleteModalOpen,
    handleDelete
  };
};