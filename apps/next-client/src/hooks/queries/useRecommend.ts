import axios from 'axios';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { API_URLS } from '@/constants/urls';
import { axiosInstance } from '@/services/axiosInstance';
import { ALERT_MESSAGES } from '@/constants/alertMessage';

interface RecommendResponse {
  recommended: boolean;
  recommendationCount: number;
}

// 추천하기
export function useRecommend(postId: string) {
  if (!postId) throw new Error('postId가 없습니다');

  return useSuspenseQuery<RecommendResponse>({
    queryKey: ['recommend', postId],
    queryFn: async () => {
      const res = await axiosInstance.get(`${API_URLS.POSTS}/${postId}/recommend`, {
        headers: { requiresAuth: true },
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// 추천 토글
export function useToggleRecommend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await axiosInstance.post(
        `${API_URLS.POSTS}/${postId}/recommend`,
        {},
        { headers: { requiresAuth: true } }
      );
      return res.data;
    },

    onMutate: async (postId) => {
      const queryKey = ['recommend', postId];
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<RecommendResponse>(queryKey);

      if (previous) {
        queryClient.setQueryData(queryKey, {
          ...previous,
          recommended: !previous.recommended,
          recommendationCount: previous.recommended
            ? previous.recommendationCount - 1
            : previous.recommendationCount + 1,
        });
      }

      return { previous, postId };
    },

    onError: (err, postId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['recommend', postId], context.previous);
      }

      if (axios.isAxiosError(err) && err.response?.status === 401) {
        alert(ALERT_MESSAGES.ERROR.AUTH.LOGIN_REQUIRED);
      } else {
        alert(ALERT_MESSAGES.ERROR.UNKNOWN_ERROR);
      }
    },

    onSettled: (_, __, postId) => {
      queryClient.invalidateQueries({ queryKey: ['recommend', postId] });
    },
  });
}