import { ContactPerson } from '../types/security.types';

interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactPerson | null;
}

export const ViewProfileModal = ({ isOpen, onClose, contact }: ViewProfileModalProps) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
        >
          ×
        </button>
        
        <h2 className="text-lg font-medium mb-6 text-green-600">
          View Profile
        </h2>
        
        {/* Profile Picture Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-2xl text-white">
            {contact.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-medium">{contact.name}</h3>
            <p className="text-gray-500 text-sm">Click to update profile picture</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Email and Staff ID row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={contact.email || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staff ID</label>
              <input
                type="text"
                value={contact.staffId || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
          </div>
          
          {/* Role and Phone Number row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value={contact.role}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={contact.phone || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3 mt-8">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Save Changes
          </button>
          <button 
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};