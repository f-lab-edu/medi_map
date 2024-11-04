import { useState, useEffect } from 'react';
import { PharmacyDataError, LocationError } from '@/error/PharmaciesError';
import { ERROR_MESSAGES } from '@/constants/errors';
import { PharmacyDTO } from '@/dto/PharmacyDTO';

async function fetchPharmacies(lat: number, lng: number): Promise<PharmacyDTO[]> {
  const response = await fetch(`/api/pharmacy?lat=${lat}&lng=${lng}`);
  if (!response.ok) throw new PharmacyDataError();
  const data = await response.json();

  if (!Array.isArray(data.item)) throw new PharmacyDataError(ERROR_MESSAGES.PHARMACY_DATA_ERROR);
  return data.item;
}

export function usePharmacy(location: { lat: number; lng: number } | null) {
  const [pharmacies, setPharmacies] = useState<PharmacyDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (location) {
      setLoading(true);
      fetchPharmacies(location.lat, location.lng)
        .then((data) => {
          setPharmacies(data);
          setError(null);
        })
        .catch((error) => {
          setError(error instanceof PharmacyDataError ? error.message : ERROR_MESSAGES.PHARMACY_DATA_ERROR);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location]);

  return { pharmacies, error, loading };
}
