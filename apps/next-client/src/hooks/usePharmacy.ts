import { useState, useEffect } from 'react';
import { PharmacyDataError, LocationError } from '@/error/PharmaciesError';
import { ERROR_MESSAGES } from '@/constants/errors';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { API_URLS } from '@/constants/urls';

async function defaultFetchPharmacy(lat: number, lng: number): Promise<PharmacyDTO[]> {
  const response = await fetch(`${API_URLS.PHARMACY}?lat=${lat}&lng=${lng}`);
  if (!response.ok) throw new PharmacyDataError(ERROR_MESSAGES.NETWORK_ERROR);
  const data = await response.json();

  if (!Array.isArray(data.item)) throw new PharmacyDataError(ERROR_MESSAGES.PHARMACY_DATA_ERROR);
  return data.item;
}

export function usePharmacy(
  location: { lat: number; lng: number } | null,
  fetchPharmacy = defaultFetchPharmacy
) {
  const [pharmacies, setPharmacies] = useState<PharmacyDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const resetState = () => {
    setPharmacies([]);
    setError(null);
    setLoading(false);
  };

  const handleError = (error: unknown) => {
    if (error instanceof PharmacyDataError) {
      setError(error.message);
    } else {
      setError(ERROR_MESSAGES.GENERIC_ERROR);
    }
  };

  useEffect(() => {
    if (!location) {
      resetState();
      return;
    }

    const loadPharmacies = async () => {
      resetState();
      setLoading(true);
      try {
        const data = await fetchPharmacy(location.lat, location.lng);
        setPharmacies(data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    loadPharmacies();
  }, [location, fetchPharmacy]);

  return { pharmacies, error, loading };
}
