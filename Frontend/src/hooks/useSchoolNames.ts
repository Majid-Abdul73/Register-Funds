import { useQueries } from '@tanstack/react-query';
import { schoolsService } from '../services/schools.service';
import { Campaign } from '../types/campaign';

export const useSchoolNames = (campaigns: Campaign[] | undefined) => {
  const schoolQueries = useQueries({
    queries: campaigns?.map(campaign => ({
      queryKey: ['schools', campaign.schoolId],
      queryFn: () => schoolsService.getSchoolById(campaign.schoolId),
      enabled: !!campaign.schoolId,
      staleTime: 10 * 60 * 1000, // 10 minutes
    })) || [],
  });

  const schoolNamesMap = schoolQueries.reduce((acc, query, index) => {
    if (campaigns && query.data) {
      acc[campaigns[index].schoolId] = query.data.schoolName;
    }
    return acc;
  }, {} as Record<string, string>);

  return {
    schoolNamesMap,
    isLoading: schoolQueries.some(query => query.isLoading),
    errors: schoolQueries.filter(query => query.error).map(query => query.error),
  };
};