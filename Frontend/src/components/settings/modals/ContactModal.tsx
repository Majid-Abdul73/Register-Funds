import { useState, useEffect } from 'react';
import { ContactPerson } from '../types/security.types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingContact: ContactPerson | null;
  onSubmit: (contact: ContactPerson, editingContact: ContactPerson | null) => Promise<boolean>;
  onSuccess: (message: string) => void;
  onRemove?: (contactId: string) => Promise<boolean>;
}

export const ContactModal = ({ isOpen, onClose, editingContact, onSubmit, onRemove }: ContactModalProps) => {
  const [contact, setContact] = useState<ContactPerson>({
    name: '',
    role: '',
    email: '',
    phone: '',
    staffId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingContact) {
      setContact({
        name: editingContact.name,
        role: editingContact.role,
        email: editingContact.email || '',
        phone: editingContact.phone || '',
        staffId: editingContact.staffId || ''
      });
    } else {
      setContact({ name: '', role: '', email: '', phone: '', staffId: '' });
    }
  }, [editingContact]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    const success = await onSubmit(contact, editingContact);
    
    if (success) {
      onClose();
      setContact({ name: '', role: '', email: '', phone: '', staffId: '' });
    }
    
    setIsSubmitting(false);
  };

  const handleClose = () => {
    onClose();
    setError(null);
  };

  const handleRemove = async () => {
    if (editingContact && editingContact.id && onRemove) {
      setIsSubmitting(true);
      const success = await onRemove(editingContact.id);
      if (success) {
        onClose();
      }
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
        >
          ×
        </button>
        
        <h2 className="text-lg font-medium mb-6">
          {editingContact ? 'Edit Contact' : 'Add Contact'}
        </h2>
        
        <div className="space-y-4">
          {/* Contact name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact name</label>
            <input
              type="text"
              value={contact.name}
              onChange={(e) => setContact({...contact, name: e.target.value})}
              placeholder="Provide contact name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Email and Staff ID row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({...contact, email: e.target.value})}
                placeholder="email@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staff ID</label>
              <input
                type="text"
                value={contact.staffId}
                onChange={(e) => setContact({...contact, staffId: e.target.value})}
                placeholder="Provide staff ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                onChange={(e) => setContact({...contact, role: e.target.value})}
                placeholder="School Admin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={editingContact?.id === 'school-contact'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => setContact({...contact, phone: e.target.value})}
                placeholder="+233 (555) 000-0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        
        {/* Action buttons */}
        <div className="flex gap-3 mt-8">
          <button 
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            disabled={isSubmitting || !contact.name || !contact.role}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            onClick={handleRemove}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            disabled={isSubmitting || !editingContact || editingContact.id === 'school-contact' || !onRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};