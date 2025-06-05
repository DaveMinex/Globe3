// Haversine formula to calculate distance between two lat/lng points in meters
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Filter users within a radius (meters) of a center point
import type { Location } from '../mock/mockLocations';
export function usersWithinRadius(users: Location[], center: { lat: number, lng: number }, radiusMeters: number) {
  return users.filter(u => haversineDistance(u.lat, u.lng, center.lat, center.lng) <= radiusMeters);
} 