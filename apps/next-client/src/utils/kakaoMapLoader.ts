import { ERROR_MESSAGES } from '@/constants/errors';

export function loadKakaoMapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src*="sdk.js"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      console.error(ERROR_MESSAGES.KAKAO_MAP_ERROR);
      reject(new Error(ERROR_MESSAGES.KAKAO_MAP_ERROR));
    };
    document.head.appendChild(script);
  });
}
