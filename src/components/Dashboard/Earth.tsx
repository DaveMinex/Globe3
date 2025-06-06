
import React, { useEffect, useRef, useState } from "react";
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { GlowingRippleDot } from "./GlowingRippleDot";
import { createClusterer, getClusters, ClusterFeature, getClusterExpansionZoom } from '../../utils/clusterUsers';
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
  const [zoom, setZoom] = useState(2);
  const [highlightedUsers, setHighlightedUsers] = useState<Location[]>([]);

  // Create clusterer on mount or when locations change
  useEffect(() => {
    const newClusterer = createClusterer(locations);
    setClusterer(newClusterer);
  }, [locations]);

  // Calculate appropriate bounds based on camera position and altitude
  const calculateBounds = (): [number, number, number, number] => {
    if (!globeRef.current) return [-180, -85, 180, 85];
    
    const pov = globeRef.current.pointOfView();
    const altitude = pov.altitude || 2;
    
    // Calculate visible area based on altitude
    // At higher altitudes, show more area; at lower altitudes, show smaller area
    let latRange, lngRange;
    
    if (altitude > 4) {
      // Global view
      latRange = 90;
      lngRange = 180;
    } else if (altitude > 2) {
      // Continental view
      latRange = 30 + (altitude - 2) * 30;
      lngRange = 40 + (altitude - 2) * 40;
    } else if (altitude > 1) {
      // Country/Regional view
      latRange = 10 + (altitude - 1) * 20;
      lngRange = 15 + (altitude - 1) * 25;
    } else if (altitude > 0.5) {
      // City view
      latRange = 2 + (altitude - 0.5) * 16;
      lngRange = 3 + (altitude - 0.5) * 24;
    } else {
      // Neighborhood view
      latRange = 0.5 + altitude * 3;
      lngRange = 0.7 + altitude * 4;
    }
    
    const centerLat = pov.lat || 0;
    const centerLng = pov.lng || 0;
    
    return [
      Math.max(-180, centerLng - lngRange),
      Math.max(-85, centerLat - latRange),
      Math.min(180, centerLng + lngRange),
      Math.min(85, centerLat + latRange)
    ];
  };

  // Update clusters based on current view
  const updateClusters = () => {
    if (!clusterer) return;
    
    const bounds = calculateBounds();
    const newClusters = getClusters(clusterer, bounds, zoom);
    
    console.log('Updating clusters:', {
      zoom,
      bounds,
      totalClusters: newClusters.length,
      clustersCount: newClusters.filter(c => c.isCluster).length,
      individualPoints: newClusters.filter(c => !c.isCluster).length
    });
    
    setClusters(newClusters);
  };

  useEffect(() => {
    updateClusters();
  }, [zoom, clusterer]);

  // Handle zoom changes with better zoom level mapping
  useEffect(() => {
    if (!globeRef.current) return;
    
    let isHandling = false;
    
    const handleWheel = (event: WheelEvent) => {
      if (isHandling) return;
      isHandling = true;
      
      event.preventDefault();
      event.stopPropagation();
      
      const delta = event.deltaY;
      const currentPOV = globeRef.current.pointOfView();
      const currentAltitude = currentPOV.altitude || 2.5;

      // More responsive zoom
      const zoomFactor = delta > 0 ? 1.15 : 0.87;
      const newAltitude = Math.max(0.01, Math.min(10, currentAltitude * zoomFactor));

      globeRef.current.pointOfView({
        ...currentPOV,
        altitude: newAltitude
      }, 100);

      // Map altitude to clustering zoom levels
      let zoomLevel;
      if (newAltitude > 5) {
        zoomLevel = 0; // Global clustering
      } else if (newAltitude > 3) {
        zoomLevel = 1; // Continental clustering
      } else if (newAltitude > 2) {
        zoomLevel = 3; // Country clustering
      } else if (newAltitude > 1.5) {
        zoomLevel = 5; // Regional clustering
      } else if (newAltitude > 1) {
        zoomLevel = 7; // City clustering
      } else if (newAltitude > 0.7) {
        zoomLevel = 9; // District clustering
      } else if (newAltitude > 0.4) {
        zoomLevel = 11; // Neighborhood clustering
      } else if (newAltitude > 0.2) {
        zoomLevel = 13; // Street clustering
      } else {
        zoomLevel = 16; // Individual points
      }
      
      console.log('Altitude:', newAltitude.toFixed(3), 'Zoom level:', zoomLevel);
      setZoom(zoomLevel);
      
      setTimeout(() => {
        isHandling = false;
      }, 50);
    };

    const globeElement = globeRef.current.renderer().domElement;
    globeElement.addEventListener('wheel', handleWheel, { passive: false });
    
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

  // Listen to camera movements
  useEffect(() => {
    if (!globeRef.current) return;
    
    const globe = globeRef.current;
    let updateTimeout: NodeJS.Timeout;
    
    const handleCameraMove = () => {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        updateClusters();
      }, 150);
    };
    
    globe.controls().addEventListener('change', handleCameraMove);
    
    return () => {
      globe.controls().removeEventListener('change', handleCameraMove);
      clearTimeout(updateTimeout);
    };
  }, [clusterer, zoom]);

  // Handle point click
  const handlePointClick = (point: any, event: MouseEvent, coords: { lat: number; lng: number; altitude: number; }) => {
    if (point.isCluster && clusterer) {
      // Get expansion zoom for this cluster
      const expansionZoom = getClusterExpansionZoom(clusterer, point.id);
      
      // Calculate appropriate altitude for the expansion zoom
      let targetAltitude;
      if (expansionZoom <= 2) {
        targetAltitude = 2.5;
      } else if (expansionZoom <= 5) {
        targetAltitude = 1.2;
      } else if (expansionZoom <= 8) {
        targetAltitude = 0.8;
      } else if (expansionZoom <= 11) {
        targetAltitude = 0.5;
      } else {
        targetAltitude = 0.3;
      }
      
      // Zoom to cluster
      globeRef.current.pointOfView({ 
        lat: point.lat, 
        lng: point.lng, 
        altitude: targetAltitude 
      }, 1000);
      
      setZoom(expansionZoom);
    } else if (!point.isCluster) {
      // Handle individual user click
      const usersNearby = usersWithinRadius(locations, { lat: point.lat, lng: point.lng }, 20);
      setHighlightedUsers(usersNearby);
      onPointClick(point.properties);
    }
  };

  // Create Google Maps-style cluster markers
  const createClusterMarker = (cluster: ClusterFeature) => {
    const group = new THREE.Group();
    
    // Determine cluster size and color based on count
    const count = cluster.count || 0;
    let size, color, textColor;
    
    if (count < 10) {
      size = 1.2;
      color = 0x4285f4; // Google blue
      textColor = '#ffffff';
    } else if (count < 100) {
      size = 1.8;
      color = 0xea4335; // Google red
      textColor = '#ffffff';
    } else if (count < 1000) {
      size = 2.4;
      color = 0xfbbc04; // Google yellow
      textColor = '#000000';
    } else {
      size = 3.0;
      color = 0x34a853; // Google green
      textColor = '#ffffff';
    }
    
    // Create cluster circle
    const geometry = new THREE.CircleGeometry(size, 32);
    const material = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.8
    });
    const circle = new THREE.Mesh(geometry, material);
    
    // Create border
    const borderGeometry = new THREE.RingGeometry(size * 0.9, size, 32);
    const borderMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    
    group.add(circle);
    group.add(border);
    
    // Add text (count) - using a simple approach
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = 256;
      canvas.height = 256;
      context.fillStyle = textColor;
      context.font = 'bold 80px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(count.toString(), 128, 128);
      
      const texture = new THREE.CanvasTexture(canvas);
      const textMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(textMaterial);
      sprite.scale.set(size * 1.5, size * 1.5, 1);
      group.add(sprite);
    }
    
    return group;
  };

  const createUserMarker = (user: ClusterFeature) => {
    const group = new THREE.Group();
    const geometry = new THREE.SphereGeometry(0.3, 16, 16);
    const isHighlighted = highlightedUsers.some(u => u.lat === user.lat && u.lng === user.lng);
    const isSelected = selectedCity && selectedCity.lat === user.lat && selectedCity.lng === user.lng;
    
    let color = 0xffeb3b; // Yellow for normal users
    if (isSelected) color = 0xff4444; // Red for selected
    if (isHighlighted) color = 0x00ff00; // Green for highlighted
    
    const material = new THREE.MeshBasicMaterial({ color });
    const sphere = new THREE.Mesh(geometry, material);
    
    // Add glow effect
    const glowMaterial = new THREE.MeshBasicMaterial({ 
      color, 
      transparent: true, 
      opacity: 0.3 
    });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), glowMaterial);
    
    group.add(sphere);
    group.add(glow);
    
    return group;
  };

  return (
    <div className={`w-full h-[100vh] z-0 relative translate-x-[-60px] ${viewMode === '2D' ? 'pointer-events-none' : ''}`}>
      {viewMode === '3D' ? (
        <div className="w-full h-full flex justify-center items-center">
          <Globe
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            pointsData={clusters}
            pointLat={(d: any) => d.lat}
            pointLng={(d: any) => d.lng}
            pointAltitude={0.001}
            pointLabel={(d: any) =>
              d.isCluster
                ? `<div class='bg-white p-3 rounded-lg shadow-lg border'><div class='font-bold text-gray-800 text-lg'>${d.count} users</div><div class='text-sm text-gray-600'>Click to zoom in</div></div>`
                : `<div class='bg-white p-2 rounded-lg shadow-lg border'><div class='font-bold text-gray-800'>${d.properties.city}</div><div class='text-sm text-gray-600'>${d.properties.users} users</div></div>`
            }
            pointColor={(d: any) => {
              if (d.isCluster) {
                const count = d.count || 0;
                if (count < 10) return '#4285f4';
                if (count < 100) return '#ea4335';
                if (count < 1000) return '#fbbc04';
                return '#34a853';
              }
              if (highlightedUsers.some(u => u.lat === d.lat && u.lng === d.lng)) return '#00ff00';
              return '#ffeb3b';
            }}
            pointRadius={(d: any) => d.isCluster ? 0.15 + Math.min(0.3, (d.count || 0) / 1000) : 0.05}
            onPointClick={handlePointClick}
            width={window.innerWidth}
            height={window.innerHeight}
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="rgba(255, 255, 255, 0.2)"
            atmosphereAltitude={0.1}
            customThreeObject={(d: any) => {
              return d.isCluster ? createClusterMarker(d) : createUserMarker(d);
            }}
            customThreeObjectUpdate={(obj: any, d: any) => {
              obj.position.set(0, 0, 0);
            }}
          />
          {selectedCity && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
              <h3 className="text-lg font-bold text-gray-800">{selectedCity.city}</h3>
              <p className="text-gray-600">{selectedCity.users.toLocaleString()} users</p>
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border text-sm">
            <div><strong>Zoom level:</strong> {zoom}</div>
            <div><strong>Visible points:</strong> {clusters.length}</div>
            <div><strong>Clusters:</strong> {clusters.filter(c => c.isCluster).length}</div>
            <div><strong>Individual users:</strong> {clusters.filter(c => !c.isCluster).length}</div>
          </div>
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
