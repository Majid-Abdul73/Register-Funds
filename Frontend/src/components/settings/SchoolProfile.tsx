import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { useSchool, useUpdateSchool } from '../../hooks/useSchools';
import { SchoolData } from '../../types/schoolProfile';
import { convertSchoolToSchoolData } from '../../utils/schoolProfileUtils';
import BasicInfoSection from './sections/BasicInfoSection';
import AddressSection from './sections/AddressSection';
import ContactSection from './sections/ContactSection';
import { toast } from 'react-hot-toast';

export default function SchoolProfile() {
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SchoolData | null>(null);
  const [saving, setSaving] = useState(false);

  // Get current user's school data using real API
  const userId = auth.currentUser?.uid;
  const { data: apiSchoolData, isLoading: schoolLoading, error: schoolError } = useSchool(userId || '');
  const updateSchoolMutation = useUpdateSchool();

  // Load school data from API
  useEffect(() => {
    if (apiSchoolData && !schoolLoading) {
      const convertedData = convertSchoolToSchoolData(apiSchoolData);
      setSchoolData(convertedData);
      setLoading(false);
      setError(null);
    } else if (schoolError) {
      console.error('Error loading school data:', schoolError);
      setError('Failed to load school data');
      setLoading(false);
      toast.error('Failed to load school profile');
    } else if (!schoolLoading && !apiSchoolData && userId) {
      setError('No school profile found');
      setLoading(false);
    }
  }, [apiSchoolData, schoolLoading, schoolError, userId]);
  
  // Set form data when school data is loaded
  useEffect(() => {
    if (schoolData) {
      setFormData(schoolData);
    }
  }, [schoolData]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = () => {
    setFormData(schoolData);
  };
  
  const handleSaveBasicInfo = async () => {
    if (!formData || !userId) return;
    
    try {
      setSaving(true);
      
      await updateSchoolMutation.mutateAsync({
        id: userId,
        data: {
          schoolName: formData.schoolName,
          schoolType: formData.schoolType
        }
      });
      
      // Update local state
      setSchoolData({
        ...schoolData!,
        schoolName: formData.schoolName,
        schoolType: formData.schoolType
      });
      
      toast.success('Basic information updated successfully');
    } catch (err) {
      console.error('Error updating basic info:', err);
      toast.error('Failed to update basic information');
    } finally {
      setSaving(false);
    }
  };
  
  const handleSaveAddress = async () => {
    if (!formData || !userId) return;
    
    try {
      setSaving(true);
      
      const updateData = {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        digitalAddress: formData.digitalAddress,
        city: formData.city,
        district: formData.district,
        country: formData.country
      };
      
      await updateSchoolMutation.mutateAsync({
        id: userId,
        data: updateData
      });
      
      // Update local state
      setSchoolData({
        ...schoolData!,
        ...updateData
      });
      
      toast.success('Address updated successfully');
    } catch (err) {
      console.error('Error updating address:', err);
      toast.error('Failed to update address information');
    } finally {
      setSaving(false);
    }
  };
  
  const handleSaveContact = async () => {
    if (!formData || !userId) return;
    
    try {
      setSaving(true);
      
      const updateData = {
        email: formData.email,
        phone: formData.phone,
        postalAddress: formData.postalAddress
      };
      
      await updateSchoolMutation.mutateAsync({
        id: userId,
        data: updateData
      });
      
      // Update local state
      setSchoolData({
        ...schoolData!,
        ...updateData
      });
      
      toast.success('Contact information updated successfully');
    } catch (err) {
      console.error('Error updating contact info:', err);
      toast.error('Failed to update contact information');
    } finally {
      setSaving(false);
    }
  };

  if (loading || schoolLoading) {
    return <div className="flex justify-center items-center py-12">Loading school profile...</div>;
  }

  if (error || schoolError) {
    return <div className="text-red-500 py-8">{error || 'Failed to load school profile'}</div>;
  }

  if (!schoolData || !formData) {
    return <div className="py-8">No school profile data available</div>;
  }

  // Get first letter of school name for avatar
  const schoolInitial = schoolData.schoolName ? schoolData.schoolName.charAt(0) : 'S';

  return (
    <div>
      <h1 className='font-semibold text-2xl mb-1'>Profile Settings</h1>
      <p className="text-gray-500 mb-8">Update your school profile now—trusted campaigns receive more visibility and funding.</p>
      
      <div className="space-y-8">
        <BasicInfoSection
          schoolData={schoolData}
          formData={formData}
          saving={saving}
          onInputChange={handleInputChange}
          onSave={handleSaveBasicInfo}
          onCancel={handleCancel}
          schoolInitial={schoolInitial}
        />

        <AddressSection
          schoolData={schoolData}
          formData={formData}
          saving={saving}
          onInputChange={handleInputChange}
          onSave={handleSaveAddress}
          onCancel={handleCancel}
        />

        <ContactSection
          schoolData={schoolData}
          formData={formData}
          saving={saving}
          onInputChange={handleInputChange}
          onSave={handleSaveContact}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}