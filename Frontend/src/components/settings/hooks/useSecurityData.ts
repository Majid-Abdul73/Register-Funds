import { useState, useEffect } from 'react';
import { auth } from '../../../config/firebase';
import { ContactPerson, SecurityData, SecurityDataHookProps } from '../types/security.types';

export const useSecurityData = ({ schoolData, schoolLoading, schoolError, userId }: SecurityDataHookProps) => {
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        setLoading(true);
        
        if (!userId || schoolError || schoolLoading) {
          if (!userId) setSecurityData(null);
          return;
        }
        
        setSecurityData({
          email: auth.currentUser?.email || 'No email available',
        });
        
        if (schoolData) {
          const schoolContactPerson: ContactPerson = {
            id: 'school-contact',
            name: schoolData.contactName || 'School Representative',
            role: 'School Representative',
            email: schoolData.email,
            phone: schoolData.phone
          };
          
          const additionalContacts = JSON.parse(localStorage.getItem('additionalContacts') || '[]');
          setContactPersons([schoolContactPerson, ...additionalContacts]);
        } else {
          setContactPersons([]);
        }
      } catch (err) {
        console.error('Error fetching security data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
  }, [schoolData, schoolLoading, schoolError, userId]);

  return { securityData, contactPersons, loading, setContactPersons };
};