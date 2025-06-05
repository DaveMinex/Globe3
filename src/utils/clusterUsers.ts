import Supercluster from 'supercluster';
import type { Location } from '../mock/mockLocations';

export interface ClusterFeature {
  id: number | string;
  lat: number;
  lng: number;
  count?: number;
  isCluster: boolean;
  children?: ClusterFeature[];
  properties?: any;
}

export function createClusterer(locations: Location[]) {
  const points = locations.map((loc, i) => ({
    type: "Feature" as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [loc.lng, loc.lat],
    },
    properties: {
      ...loc,
      id: i,
    },
  }));

  const clusterer = new Supercluster({
    radius: 60, // cluster radius in pixels
    maxZoom: 16, // max zoom to cluster points on
  });

  clusterer.load(points);

  return clusterer;
}

export function getClusters(clusterer: Supercluster, bounds: [number, number, number, number], zoom: number): ClusterFeature[] {
  const clusters = clusterer.getClusters(bounds, Math.round(zoom));
  return clusters.map((c: any) => {
    if (c.properties.cluster) {
      return {
        id: c.id,
        lat: c.geometry.coordinates[1],
        lng: c.geometry.coordinates[0],
        count: c.properties.point_count,
        isCluster: true,
        properties: c.properties,
      };
    } else {
      return {
        id: c.properties.id,
        lat: c.geometry.coordinates[1],
        lng: c.geometry.coordinates[0],
        isCluster: false,
        properties: c.properties,
      };
    }
  });
} 