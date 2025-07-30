import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schoolsService } from '../services/schools.service';
import { School } from '../types/school';
import { toast } from 'react-hot-toast';

// Get all schools
export const useSchools = () => {
  return useQuery({
    queryKey: ['schools'],
    queryFn: schoolsService.getAllSchools,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single school
export const useSchool = (id: string) => {
  return useQuery({
    queryKey: ['schools', id],
    queryFn: () => schoolsService.getSchoolById(id),
    enabled: !!id,
  });
};

// Create school mutation
export const useCreateSchool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: schoolsService.createSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success('School created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create school');
    },
  });
};

// Update school mutation
export const useUpdateSchool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<School> }) => 
      schoolsService.updateSchool(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      queryClient.invalidateQueries({ queryKey: ['schools', id] });
      toast.success('School updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update school');
    },
  });
};

// Delete school mutation
export const useDeleteSchool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: schoolsService.deleteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success('School deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete school');
    },
  });
};