

import { toast } from 'react-hot-toast';

export interface VerifiedLocation {
  location: {
    latitude: number;
    longitude: number;
  };
  city: string;
  state: string;
  country: string;
}

export const getVerifiedLocation = async (): Promise<VerifiedLocation | null> => {
  const getBrowserLocation = async (): Promise<VerifiedLocation | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.municipality || 'Unknown';
            const state = data.address.state || 'Unknown';
            const country = data.address.country || 'Unknown';

            resolve({
              location: { latitude, longitude },
              city,
              state,
              country,
            });
          } catch {
            resolve(null);
          }
        },
        () => resolve(null)
      );
    });
  };

  const getIPLocation = async (): Promise<VerifiedLocation> => {
    const res = await fetch('https://ipapi.co/json/');
    // const res = await fetch('https://ipinfo.io/json?token=YOUR_TOKEN'); for production 

    const data = await res.json();
    return {
      location: {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      },
      city: data.city || 'Unknown',
      state: data.region || 'Unknown',
      country: data.country_name || 'Unknown',
    };
  };

  try {
    const [browserLoc, ipLoc] = await Promise.all([
      getBrowserLocation().catch(() => null),
      getIPLocation(),
    ]);

    if (browserLoc) {
      if (browserLoc.city && ipLoc.city && !ipLoc.city.includes(browserLoc.city)) {
        toast('Location mismatch detected. Using network location.', { icon: '⚠️' });
        return ipLoc;
      }
      return browserLoc;
    }

    toast('Browser location unavailable. Using network location.', { icon: '⚠️' });
    return ipLoc;
  } catch {
    throw new Error('Unable to determine location');
  }
};
