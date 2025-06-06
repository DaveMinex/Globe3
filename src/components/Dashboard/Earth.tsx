import React, { useEffect, useRef, useState } from "react";
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { GlowingRippleDot } from "./GlowingRippleDot";
import { createClusterer, getClusters, ClusterFeature } from '../../utils/clusterUsers';
import { usersWithinRadius } from '../../utils/geo';
import Supercluster from 'supercluster';

interface Location {
  lat: number;
  lng: number;
  city: string;
  users: number;
  position: {
    x: number;
    y: number;
  };
}

interface EarthProps {
  viewMode: '3D' | '2D';
  locations: Location[];
  selectedCity: Location | null;
  onPointClick: (point: any) => void;
  globeRef: React.RefObject<any>;
}

export const Earth: React.FC<EarthProps> = ({
  viewMode,
  locations,
  selectedCity,
  onPointClick,
  globeRef,
}) => {
  const [clusters, setClusters] = useState<ClusterFeature[]>([]);
  const [clusterer, setClusterer] = useState<any>(null);
  const [zoom, setZoom] = useState(8);
  const [highlightedUsers, setHighlightedUsers] = useState<Location[]>([]);

  // Create clusterer on mount or when locations change
  useEffect(() => {
    const clusterer = new Supercluster({
      radius: 80, // Larger radius for better clustering
      maxZoom: 15, // Lower max zoom so clusters persist longer
      minZoom: 0,
      nodeSize: 64,
      extent: 512,
      reduce: (acc, props) => {
        acc.point_count = (acc.point_count || 0) + 1;
      },
      map: (props) => ({
        point_count: 1
      })
    });
    clusterer.load(locations);
    setClusterer(clusterer);
  }, [locations]);

  // Update clusters on zoom or move
  const updateClusters = () => {
    if (!globeRef.current || !clusterer) return;
    // Get globe bounds (approximate)
    const bounds: [number, number, number, number] = [-180, -85, 180, 85];
    console.log('Updating clusters with zoom:', zoom);
    const newClusters = getClusters(clusterer, bounds, zoom);
    console.log('New clusters:', newClusters);
    setClusters(newClusters);
  };

  useEffect(() => {
    console.log('Zoom changed to:', zoom);
    updateClusters();
  }, [zoom, clusterer]);

  // Listen to zoom changes
  useEffect(() => {
    if (!globeRef.current) return;
    
    let isHandling = false;
    
    const handleWheel = (event: WheelEvent) => {
      if (isHandling) return;
      isHandling = true;
      
      event.preventDefault();
      event.stopPropagation();
      
      const delta = event.deltaY;

      // Get current point of view
      const currentPOV = globeRef.current.pointOfView();
      const currentAltitude = currentPOV.altitude || 2.5;

      // Calculate new altitude with much finer scaling
      const zoomFactor = delta > 0 ? 1.1 : 0.9; // More gradual zoom
      const newAltitude = Math.max(0.01, Math.min(10, currentAltitude * zoomFactor)); // Extended range

      // Update point of view with smooth animation
      globeRef.current.pointOfView({
        ...currentPOV,
        altitude: newAltitude
      }, 30); // Smoother animation

      // Calculate zoom level with better mapping - higher altitude = lower zoom
      const minAlt = 0.01;
      const maxAlt = 10;
      const clampedAltitude = Math.max(minAlt, Math.min(maxAlt, newAltitude));
      const normalizedAltitude = (clampedAltitude - minAlt) / (maxAlt - minAlt);
      const zoomLevel = Math.round(20 * (1 - normalizedAltitude));
      const finalZoom = Math.max(0, Math.min(20, zoomLevel));
      console.log('Altitude:', newAltitude, 'Normalized:', normalizedAltitude, 'Zoom:', finalZoom);
      setZoom(finalZoom);
      
      // Reset handling flag after a brief delay
      setTimeout(() => {
        isHandling = false;
      }, 50);
    };

    // Add event listener to the canvas element directly
    const globeElement = globeRef.current.renderer().domElement;
    globeElement.addEventListener('wheel', handleWheel, { passive: false });
    
    // Also add to the parent container to catch all wheel events
    const container = globeElement.parentElement;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      globeElement.removeEventListener('wheel', handleWheel);
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [globeRef.current]);

  // Update clusters whenever zoom changes
  useEffect(() => {
    if (!clusterer) return;
    const bounds: [number, number, number, number] = [-180, -85, 180, 85];
    const newClusters = getClusters(clusterer, bounds, zoom);
    console.log('Zoom level:', zoom, 'Clusters:', newClusters.length);
    setClusters(newClusters);
  }, [zoom, clusterer]);

  // Handle point click (cluster or user)
  const handlePointClick = (point: any, event: MouseEvent, coords: { lat: number; lng: number; altitude: number; }) => {
    if (point.isCluster && clusterer) {
      // Zoom in to cluster
      if (globeRef.current) {
        globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 0.8 }, 1000);
      }
    } else if (!point.isCluster) {
      // Highlight users within 20 meters
      const usersNearby = usersWithinRadius(locations, { lat: point.lat, lng: point.lng }, 20);
      setHighlightedUsers(usersNearby);
      onPointClick(point.properties);
    }
  };

  // Always show all available points - let Supercluster handle the clustering logic
  const finalPoints = clusters;
  
  console.log('Zoom:', zoom, 'Total clusters:', clusters.length, 'Final points:', finalPoints.length);
  
  // Debug: Show breakdown of cluster types
  const clusterCount = clusters.filter(d => d.isCluster).length;
  const userCount = clusters.filter(d => !d.isCluster).length;
  console.log('Breakdown - Clusters:', clusterCount, 'Individual users:', userCount);

  return (
    <div className={`w-full h-[100vh] z-0 relative  translate-x-[-60px] ${viewMode === '2D' ? 'pointer-events-none' : ''}`}>
      {viewMode === '3D' ? (
        <div className="w-full h-full flex justify-center items-center">
          <Globe
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            pointsData={finalPoints}
            pointLat={(d: any) => d.lat}
            pointLng={(d: any) => d.lng}
            pointAltitude={0.001}
            pointLabel={(d: any) =>
              d.isCluster
                ? `<div class='bg-white p-2 rounded-lg shadow-lg'><div class='font-bold text-gray-800'>${d.count} users</div></div>`
                : `<div class='bg-white p-2 rounded-lg shadow-lg'><div class='font-bold text-gray-800'>${d.properties.city}</div><div class='text-sm text-gray-600'>${d.properties.users} users</div></div>`
            }
            pointColor={(d: any) => {
              if (d.isCluster) return 'red';
              if (highlightedUsers.some(u => u.lat === d.lat && u.lng === d.lng)) return 'lime';
              return 'yellow';
            }}
            pointRadius={(d: any) => (d.isCluster ? 0.2 : 0.08)}
            onPointClick={(point: any, event: MouseEvent, coords: { lat: number; lng: number; altitude: number; }) => handlePointClick(point, event, coords)}
            width={window.innerWidth * 1}
            height={window.innerHeight * 1}
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="rgba(255, 255, 255, 0.2)"
            atmosphereAltitude={0.1}
            customThreeObject={(d: any) => {
              // Create a glowing sphere or cluster marker
              const group = new THREE.Group();
              if (d.isCluster) {
                const geometry = new THREE.SphereGeometry(1, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const sphere = new THREE.Mesh(geometry, material);
                group.add(sphere);
              } else {
                const geometry = new THREE.SphereGeometry(0.7, 16, 16);
                const color = highlightedUsers.some(u => u.lat === d.lat && u.lng === d.lng) ? 0x00ff00 : (d === selectedCity ? 0xff4444 : 0xffff00);
                const material = new THREE.MeshBasicMaterial({ color });
                const sphere = new THREE.Mesh(geometry, material);
                // Add glow
                const glowMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });
                const glow = new THREE.Mesh(new THREE.SphereGeometry(1, 50, 50), glowMaterial);
                group.add(sphere);
                group.add(glow);
              }
              return group;
            }}
            customThreeObjectUpdate={(obj: any, d: any) => {
              obj.position.set(0, 0, 0);
            }}
          />
          {selectedCity && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-gray-800">{selectedCity.city}</h3>
              <p className="text-gray-600">{selectedCity.users.toLocaleString()} users</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-full flex justify-center items-center">
          <div className="w-[calc(100vh-150px)] h-[calc(100vh-150px)] translate-x-[-30px]">
            <div className="earth relative w-full h-full">
              {locations.map((location, index) => (
                <GlowingRippleDot
                  key={index}
                  size="1.5vw"
                  style={{
                    position: 'absolute',
                    top: `${location.position.y * 100}%`,
                    left: `${location.position.x * 100}%`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  tooltipCity={location.city}
                  tooltipUsers={location.users}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earth;