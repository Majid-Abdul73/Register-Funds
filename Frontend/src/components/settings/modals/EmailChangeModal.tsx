import { useState } from 'react';

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSubmit: (newEmail: string, currentPassword: string) => Promise<boolean>;
  onSuccess: () => void;
}

export const EmailChangeModal = ({ isOpen, onClose, currentEmail, onSubmit, onSuccess }: EmailChangeModalProps) => {
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    const success = await onSubmit(newEmail, currentPassword);
    
    if (success) {
      onSuccess();
      onClose();
      setNewEmail('');
      setCurrentPassword('');
    }
    
    setIsSubmitting(false);
  };

  const handleClose = () => {
    onClose();
    setError(null);
    setNewEmail(currentEmail);
    setCurrentPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-medium mb-4">Change Email</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">New Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        {error && <p className="text-red-500 mt-2">{error}</p>}
        
        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={handleClose}
            className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-register-green text-white rounded-lg"
            disabled={isSubmitting || !newEmail || !currentPassword}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};