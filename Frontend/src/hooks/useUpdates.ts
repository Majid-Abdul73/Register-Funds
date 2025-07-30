import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { updatesService } from '../services/updates.service';
import { Update } from '../types/update';
import { toast } from 'react-hot-toast';

// Get all updates
export const useUpdates = () => {
  return useQuery({
    queryKey: ['updates'],
    queryFn: updatesService.getAllUpdates,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get updates for a specific campaign
export const useCampaignUpdates = (campaignId: string) => {
  return useQuery({
    queryKey: ['updates', 'campaign', campaignId],
    queryFn: () => updatesService.getAllUpdates(),
    select: (data) => data.filter(update => update.campaignId === campaignId),
    enabled: !!campaignId,
  });
};

// Get single update
export const useUpdate = (id: string) => {
  return useQuery({
    queryKey: ['updates', id],
    queryFn: () => updatesService.getUpdateById(id),
    enabled: !!id,
  });
};

// Create update mutation
export const useCreateUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updatesService.createUpdate,
    onSuccess: (newUpdate) => {
      queryClient.invalidateQueries({ queryKey: ['updates'] });
      queryClient.invalidateQueries({ queryKey: ['updates', 'campaign', newUpdate.campaignId] });
      toast.success('Update created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create update');
    },
  });
};

// Update update mutation
export const useUpdateUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Update> }) => 
      updatesService.updateUpdate(id, data),
    onSuccess: (updatedUpdate, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['updates'] });
      queryClient.invalidateQueries({ queryKey: ['updates', id] });
      queryClient.invalidateQueries({ queryKey: ['updates', 'campaign', updatedUpdate.campaignId] });
      toast.success('Update updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update update');
    },
  });
};

// Delete update mutation
export const useDeleteUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updatesService.deleteUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['updates'] });
      toast.success('Update deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete update');
    },
  });
};