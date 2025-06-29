// Geolocation utility for detecting Ethiopian users
export interface LocationData {
  country: string;
  countryCode: string;
  city?: string;
  region?: string;
  isEthiopia: boolean;
}

export async function detectUserLocation(): Promise<LocationData> {
  try {
    // Try multiple IP geolocation services for reliability
    const services = [
      'https://ipapi.co/json/',
      'https://api.ipify.org?format=json', // Fallback to get IP then use another service
    ];

    for (const serviceUrl of services) {
      try {
        const response = await fetch(serviceUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) continue;

        const data = await response.json();
        
        // Handle different API response formats
        let locationData: LocationData;
        
        if (data.country_code || data.country) {
          // ipapi.co format
          locationData = {
            country: data.country || data.country_name || 'Unknown',
            countryCode: data.country_code || data.country || '',
            city: data.city,
            region: data.region,
            isEthiopia: (data.country_code || '').toUpperCase() === 'ET'
          };
        } else if (data.ip) {
          // If we only got IP, try another service
          const geoResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            locationData = {
              country: geoData.country_name || 'Unknown',
              countryCode: geoData.country_code || '',
              city: geoData.city,
              region: geoData.region,
              isEthiopia: (geoData.country_code || '').toUpperCase() === 'ET'
            };
          } else {
            continue;
          }
        } else {
          continue;
        }

        // Cache the result in localStorage for 24 hours
        const cacheData = {
          ...locationData,
          timestamp: Date.now(),
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('tabor_user_location', JSON.stringify(cacheData));
        }

        return locationData;
      } catch (serviceError) {
        console.warn(`Geolocation service failed:`, serviceError);
        continue;
      }
    }

    // If all services fail, return default
    return {
      country: 'Unknown',
      countryCode: '',
      isEthiopia: false
    };

  } catch (error) {
    console.error('Geolocation detection failed:', error);
    return {
      country: 'Unknown',
      countryCode: '',
      isEthiopia: false
    };
  }
}

export function getCachedLocation(): LocationData | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem('tabor_user_location');
    if (!cached) return null;

    const data = JSON.parse(cached);
    
    // Check if cache is still valid
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem('tabor_user_location');
      return null;
    }

    return {
      country: data.country,
      countryCode: data.countryCode,
      city: data.city,
      region: data.region,
      isEthiopia: data.isEthiopia
    };
  } catch (error) {
    console.error('Error reading cached location:', error);
    localStorage.removeItem('tabor_user_location');
    return null;
  }
}

export async function getUserLocation(): Promise<LocationData> {
  // First try to get cached location
  const cached = getCachedLocation();
  if (cached) {
    return cached;
  }

  // If no cache, detect location
  return await detectUserLocation();
}