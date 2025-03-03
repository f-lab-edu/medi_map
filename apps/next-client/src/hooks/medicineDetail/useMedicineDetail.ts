import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { MedicineResultDto } from "@/dto/MedicineResultDto";
import { API_URLS } from "@/constants/urls";
import { checkFavoriteApi } from "@/utils/medicineFavorites";
import { handleApiError } from "@/utils/handleApiError";

export const useMedicineDetail = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState<MedicineResultDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const response = await axios.get(`${API_URLS.MEDICINE}/${id}`);
        setMedicine(response.data);

        const medicineId = Array.isArray(id) ? id[0] : id;
        const isFav = await checkFavoriteApi(medicineId);
        setIsFavorite(isFav);
      } catch (error) {
        setError(handleApiError(error, "의약품 정보를 불러오는 중 오류가 발생했습니다."));
      } finally {
        setLoading(false);
      }
    };

    fetchMedicineDetails();
  }, [id]);

  return { medicine, loading, error, isFavorite, setIsFavorite };
};