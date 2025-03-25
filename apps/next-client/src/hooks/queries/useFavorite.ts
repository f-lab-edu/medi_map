import { useMutation, useSuspenseQuery, useQueryClient, useQuery } from '@tanstack/react-query';
import { addFavoriteApi, checkFavoriteApi } from '@/utils/medicineFavorites';
import { FAVORITE_MESSAGES } from '@/constants/errors';
import { axiosInstance } from '@/services/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { getAuthHeader } from '@/utils/authUtils';
import { MedicineFavorite } from '@/types/medicine.types';

// 즐겨찾기 상태 확인
export const useCheckFavorite = (medicineId?: string) => {
  if (!medicineId) {
    throw new Error(FAVORITE_MESSAGES.ID_NOT_FOUND);
  }

  return useSuspenseQuery({
    queryKey: ['favoriteStatus', medicineId],
    queryFn: () => checkFavoriteApi(medicineId),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

// 즐겨찾기 목록 조회
export const useFavorites = () => {
  return useSuspenseQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await axiosInstance.get(API_URLS.FAVORITES, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data.data as MedicineFavorite[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

// 즐겨찾기 추가
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
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

// 즐겨찾기 삭제
export const useDeleteFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (medicineId: string) => {
      await axiosInstance.delete(`${API_URLS.FAVORITES}/${medicineId}`, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
    },
    onSuccess: (_, medicineId) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteStatus', medicineId] });
    },
  });
};