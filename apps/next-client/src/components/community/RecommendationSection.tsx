import { useState, useEffect } from 'react';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alertMessage';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6";
import { axiosInstance } from '@/services/axiosInstance';

interface Props {
  urlPostId: string;
}

const Recommendations = ({ urlPostId }: Props) => {
  const [isRecommended, setIsRecommended] = useState(false);
  const [recommendationCount, setRecommendationCount] = useState(0);

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        const response = await axiosInstance.get(`${API_URLS.POSTS}/${urlPostId}/recommend`, {
          headers: { requiresAuth: true },
        });

        setIsRecommended(response.data.recommended);
        setRecommendationCount(response.data.recommendationCount);
      } catch (error) {
        console.error('Error fetching recommend:', error);
        alert(ALERT_MESSAGES.ERROR.UNKNOWN_ERROR);
      }
    };

    fetchRecommend();
  }, [urlPostId]);

  const toggleRecommend = async () => {
    try {
      const response = await axiosInstance.post(
        `${API_URLS.POSTS}/${urlPostId}/recommend`,
        {},
        { headers: { requiresAuth: true } }
      );

      setIsRecommended(response.data.recommended);
      setRecommendationCount(response.data.recommendationCount);
    } catch (error) {
      console.error('Error toggling recommend:', error);
    }
  };

  return (
    <div>
      <button className='recommend_button' onClick={toggleRecommend}>
        {isRecommended ? <FaThumbsUp size={24} /> : <FaRegThumbsUp size={24} />}
      </button>
      <span>{recommendationCount}</span>
    </div>
  );
};

export default Recommendations;