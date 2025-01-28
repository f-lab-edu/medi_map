'use client';

import { useEffect, useState } from 'react';
import { LocationError } from '@/error/PharmacyError';

export default function useGeoLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<LocationError | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setLocationError(new LocationError())
      );
    }
  }, []);

  return { location, locationError };
}