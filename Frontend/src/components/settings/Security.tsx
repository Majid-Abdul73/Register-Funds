import { useState} from 'react';
import { auth } from '../../config/firebase';
import { useSchool, useUpdateSchool } from '../../hooks/useSchools';
import { useSecurityData } from './hooks/useSecurityData';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { useContactManagement } from './hooks/useContactManagement';
import { EmailChangeModal } from './modals/EmailChangeModal';
import { PasswordChangeModal } from './modals/PasswordChangeModal';
import { ContactModal } from './modals/ContactModal';
import { ContactPerson } from './types/security.types';
import { ViewProfileModal } from './modals/ViewProfileModal';

export default function Security() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactPerson | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Add these missing state variables
  const [showViewProfileModal, setShowViewProfileModal] = useState(false);
  const [viewingContact, setViewingContact] = useState<ContactPerson | null>(null);

  const userId = auth.currentUser?.uid;
  const { data: schoolData, isLoading: schoolLoading, error: schoolError } = useSchool(userId || '');
  const updateSchoolMutation = useUpdateSchool();

  const { securityData, contactPersons, loading } = useSecurityData({
    schoolData,
    schoolLoading,
    schoolError,
    userId
  });

  const { handleChangeEmail, handleChangePassword, handleResetPassword } = useFirebaseAuth({
    updateSchoolMutation,
    schoolData,
    userId,
    setSuccess,
    setError
  });

  const { handleAddContact, handleDeleteContact } = useContactManagement({
    updateSchoolMutation,
    userId,
    contactPersons,
    setSuccess,
    setError,
    setShowContactModal,
    setEditingContact
  });

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const openContactModal = (contact?: ContactPerson) => {
    setEditingContact(contact || null);
    setShowContactModal(true);
  };

  // Add this missing function
  const openViewProfileModal = (contact: ContactPerson) => {
    setViewingContact(contact);
    setShowViewProfileModal(true);
  };

  if (loading || schoolLoading) {
    return <div className="flex justify-center items-center py-12">Loading security settings...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-8">{error}</div>;
  }

  if (!securityData) {
    return <div className="py-8">No security data available</div>;
  }

  return (
    <div>
      <h1 className='font-semibold text-2xl mb-1'>Security Settings</h1>
      <p className="text-gray-500 mb-8">Keep your account safe and your school's information protected.</p>
      
      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
          {success}
        </div>
      )}
      
      <div className="space-y-8">
        {/* Email Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{securityData.email}</p>
            </div>
            <button 
              onClick={() => setShowEmailModal(true)}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
            >
              Change Email
            </button>
          </div>
        </section>

        {/* Password Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Password</p>
              <p>••••••••</p>
            </div>
            <div className="space-x-2">
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
              >
                Change Password
              </button>
              <button 
                onClick={() => handleResetPassword().then(() => showSuccess('Password reset email sent. Please check your inbox.'))}
                className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
              >
                Reset Password
              </button>
            </div>
          </div>
        </section>

        {/* Contact Persons Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Contact Person(s)</h2>
            <button 
              onClick={() => openContactModal()}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
            >
              Add a New Contact
            </button>
          </div>
          
          <div className="space-y-4">
            {contactPersons.length > 0 ? (
              contactPersons.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => openViewProfileModal(contact)}>
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-xl text-white">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{contact.name}</h3>
                      <p className="text-gray-500">{contact.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openContactModal(contact)}
                      className="px-3 py-1 text-sm bg-gray-100 rounded-lg"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteContact(contact.id!)}
                      className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 py-2">No contact persons added yet</div>
            )}
          </div>
        </section>
      </div>

      {/* Modals */}
      <EmailChangeModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        currentEmail={securityData.email}
        onSubmit={async (...args) => (await handleChangeEmail(...args)) || false}
        onSuccess={() => showSuccess('Email updated successfully')}
      />

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={async (...args) => (await handleChangePassword(...args)) || false}
        onSuccess={() => showSuccess('Password updated successfully')}
      />

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        editingContact={editingContact}
        onSubmit={async (contact, editingContact) => {
          const result = await handleAddContact(contact, editingContact);
          return result || false;
        }}
        onRemove={async (contactId) => {
          const result = await handleDeleteContact(contactId);
          return result !== undefined ? result : false;
        }}
        onSuccess={showSuccess}
      />

      <ViewProfileModal
        isOpen={showViewProfileModal}
        onClose={() => setShowViewProfileModal(false)}
        contact={viewingContact}
      />
    </div>
  );
}