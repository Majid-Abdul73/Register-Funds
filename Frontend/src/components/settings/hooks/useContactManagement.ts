import { ContactPerson, ContactManagementHookProps } from '../types/security.types';

export const useContactManagement = ({ 
  updateSchoolMutation, 
  userId,  
  setSuccess, 
  setError,
  setShowContactModal,
  setEditingContact 
}: ContactManagementHookProps) => {
  
  const handleAddContact = async (contact: ContactPerson, editingContact: ContactPerson | null) => {
    if (!userId) return;
    
    try {
      if (!contact.name || !contact.role) {
        setError('Name and role are required');
        return false;
      }
      
      if (editingContact && editingContact.id === 'school-contact') {
        const updateData: any = { contactName: contact.name };
        if (contact.email) updateData.email = contact.email;
        if (contact.phone) updateData.phone = contact.phone;
        
        await updateSchoolMutation.mutateAsync({ id: userId, data: updateData });
        setSuccess('School contact updated successfully');
      } else {
        const additionalContacts = JSON.parse(localStorage.getItem('additionalContacts') || '[]');
        
        if (editingContact && editingContact.id && editingContact.id !== 'school-contact') {
          const updatedContacts = additionalContacts.map((c: ContactPerson) => 
            c.id === editingContact.id ? { ...contact, id: editingContact.id } : c
          );
          localStorage.setItem('additionalContacts', JSON.stringify(updatedContacts));
          setSuccess('Contact updated successfully');
        } else {
          const newId = `contact-${Date.now()}`;
          const newContactWithId = { ...contact, id: newId };
          additionalContacts.push(newContactWithId);
          localStorage.setItem('additionalContacts', JSON.stringify(additionalContacts));
          setSuccess('Contact added successfully');
        }
      }
      
      setShowContactModal(false);
      setEditingContact(null);
      return true;
    } catch (err) {
      console.error('Error adding/updating contact:', err);
      setError('Failed to add/update contact.');
      return false;
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (contactId === 'school-contact') {
      setError('Cannot delete the main school contact. You can edit it instead.');
      return;
    }
    
    try {
      const additionalContacts = JSON.parse(localStorage.getItem('additionalContacts') || '[]');
      const updatedContacts = additionalContacts.filter((contact: ContactPerson) => contact.id !== contactId);
      localStorage.setItem('additionalContacts', JSON.stringify(updatedContacts));
      setSuccess('Contact deleted successfully');
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact.');
    }
  };

  const handleEditContact = (contact: ContactPerson) => {
    setEditingContact(contact);
    setShowContactModal(true);
  };

  return { handleAddContact, handleDeleteContact, handleEditContact };
};