import { ERROR_MESSAGES } from '@/constants/errors';

let kakaoMapPromise: Promise<void> | null = null;

export function loadKakaoMapScript(): Promise<void> {
  if (kakaoMapPromise) {
    return kakaoMapPromise;
  }

  kakaoMapPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error(ERROR_MESSAGES.KAKAO_MAP_ERROR));
      return;
    }

    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(`script[src*="dapi.kakao.com/v2/maps/sdk.js"]`);

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.kakao && window.kakao.maps) {
          resolve();
        } else {
          reject(new Error(ERROR_MESSAGES.KAKAO_MAP_ERROR));
        }
      });
      existingScript.addEventListener('error', () => {
        reject(new Error(ERROR_MESSAGES.KAKAO_MAP_ERROR));
      });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`;
    script.async = true;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => resolve());
      } else {
        reject(new Error(ERROR_MESSAGES.KAKAO_MAP_ERROR));
      }
    };
    script.onerror = () => {
      console.error(ERROR_MESSAGES.KAKAO_MAP_ERROR);
      reject(new Error(ERROR_MESSAGES.KAKAO_MAP_ERROR));
    };
    document.head.appendChild(script);
  });

  return kakaoMapPromise;
}