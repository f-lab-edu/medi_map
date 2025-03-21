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
    mutationFn: addFavoriteApi,

    onMutate: async ({ medicineId }) => {
      const queryKey = ['favoriteStatus', medicineId];
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, true);

      return { previousData };
    },

    onError: (err, { medicineId }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['favoriteStatus', medicineId], context.previousData);
      }
    },

    onSettled: (_, __, { medicineId }) => {
      queryClient.invalidateQueries({ queryKey: ['favoriteStatus', medicineId] });
    },
  });
};