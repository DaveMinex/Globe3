
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
  console.log('Creating clusterer with locations:', locations.length);
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
    radius: 1000, // 20x larger cluster radius for aggressive clustering
    maxZoom: 16, // Reduced max zoom to force more clustering
    minZoom: 0,
    minPoints: 2, // Minimum points to form a cluster
    nodeSize: 64,
    extent: 512,
    reduce: (acc, props) => {
      acc.point_count = (acc.point_count || 0) + 1;
      acc.users = (acc.users || 0) + props.users;
      acc.totalUsers = (acc.totalUsers || 0) + props.users;
    },
    map: (props) => ({
      point_count: 1,
      users: props.users,
      totalUsers: props.users
    })
  });

  clusterer.load(points);
  console.log('Clusterer created with points:', points.length);
  return clusterer;
} 

export function getClusters(clusterer: Supercluster, bounds: [number, number, number, number], zoom: number): ClusterFeature[] {
  console.log('Getting clusters for zoom:', zoom, 'bounds:', bounds);

  // Clamp zoom to valid range
  const effectiveZoom = Math.min(Math.max(zoom, 0), 16);
  const clusters = clusterer.getClusters(bounds, Math.round(effectiveZoom));
  console.log('Raw clusters:', clusters.length, 'effective zoom:', effectiveZoom);

  const result = clusters.map((c: any) => {
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

  // Debug: Check bounds coverage
  const boundsWidth = bounds[2] - bounds[0];
  const boundsHeight = bounds[3] - bounds[1];
  console.log('Bounds coverage:', {
    width: boundsWidth.toFixed(2),
    height: boundsHeight.toFixed(2),
    totalArea: (boundsWidth * boundsHeight).toFixed(2)
  });

  return result;
}

export function getClusterExpansionZoom(clusterer: Supercluster, clusterId: number): number {
  return clusterer.getClusterExpansionZoom(clusterId);
}

export function getClusterChildren(clusterer: Supercluster, clusterId: number): any[] {
  return clusterer.getChildren(clusterId);
}
