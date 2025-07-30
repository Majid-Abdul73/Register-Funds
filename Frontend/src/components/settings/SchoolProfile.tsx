import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { useSchool, useUpdateSchool } from '../../hooks/useSchools';
import { School } from '../../types/school';
import { toast } from 'react-hot-toast';

interface SchoolData {
  schoolName: string;
  schoolType: string;
  country: string;
  city: string;
  postalAddress?: string;
  email: string;
  phone: string;
}

// Helper function to convert School API data to SchoolData format
const convertSchoolToSchoolData = (school: School): SchoolData => ({
  schoolName: school.schoolName,
  schoolType: school.schoolType,
  country: school.country,
  city: school.city,
  postalAddress: '',
  email: school.email,
  phone: school.phone
});

// Helper function to convert SchoolData to School API format
export const convertSchoolDataToSchool = (schoolData: SchoolData): Partial<School> => ({
  schoolName: schoolData.schoolName,
  schoolType: schoolData.schoolType,
  country: schoolData.country,
  city: schoolData.city,
  email: schoolData.email,
  phone: schoolData.phone
});

export default function SchoolProfile() {
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit mode states
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  
  // Form data for editing
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
  
  const handleSaveBasicInfo = async () => {
    if (!formData || !userId) return;
    
    try {
      setSaving(true);
      
      // Update via API
      // const updateData = {
      //   name: formData.schoolName,
      //   type: formData.schoolType
      // };
      
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
      
      setEditingBasicInfo(false);
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
      
      // Update via API
      const updateData = {
        country: formData.country,
        city: formData.city
      };
      
      await updateSchoolMutation.mutateAsync({
        id: userId,
        data: updateData
      });
      
      // Update local state
      setSchoolData({
        ...schoolData!,
        country: formData.country,
        city: formData.city,
        postalAddress: formData.postalAddress
      });
      
      setEditingAddress(false);
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
      
      // Update via API
      const updateData = {
        email: formData.email,
        phone: formData.phone
      };
      
      await updateSchoolMutation.mutateAsync({
        id: userId,
        data: updateData
      });
      
      // Update local state
      setSchoolData({
        ...schoolData!,
        email: formData.email,
        phone: formData.phone
      });
      
      setEditingContact(false);
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

  if (!schoolData) {
    return <div className="py-8">No school profile data available</div>;
  }

  // Get first letter of school name for avatar
  const schoolInitial = schoolData.schoolName ? schoolData.schoolName.charAt(0) : 'S';

  return (
    <div>
      <h1 className='font-semibold text-2xl mb-1'>Profile Settings</h1>
      <p className="text-gray-500 mb-8">Update your school profile now—trusted campaigns receive more visibility and funding.</p>
      
      <div className="space-y-8">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-register-green">Basic Info</h2>
            {editingBasicInfo ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setFormData(schoolData);
                    setEditingBasicInfo(false);
                  }}
                  className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveBasicInfo}
                  className="px-4 py-2 text-sm bg-register-green text-white rounded-lg"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setEditingBasicInfo(true)}
                className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
              >
                Edit
              </button>
            )}
          </div>
          
          {editingBasicInfo ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">School Name</label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData?.schoolName || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">School Type</label>
                <select
                  name="schoolType"
                  value={formData?.schoolType || ''}
                  onChange={handleInputChange}
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

        <section>
          <div className="flex justify-between items-center mb-4 border-t-2 py-4">
            <h2 className="text-lg font-medium text-register-green">Address</h2>
            {editingAddress ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setFormData(schoolData);
                    setEditingAddress(false);
                  }}
                  className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveAddress}
                  className="px-4 py-2 text-sm bg-register-green text-white rounded-lg"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setEditingAddress(true)}
                className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
              >
                Edit
              </button>
            )}
          </div>
          
          {editingAddress ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Country</label>
                <select
                  name="country"
                  value={formData?.country || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select country</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">City</label>
                <select
                  name="city"
                  value={formData?.city || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select city</option>
                  <option value="Accra">Accra</option>
                  <option value="Kumasi">Kumasi</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Cape Coast">Cape Coast</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-500 mb-1">Postal Address</label>
                <input
                  type="text"
                  name="postalAddress"
                  value={formData?.postalAddress || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Not synced with API - local storage only"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Country</p>
                <p>{schoolData.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">City</p>
                <p>{schoolData.city}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Postal Address</p>
                <p>{schoolData.postalAddress || 'Not provided'}</p>
              </div>
            </div>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-4 border-t-2 py-4">
            <h2 className="text-lg font-medium text-register-green">Contact Information</h2>
            {editingContact ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setFormData(schoolData);
                    setEditingContact(false);
                  }}
                  className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveContact}
                  className="px-4 py-2 text-sm bg-register-green text-white rounded-lg"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setEditingContact(true)}
                className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
              >
                Edit
              </button>
            )}
          </div>
          
          {editingContact ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData?.email || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData?.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p>{schoolData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p>{schoolData.phone}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}