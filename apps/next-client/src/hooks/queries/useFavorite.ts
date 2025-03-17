import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { addFavoriteApi, checkFavoriteApi } from '@/utils/medicineFavorites';
import { MedicineFavorite } from '@/types/medicine.types';
import { FAVORITE_MESSAGES } from '@/constants/errors';

export const useCheckFavorite = (medicineId?: string) => {
  if (!medicineId) {
    throw new Error(FAVORITE_MESSAGES.ID_NOT_FOUND);
  }

  return useSuspenseQuery({
    queryKey: ['favoriteStatus', medicineId],
    queryFn: () => checkFavoriteApi(medicineId),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MedicineFavorite) => addFavoriteApi(data),

    onMutate: async (newFavorite) => {
      await queryClient.cancelQueries({ queryKey: ['favoriteStatus', newFavorite.medicineId] });
      const previousData = queryClient.getQueryData(['favoriteStatus', newFavorite.medicineId]);
      queryClient.setQueryData(['favoriteStatus', newFavorite.medicineId], true);

      return { previousData };
    },

    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['favoriteStatus', variables.medicineId], context.previousData);
      }
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favoriteStatus', variables.medicineId] }); 
    },
  });
};