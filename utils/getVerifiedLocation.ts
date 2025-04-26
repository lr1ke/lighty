import { toast } from 'react-hot-toast';

export interface VerifiedLocation {
  location: {
    latitude: number;
    longitude: number;
  };
  city: string;
  state: string;
}

interface VerifiedLocationOptions {
  showToasts?: boolean;
}

// Calculate distance between two geographical points using Haversine formula
function calculateDistance(
  loc1: { latitude: number; longitude: number },
  loc2: { latitude: number; longitude: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

export const getVerifiedLocation = async (options?: VerifiedLocationOptions): Promise<VerifiedLocation | null> => {
  const showToasts = options?.showToasts !== false;

  const getBrowserLocation = async (): Promise<VerifiedLocation | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.info('Geolocation API not supported by this browser');
        return resolve(null);
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            console.log('Browser location granted:', position.coords);
            const { latitude, longitude } = position.coords;
            
            // Default location with coordinates even if reverse geocoding fails
            const defaultLocation = {
              location: { latitude, longitude },
              city: 'Unknown',
              state: 'Unknown',
            };
            
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                { headers: { 'Accept-Language': 'en' } } // Ensure English results
              );
              
              if (!res.ok) {
                console.warn(`Nominatim API error: ${res.status}`, await res.text());
                return resolve(defaultLocation);
              }
              
              const data = await res.json();
              console.log('Nominatim response:', data);
              
              // More robust address extraction with fallbacks
              const address = data.address || {};
              const city = 
                address.city || 
                address.town || 
                address.village || 
                address.suburb || 
                address.municipality || 
                address.county ||
                (data.display_name ? data.display_name.split(',')[0] : 'Unknown');
              
              const state = 
                address.state || 
                address.region || 
                address.county || 
                'Unknown';

              console.log(`Extracted location: ${city}, ${state}`);
              
              resolve({
                location: { latitude, longitude },
                city,
                state,
              });
            } catch (error) {
              console.error('Error in reverse geocoding:', error);
              resolve(defaultLocation);
            }
          } catch (error) {
            console.error('Error in browser geolocation:', error);
            resolve(null);
          }
        },
        (error) => {
          console.warn(`Geolocation permission error (${error.code}): ${error.message}`);
          resolve(null);
        },
        { 
          timeout: 30000, // Increased from 10000 to 30000 (30 seconds) for better reliability
          enableHighAccuracy: true,
          maximumAge: 60000  // Accept cached positions up to 1 minute old
        }
      );
    });
  };

  const getIPLocation = async (): Promise<VerifiedLocation> => {
    try {
      console.log('Fetching IP-based location');
      const res = await fetch('https://ipapi.co/json/');
      // const res = await fetch('https://ipinfo.io/json?token=YOUR_TOKEN'); // For production
      
      if (!res.ok) {
        throw new Error(`IP geolocation API error: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('IP location response:', data);
      
      return {
        location: {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
        },
        city: data.city || 'Unknown',
        state: data.region || 'Unknown',
      };
    } catch (error) {
      console.error('Error fetching IP location:', error);
      return {
        location: { latitude: 0, longitude: 0 },
        city: 'Unknown',
        state: 'Unknown',
      };
    }
  };

  try {
    console.log('Starting location verification process');
    
    // Get both locations in parallel
    const [browserLoc, ipLoc] = await Promise.all([
      getBrowserLocation().catch(err => {
        console.error('Browser location error:', err);
        return null;
      }),
      getIPLocation().catch(err => {
        console.error('IP location error:', err);
        return {
          location: { latitude: 0, longitude: 0 },
          city: 'Unknown',
          state: 'Unknown',
        };
      }),
    ]);
    
    console.log('Browser location result:', browserLoc);
    console.log('IP location result:', ipLoc);

// If browser location is available
if (browserLoc && 
  browserLoc.location.latitude !== 0 && 
  browserLoc.location.longitude !== 0) {

// Check if IP location is also available for comparison
if (ipLoc && 
    ipLoc.location.latitude !== 0 && 
    ipLoc.location.longitude !== 0) {
  
  const distance = calculateDistance(browserLoc.location, ipLoc.location);
  console.log(`Distance between browser and IP locations: ${distance.toFixed(2)} km`);
  
  // SIMPLIFIED: Only check for extreme distance (>1500km)
  if (distance > 1500) {
    console.log('Very large location mismatch detected (>1500km). Using IP location.');
    
    if (showToasts) {
      toast('Using network location due to significant location discrepancy.', { 
        id: 'location-large-mismatch-toast',
        icon: '🌍',
        duration: 5000
      });
    }
    
    return ipLoc; // Use IP location only when distance exceeds 1500km
  }
}

// In all other cases, use browser location
return browserLoc;
}

// If browser location not available, use IP location
if (ipLoc) {
if (showToasts) {
  toast('Browser location unavailable. Using network location.', { 
    id: 'location-fallback-toast',
    icon: 'ℹ️',
    duration: 4000
  });
}
return ipLoc;
}
    // If all methods fail
    console.error('All geolocation methods failed');
    
    if (showToasts) {
      toast('Unable to determine your location.', { 
        id: 'location-error-toast',
        icon: '❌',
        duration: 5000 
      });
    }
    
    return {
      location: { latitude: 0, longitude: 0 },
      city: 'Unknown',
      state: 'Unknown',
    };
    
  } catch (error) {
    console.error('Error in location verification:', error);
    
    if (showToasts) {
      toast('Location detection error. Please try again later.', { 
        id: 'location-error-general-toast',
        icon: '❌',
        duration: 5000 
      });
    }
    
    return {
      location: { latitude: 0, longitude: 0 },
      city: 'Unknown',
      state: 'Unknown',
    };
  }
};