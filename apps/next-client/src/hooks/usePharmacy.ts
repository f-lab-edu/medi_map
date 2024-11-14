import { useState } from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';

export function usePharmacy() {
  const [pharmacies, setPharmacies] = useState<PharmacyDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return { pharmacies, error, loading, setPharmacies, setError, setLoading };
}