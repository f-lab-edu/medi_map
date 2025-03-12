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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MedicineFavorite) => addFavoriteApi(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favoriteStatus', variables.medicineId] }); 
    },
  });
};