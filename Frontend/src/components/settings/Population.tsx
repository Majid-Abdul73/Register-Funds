import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { useSchool, useUpdateSchool } from '../../hooks/useSchools';
import { toast } from 'react-hot-toast';
import PopulationUpdateModal from './PopulationUpdateModal';

interface PopulationData {
  students?: {
    male: number;
    female: number;
    total?: number;
  };
  teachers?: {
    total: number;
    steamInvolved: number;
    nonSteamInvolved?: number;
  };
}

export default function Population() {
  const [populationData, setPopulationData] = useState<PopulationData>({
    students: { male: 0, female: 0, total: 0 },
    teachers: { total: 0, steamInvolved: 0, nonSteamInvolved: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<'students' | 'teachers' | null>(null);
  const [editData, setEditData] = useState<PopulationData>({
    students: { male: 0, female: 0 },
    teachers: { total: 0, steamInvolved: 0 }
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Get current user's school data
  const userId = auth.currentUser?.uid;
  const { data: schoolData, isLoading: schoolLoading, error: schoolError, refetch } = useSchool(userId || '');
  const updateSchoolMutation = useUpdateSchool();

  useEffect(() => {
    if (schoolData && !schoolLoading) {
      // Extract population data from school data
      const population: PopulationData = {
        students: {
          male: (schoolData as any).students?.male || 0,
          female: (schoolData as any).students?.female || 0,
          total: (schoolData as any).students?.total || 
            ((schoolData as any).students?.male || 0) + ((schoolData as any).students?.female || 0)
        },
        teachers: {
          total: (schoolData as any).teachers?.total || 0,
          steamInvolved: (schoolData as any).teachers?.steamInvolved || 0,
          nonSteamInvolved: (schoolData as any).teachers?.nonSteamInvolved || 
            ((schoolData as any).teachers?.total || 0) - ((schoolData as any).teachers?.steamInvolved || 0)
        }
      };
      
      setPopulationData(population);
      setEditData({
        students: { 
          male: population.students?.male || 0,
          female: population.students?.female || 0,
          total: population.students?.total
        },
        teachers: { 
          total: population.teachers?.total || 0,
          steamInvolved: population.teachers?.steamInvolved || 0
        }
      });
      setLoading(false);
      setError(null);
    } else if (schoolError) {
      console.error('Error loading school data:', schoolError);
      setError('Failed to load population data');
      setLoading(false);
    }
  }, [schoolData, schoolLoading, schoolError]);

  const handleInputChange = (
    section: 'students' | 'teachers', 
    field: string, 
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    
    setEditData(prev => {
      const newData = { ...prev };
      
      if (section === 'students' && newData.students) {
        newData.students = {
          ...newData.students,
          [field]: numValue
        };
        // Calculate total
        newData.students.total = 
          (newData.students.male || 0) + 
          (newData.students.female || 0);
      } else if (section === 'teachers' && newData.teachers) {
        newData.teachers = {
          ...newData.teachers,
          [field]: numValue
        };
        // Calculate nonSteamInvolved based on total - steamInvolved
        if (field === 'total' || field === 'steamInvolved') {
          const total = field === 'total' ? numValue : (newData.teachers.total || 0);
          const steamInvolved = field === 'steamInvolved' ? numValue : (newData.teachers.steamInvolved || 0);
          newData.teachers.nonSteamInvolved = Math.max(0, total - steamInvolved);
        }
      }
      
      return newData;
    });
  };

  const handleUpdate = async (section: 'students' | 'teachers') => {
    if (!userId) {
      toast.error('You must be logged in to update data');
      return;
    }

    try {
      setUpdateLoading(true);
      setUpdateSuccess(false);
      
      // Prepare update data
      const updateData: any = {};
      
      if (section === 'students') {
        updateData.students = {
          male: editData.students?.male || 0,
          female: editData.students?.female || 0,
          total: (editData.students?.male || 0) + (editData.students?.female || 0)
        };
      } else {
        const total = editData.teachers?.total || 0;
        const steamInvolved = editData.teachers?.steamInvolved || 0;
        updateData.teachers = {
          total: total,
          steamInvolved: steamInvolved,
          nonSteamInvolved: Math.max(0, total - steamInvolved)
        };
      }
      
      // Update school data via API
      await updateSchoolMutation.mutateAsync({
        id: userId,
        data: updateData
      });
      
      // Update local state
      setPopulationData(prev => ({
        ...prev,
        [section]: { ...updateData[section] }
      }));
      
      setUpdateSuccess(true);
      setIsEditing(null);
      
      // Refetch school data to ensure consistency
      refetch();
      
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} data updated successfully!`);
      
      // Show success message briefly
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error(`Error updating ${section} data:`, err);
      toast.error(`Failed to update ${section} data`);
      setError(`Failed to update ${section} data`);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading || schoolLoading) {
    return <div className="flex justify-center items-center py-12">Loading population data...</div>;
  }

  if (error || schoolError) {
    return <div className="text-red-500 py-8">{error || 'Failed to load population data'}</div>;
  }

  return (
    <div>
      <h1 className='font-semibold text-2xl mb-1'>School Population</h1>
      <p className="text-gray-500 mb-8">Share the number of students and teachers affected by your current challenges.</p>      
      {updateSuccess && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
          Population data updated successfully!
        </div>
      )}
      
      <div className="space-y-8">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Students</h2>
            <button 
              onClick={() => setIsEditing('students')} 
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={updateLoading}
            >
              Update
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Males</p>
              <p className="text-xl font-semibold">{populationData.students?.male || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Females</p>
              <p className="text-xl font-semibold">{populationData.students?.female || 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Students</p>
              <p className="text-2xl font-semibold">
                {populationData.students?.total || 0}
              </p>
              <p className="text-sm text-gray-500">Total Student Population</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Teachers</h2>
            <button 
              onClick={() => setIsEditing('teachers')} 
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={updateLoading}
            >
              Update
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Involved in STEAM</p>
              <p className="text-xl font-semibold">{populationData.teachers?.steamInvolved || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Not Involved in STEAM</p>
              <p className="text-xl font-semibold">{populationData.teachers?.nonSteamInvolved || 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Teachers</p>
              <p className="text-2xl font-semibold">
                {populationData.teachers?.total || 0}
              </p>
              <p className="text-sm text-gray-500">Total Teacher Population</p>
            </div>
          </div>
        </section>
      </div>

      {/* Student Population Update Modal */}
      <PopulationUpdateModal
        isOpen={isEditing === 'students'}
        onClose={() => setIsEditing(null)}
        title="Update Student Population"
        description="How many students are affected by this challenge?"
        type="students"
        formData={{
          male: editData.students?.male,
          female: editData.students?.female
        }}
        onInputChange={(field, value) => handleInputChange('students', field, value)}
        onUpdate={() => handleUpdate('students')}
        isLoading={updateLoading}
      />

      {/* Teacher Population Update Modal */}
      <PopulationUpdateModal
        isOpen={isEditing === 'teachers'}
        onClose={() => setIsEditing(null)}
        title="Update Teacher Population"
        description="How many teachers are affected by this challenge?"
        type="teachers"
        formData={{
          total: editData.teachers?.total,
          steamInvolved: editData.teachers?.steamInvolved
        }}
        onInputChange={(field, value) => handleInputChange('teachers', field, value)}
        onUpdate={() => handleUpdate('teachers')}
        isLoading={updateLoading}
      />
    </div>
  );
}