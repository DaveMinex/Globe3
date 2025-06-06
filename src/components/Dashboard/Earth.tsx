
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

  // Calculate appropriate bounds based on camera position and altitude with wider range
  const calculateBounds = (): [number, number, number, number] => {
    if (!globeRef.current) return [-180, -85, 180, 85];
    
    const pov = globeRef.current.pointOfView();
    const altitude = pov.altitude || 2;
    const centerLat = pov.lat || 0;
    const centerLng = pov.lng || 0;
    
    // Much wider bounds calculation for better cluster visibility
    let latRange, lngRange;
    
    if (altitude > 3) {
      // Global view - show entire world
      return [-180, -85, 180, 85];
    } else if (altitude > 2) {
      // Continental view - very wide range
      latRange = 60 + (altitude - 2) * 30; // 60-90 degrees
      lngRange = 80 + (altitude - 2) * 40; // 80-120 degrees
    } else if (altitude > 1.5) {
      // Regional view - large range
      latRange = 40 + (altitude - 1.5) * 40; // 40-60 degrees
      lngRange = 60 + (altitude - 1.5) * 40; // 60-80 degrees
    } else if (altitude > 1) {
      // Country view - medium range
      latRange = 20 + (altitude - 1) * 40; // 20-40 degrees
      lngRange = 30 + (altitude - 1) * 60; // 30-60 degrees
    } else if (altitude > 0.5) {
      // State/Province view
      latRange = 8 + (altitude - 0.5) * 24; // 8-20 degrees
      lngRange = 12 + (altitude - 0.5) * 36; // 12-30 degrees
    } else if (altitude > 0.3) {
      // City view
      latRange = 3 + (altitude - 0.3) * 25; // 3-8 degrees
      lngRange = 5 + (altitude - 0.3) * 35; // 5-12 degrees
    } else {
      // Neighborhood view - still quite wide
      latRange = 1 + altitude * 6.67; // 1-3 degrees
      lngRange = 1.5 + altitude * 11.67; // 1.5-5 degrees
    }
    
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

      // Progressive zoom level mapping for optimal clustering
      let zoomLevel;
      if (newAltitude > 4) {
        zoomLevel = 0; // Global clustering - maximum clustering
      } else if (newAltitude > 3) {
        zoomLevel = 2; // Continental clustering
      } else if (newAltitude > 2.5) {
        zoomLevel = 4; // Country clustering
      } else if (newAltitude > 2) {
        zoomLevel = 6; // Regional clustering
      } else if (newAltitude > 1.5) {
        zoomLevel = 8; // State/Province clustering
      } else if (newAltitude > 1) {
        zoomLevel = 10; // City clustering
      } else if (newAltitude > 0.7) {
        zoomLevel = 12; // District clustering
      } else if (newAltitude > 0.5) {
        zoomLevel = 14; // Neighborhood clustering
      } else if (newAltitude > 0.3) {
        zoomLevel = 16; // Street clustering
      } else if (newAltitude > 0.15) {
        zoomLevel = 18; // Block clustering - minimal clustering
      } else {
        zoomLevel = 20; // Individual points only
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

  // Create enhanced Google Maps-style cluster markers
  const createClusterMarker = (cluster: ClusterFeature) => {
    const group = new THREE.Group();
    
    // Determine cluster size and color based on count with better scaling
    const count = cluster.count || 0;
    const totalUsers = cluster.properties?.totalUsers || count;
    let size, color, textColor, borderColor;
    
    // More nuanced size and color scaling
    if (count < 5) {
      size = 0.8;
      color = 0x4285f4; // Google blue
      borderColor = 0x1a73e8;
      textColor = '#ffffff';
    } else if (count < 10) {
      size = 1.0;
      color = 0x4285f4; // Google blue
      borderColor = 0x1a73e8;
      textColor = '#ffffff';
    } else if (count < 50) {
      size = 1.3;
      color = 0xea4335; // Google red
      borderColor = 0xd93025;
      textColor = '#ffffff';
    } else if (count < 100) {
      size = 1.6;
      color = 0xea4335; // Google red
      borderColor = 0xd93025;
      textColor = '#ffffff';
    } else if (count < 500) {
      size = 2.0;
      color = 0xfbbc04; // Google yellow
      borderColor = 0xf9ab00;
      textColor = '#000000';
    } else if (count < 1000) {
      size = 2.4;
      color = 0xfbbc04; // Google yellow
      borderColor = 0xf9ab00;
      textColor = '#000000';
    } else {
      size = 2.8;
      color = 0x34a853; // Google green
      borderColor = 0x137333;
      textColor = '#ffffff';
    }
    
    // Create main cluster circle with gradient effect
    const geometry = new THREE.CircleGeometry(size, 32);
    const material = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.9
    });
    const circle = new THREE.Mesh(geometry, material);
    
    // Create outer border for better visibility
    const outerBorderGeometry = new THREE.RingGeometry(size, size * 1.1, 32);
    const outerBorderMaterial = new THREE.MeshBasicMaterial({ 
      color: borderColor,
      transparent: true,
      opacity: 0.8
    });
    const outerBorder = new THREE.Mesh(outerBorderGeometry, outerBorderMaterial);
    
    // Create inner white border
    const innerBorderGeometry = new THREE.RingGeometry(size * 0.85, size, 32);
    const innerBorderMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 1.0
    });
    const innerBorder = new THREE.Mesh(innerBorderGeometry, innerBorderMaterial);
    
    group.add(outerBorder);
    group.add(circle);
    group.add(innerBorder);
    
    // Add text (count) with better formatting
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = 256;
      canvas.height = 256;
      context.fillStyle = textColor;
      
      // Adjust font size based on number length
      const textLength = count.toString().length;
      let fontSize = 80;
      if (textLength > 3) fontSize = 60;
      if (textLength > 4) fontSize = 50;
      
      context.font = `bold ${fontSize}px Arial`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      // Format large numbers (1k, 10k, etc.)
      let displayText = count.toString();
      if (count >= 1000000) {
        displayText = (count / 1000000).toFixed(1) + 'M';
      } else if (count >= 1000) {
        displayText = (count / 1000).toFixed(1) + 'K';
      }
      
      context.fillText(displayText, 128, 128);
      
      const texture = new THREE.CanvasTexture(canvas);
      const textMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(textMaterial);
      sprite.scale.set(size * 1.8, size * 1.8, 1);
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
                ? `<div class='bg-white p-3 rounded-lg shadow-lg border max-w-xs'>
                     <div class='font-bold text-gray-800 text-lg'>${d.count.toLocaleString()} locations</div>
                     <div class='text-sm text-gray-600'>${(d.properties?.totalUsers || d.count).toLocaleString()} total users</div>
                     <div class='text-xs text-blue-600 mt-1'>Click to zoom in</div>
                   </div>`
                : `<div class='bg-white p-2 rounded-lg shadow-lg border'>
                     <div class='font-bold text-gray-800'>${d.properties.city}</div>
                     <div class='text-sm text-gray-600'>${d.properties.users.toLocaleString()} users</div>
                   </div>`
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
            pointRadius={(d: any) => {
              if (d.isCluster) {
                const count = d.count || 0;
                // Progressive radius scaling for clusters
                if (count < 5) return 0.08;
                if (count < 10) return 0.12;
                if (count < 50) return 0.16;
                if (count < 100) return 0.20;
                if (count < 500) return 0.25;
                if (count < 1000) return 0.30;
                return 0.35;
              }
              return 0.04; // Individual users
            }}
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
