import { toast } from 'react-hot-toast';

export const getVerifiedLocation = async (): Promise<string> => {
  const getBrowserLocation = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            const location = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.municipality || `${latitude}, ${longitude}`;
            resolve(location, );
          } catch {
            resolve(null);
          }
        },
        () => resolve(null)
      );
    });
  };

  const getIPLocation = async (): Promise<string> => {
    // const res = await fetch('https://ipinfo.io/json?token=YOUR_TOKEN'); for production 
    const res = await fetch('https://ipapi.co/json/'); // Token-free IP geolocation

    const data = await res.json();
    return data.city || data.region || data.country || 'Unknown location';
  };

  try {
    const [browserLoc, ipLoc] = await Promise.all([
      getBrowserLocation().catch(() => null),
      getIPLocation()
    ]);

    if (browserLoc) {
      if (!ipLoc.includes(browserLoc)) {
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
