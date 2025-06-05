// US cities sample data
const usCities = [
  { city: 'New York', lat: 40.7128, lng: -74.0060 },
  { city: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { city: 'Chicago', lat: 41.8781, lng: -87.6298 },
  { city: 'Houston', lat: 29.7604, lng: -95.3698 },
  { city: 'Phoenix', lat: 33.4484, lng: -112.0740 },
  { city: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
  { city: 'San Antonio', lat: 29.4241, lng: -98.4936 },
  { city: 'San Diego', lat: 32.7157, lng: -117.1611 },
  { city: 'Dallas', lat: 32.7767, lng: -96.7970 },
  { city: 'San Jose', lat: 37.3382, lng: -121.8863 },
  { city: 'Austin', lat: 30.2672, lng: -97.7431 },
  { city: 'Jacksonville', lat: 30.3322, lng: -81.6557 },
  { city: 'Fort Worth', lat: 32.7555, lng: -97.3308 },
  { city: 'Columbus', lat: 39.9612, lng: -82.9988 },
  { city: 'Charlotte', lat: 35.2271, lng: -80.8431 },
  { city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  { city: 'Indianapolis', lat: 39.7684, lng: -86.1581 },
  { city: 'Seattle', lat: 47.6062, lng: -122.3321 },
  { city: 'Denver', lat: 39.7392, lng: -104.9903 },
  { city: 'Washington', lat: 38.9072, lng: -77.0369 }
];

export interface Location {
  lat: number;
  lng: number;
  city: string;
  users: number;
  position: { x: number; y: number };
}

function getRandomPosition() {
  return {
    x: Math.random(),
    y: Math.random(),
  };
}

export const mockLocations: Location[] = Array.from({ length: 2000 }, (_, i) => {
  const city = usCities[i % usCities.length];
  // Add a small random offset to each user's lat/lng
  const lat = city.lat + (Math.random() - 0.5) * 5; // ~5km spread
  const lng = city.lng + (Math.random() - 0.5) * 5;
  return {
    lat,
    lng,
    city: city.city,
    users: Math.floor(Math.random() * 100000),
    position: getRandomPosition(), 
  };
}); 