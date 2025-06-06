
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
  const [selectedPoint, setSelectedPoint] = useState<ClusterFeature | null>(null);

  // Create clusterer on mount or when locations change
  useEffect(() => {
    const newClusterer = createClusterer(locations);
    setClusterer(newClusterer);
  }, [locations]);

  // Calculate camera view frustum bounds for proper visibility culling
  const calculateBounds = (): [number, number, number, number] => {
    if (!globeRef.current) return [-180, -85, 180, 85];
    
    const pov = globeRef.current.pointOfView();
    const altitude = pov.altitude || 2;
    const centerLat = pov.lat || 0;
    const centerLng = pov.lng || 0;
    
    // Calculate field of view based on camera settings
    // react-globe.gl uses a default FOV of 50 degrees
    const fov = 50; // degrees
    const aspect = window.innerWidth / window.innerHeight;
    
    // Convert altitude to camera distance (globe radius is 100 in three.js units)
    const earthRadius = 100;
    const cameraDistance = earthRadius * altitude;
    
    // Calculate the angular size of the visible area
    const fovRadians = (fov * Math.PI) / 180;
    const halfFovRadians = fovRadians / 2;
    
    // Calculate the radius of the visible circle on the Earth's surface
    const visibleRadius = Math.tan(halfFovRadians) * cameraDistance;
    
    // Convert visible radius to degrees on Earth's surface
    // Earth's circumference is ~40,075 km, so 1 degree = ~111 km
    const kmPerDegree = 111.32; // km per degree at equator
    const degreesPerKm = 1 / kmPerDegree;
    
    // Calculate the angular size in degrees
    const angularSizeDegrees = (visibleRadius / earthRadius) * (180 / Math.PI);
    
    // Adjust for latitude compression (longitude lines get closer at higher latitudes)
    const latitudeCompressionFactor = Math.cos((centerLat * Math.PI) / 180);
    
    // Calculate bounds with some padding for smooth transitions
    const padding = Math.max(0.1, angularSizeDegrees * 0.1); // 10% padding
    
    const latRange = angularSizeDegrees + padding;
    const lngRange = (angularSizeDegrees / latitudeCompressionFactor) + padding;
    
    // Ensure we don't exceed world bounds
    const minLng = Math.max(-180, centerLng - lngRange);
    const maxLng = Math.min(180, centerLng + lngRange);
    const minLat = Math.max(-85, centerLat - latRange);
    const maxLat = Math.min(85, centerLat + latRange);
    
    console.log('Camera view bounds:', {
      altitude,
      centerLat: centerLat.toFixed(2),
      centerLng: centerLng.toFixed(2),
      angularSize: angularSizeDegrees.toFixed(2),
      bounds: [minLng.toFixed(2), minLat.toFixed(2), maxLng.toFixed(2), maxLat.toFixed(2)]
    });
    
    return [minLng, minLat, maxLng, maxLat];
  };

  // Update clusters based on current view with real-time culling
  const updateClusters = () => {
    if (!clusterer) return;
    
    const bounds = calculateBounds();
    const newClusters = getClusters(clusterer, bounds, zoom);
    
    // Additional filtering based on camera view (double-check visibility)
    const pov = globeRef.current?.pointOfView();
    const filteredClusters = newClusters.filter(cluster => {
      if (!pov) return true;
      
      // Check if cluster is within a reasonable distance from camera center
      const centerLat = pov.lat || 0;
      const centerLng = pov.lng || 0;
      const altitude = pov.altitude || 2;
      
      // Calculate angular distance from camera center
      const latDiff = Math.abs(cluster.lat - centerLat);
      const lngDiff = Math.abs(cluster.lng - centerLng);
      
      // Maximum visible angle based on altitude (more restrictive culling)
      const maxVisibleAngle = Math.min(60, Math.max(5, 30 / altitude));
      
      return latDiff <= maxVisibleAngle && lngDiff <= maxVisibleAngle;
    });
    
    console.log('Updating clusters:', {
      zoom,
      bounds,
      totalClusters: newClusters.length,
      filteredClusters: filteredClusters.length,
      clustersCount: filteredClusters.filter(c => c.isCluster).length,
      individualPoints: filteredClusters.filter(c => !c.isCluster).length,
      cameraAltitude: pov?.altitude?.toFixed(3)
    });
    
    setClusters(filteredClusters);
  };

  useEffect(() => {
    if (clusterer) {
      updateClusters();
    }
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

      // Aggressive clustering - prioritize clusters over individual users
      let zoomLevel;
      if (newAltitude > 3) {
        zoomLevel = 0; // Global clustering - maximum clustering
      } else if (newAltitude > 2.5) {
        zoomLevel = 1; // Continental clustering - very high clustering
      } else if (newAltitude > 2) {
        zoomLevel = 2; // Large regional clustering
      } else if (newAltitude > 1.5) {
        zoomLevel = 3; // Regional clustering
      } else if (newAltitude > 1.2) {
        zoomLevel = 4; // Country clustering
      } else if (newAltitude > 1.0) {
        zoomLevel = 5; // State/Province clustering
      } else if (newAltitude > 0.8) {
        zoomLevel = 6; // Large city clustering
      } else if (newAltitude > 0.6) {
        zoomLevel = 7; // City clustering
      } else if (newAltitude > 0.4) {
        zoomLevel = 8; // District clustering
      } else if (newAltitude > 0.3) {
        zoomLevel = 9; // Neighborhood clustering
      } else if (newAltitude > 0.2) {
        zoomLevel = 10; // Street clustering
      } else if (newAltitude > 0.15) {
        zoomLevel = 12; // Block clustering
      } else if (newAltitude > 0.1) {
        zoomLevel = 14; // Detailed clustering
      } else {
        zoomLevel = 16; // Final clustering level - users only at very close zoom
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

  // Track camera position for clustering updates
  const [cameraPosition, setCameraPosition] = useState({ lat: 0, lng: 0, altitude: 2 });

  // Listen to camera movements
  useEffect(() => {
    if (!globeRef.current) return;
    
    const globe = globeRef.current;
    let updateTimeout: NodeJS.Timeout;
    
    const handleCameraMove = () => {
      const pov = globe.pointOfView();
      const newPosition = {
        lat: pov.lat || 0,
        lng: pov.lng || 0,
        altitude: pov.altitude || 2
      };
      
      // More sensitive position tracking for real-time culling
      const altitude = newPosition.altitude;
      const sensitivity = Math.max(0.01, altitude * 0.05); // Dynamic sensitivity based on altitude
      
      const positionChanged = 
        Math.abs(newPosition.lat - cameraPosition.lat) > sensitivity ||
        Math.abs(newPosition.lng - cameraPosition.lng) > sensitivity ||
        Math.abs(newPosition.altitude - cameraPosition.altitude) > 0.005;
      
      if (positionChanged) {
        setCameraPosition(newPosition);
        
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
          updateClusters();
        }, 50); // Faster updates for real-time culling
      }
    };
    
    globe.controls().addEventListener('change', handleCameraMove);
    
    return () => {
      globe.controls().removeEventListener('change', handleCameraMove);
      clearTimeout(updateTimeout);
    };
  }, [clusterer, cameraPosition]);

  // Update clusters when camera position changes
  useEffect(() => {
    if (clusterer) {
      updateClusters();
    }
  }, [cameraPosition, clusterer]);

  // Handle point click with improved cluster expansion
  const handlePointClick = (point: any, event: MouseEvent, coords: { lat: number; lng: number; altitude: number; }) => {
    // Set the selected point for targeting effect
    setSelectedPoint(point);
    
    if (point.isCluster && clusterer) {
      // Get expansion zoom for this cluster
      const expansionZoom = getClusterExpansionZoom(clusterer, point.id);
      
      // Calculate appropriate altitude for the expansion zoom with better mapping
      let targetAltitude;
      if (expansionZoom <= 1) {
        targetAltitude = 2.0;
      } else if (expansionZoom <= 3) {
        targetAltitude = 1.5;
      } else if (expansionZoom <= 5) {
        targetAltitude = 1.0;
      } else if (expansionZoom <= 7) {
        targetAltitude = 0.7;
      } else if (expansionZoom <= 9) {
        targetAltitude = 0.5;
      } else if (expansionZoom <= 11) {
        targetAltitude = 0.3;
      } else if (expansionZoom <= 13) {
        targetAltitude = 0.2;
      } else {
        targetAltitude = 0.15;
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

  // Create enhanced Google Maps-style cluster markers with better scaling
  const createClusterMarker = (cluster: ClusterFeature) => {
    const group = new THREE.Group();
    
    // Determine cluster size and color based on count with improved scaling
    const count = cluster.count || 0;
    const totalUsers = cluster.properties?.totalUsers || count;
    let size, color, textColor, borderColor;
    
    // Enhanced size and color scaling for better visual hierarchy
    if (count < 3) {
      size = 1.0;
      color = 0x4285f4; // Google blue
      borderColor = 0x1a73e8;
      textColor = '#ffffff';
    } else if (count < 10) {
      size = 1.3;
      color = 0x4285f4; // Google blue
      borderColor = 0x1a73e8;
      textColor = '#ffffff';
    } else if (count < 25) {
      size = 1.6;
      color = 0x4285f4; // Google blue
      borderColor = 0x1a73e8;
      textColor = '#ffffff';
    } else if (count < 50) {
      size = 2.0;
      color = 0xea4335; // Google red
      borderColor = 0xd93025;
      textColor = '#ffffff';
    } else if (count < 100) {
      size = 2.4;
      color = 0xea4335; // Google red
      borderColor = 0xd93025;
      textColor = '#ffffff';
    } else if (count < 250) {
      size = 2.8;
      color = 0xfbbc04; // Google yellow
      borderColor = 0xf9ab00;
      textColor = '#000000';
    } else if (count < 500) {
      size = 3.2;
      color = 0xfbbc04; // Google yellow
      borderColor = 0xf9ab00;
      textColor = '#000000';
    } else if (count < 1000) {
      size = 3.6;
      color = 0x34a853; // Google green
      borderColor = 0x137333;
      textColor = '#ffffff';
    } else {
      size = 4.0;
      color = 0x9c27b0; // Purple for massive clusters
      borderColor = 0x7b1fa2;
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
    
    // Add text (count) with better formatting - centered on cluster
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

    // Create permanent floating number above cluster
    const numberCanvas = document.createElement('canvas');
    const numberContext = numberCanvas.getContext('2d');
    if (numberContext) {
      numberCanvas.width = 256;
      numberCanvas.height = 128;
      
      // Create background for better readability
      numberContext.fillStyle = 'rgba(0, 0, 0, 0.8)';
      numberContext.roundRect(10, 10, 236, 108, 15);
      numberContext.fill();
      
      // Add white border
      numberContext.strokeStyle = '#ffffff';
      numberContext.lineWidth = 2;
      numberContext.roundRect(10, 10, 236, 108, 15);
      numberContext.stroke();
      
      // Add the count text
      numberContext.fillStyle = '#ffffff';
      numberContext.font = 'bold 48px Arial';
      numberContext.textAlign = 'center';
      numberContext.textBaseline = 'middle';
      
      // Format the display text
      let displayText = count.toString();
      if (count >= 1000000) {
        displayText = (count / 1000000).toFixed(1) + 'M';
      } else if (count >= 1000) {
        displayText = (count / 1000).toFixed(1) + 'K';
      }
      
      numberContext.fillText(displayText, 128, 64);
      
      const numberTexture = new THREE.CanvasTexture(numberCanvas);
      const numberMaterial = new THREE.SpriteMaterial({ 
        map: numberTexture,
        transparent: true,
        depthTest: false, // Always show on top
        depthWrite: false
      });
      const numberSprite = new THREE.Sprite(numberMaterial);
      
      // Position above the cluster
      numberSprite.position.set(0, size * 2.5, 0.1);
      numberSprite.scale.set(size * 2, size * 1, 1);
      
      group.add(numberSprite);
    }
    
    // Add targeting box effect if this cluster is selected
    const isTargeted = selectedPoint && selectedPoint.id === cluster.id && selectedPoint.isCluster;
    if (isTargeted) {
      const targetingBox = createTargetingBox(size * 3);
      group.add(targetingBox);
    }
    
    return group;
  };

  const createUserMarker = (user: ClusterFeature) => {
    const group = new THREE.Group();
    const geometry = new THREE.SphereGeometry(0.3, 16, 16);
    const isHighlighted = highlightedUsers.some(u => u.lat === user.lat && u.lng === user.lng);
    const isSelected = selectedCity && selectedCity.lat === user.lat && selectedCity.lng === user.lng;
    const isTargeted = selectedPoint && selectedPoint.id === user.id && !selectedPoint.isCluster;
    
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
    
    // Add targeting box effect if selected
    if (isTargeted) {
      const targetingBox = createTargetingBox(2.0);
      group.add(targetingBox);
    }
    
    return group;
  };

  // Create targeting/selection box effect
  const createTargetingBox = (size: number) => {
    const group = new THREE.Group();
    
    // Create animated green targeting box
    const boxSize = size;
    const thickness = 0.1;
    const cornerLength = boxSize * 0.3;
    
    // Create corner brackets (4 corners, 2 lines each)
    const corners = [
      // Top-left corner
      { pos: [-boxSize/2, boxSize/2, 0], lines: [
        { start: [0, 0, 0], end: [cornerLength, 0, 0] },
        { start: [0, 0, 0], end: [0, -cornerLength, 0] }
      ]},
      // Top-right corner
      { pos: [boxSize/2, boxSize/2, 0], lines: [
        { start: [0, 0, 0], end: [-cornerLength, 0, 0] },
        { start: [0, 0, 0], end: [0, -cornerLength, 0] }
      ]},
      // Bottom-left corner
      { pos: [-boxSize/2, -boxSize/2, 0], lines: [
        { start: [0, 0, 0], end: [cornerLength, 0, 0] },
        { start: [0, 0, 0], end: [0, cornerLength, 0] }
      ]},
      // Bottom-right corner
      { pos: [boxSize/2, -boxSize/2, 0], lines: [
        { start: [0, 0, 0], end: [-cornerLength, 0, 0] },
        { start: [0, 0, 0], end: [0, cornerLength, 0] }
      ]}
    ];
    
    corners.forEach(corner => {
      const cornerGroup = new THREE.Group();
      cornerGroup.position.set(...corner.pos);
      
      corner.lines.forEach(line => {
        const points = [
          new THREE.Vector3(...line.start),
          new THREE.Vector3(...line.end)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
          color: 0x00ff00, // Bright green
          linewidth: 3,
          transparent: true,
          opacity: 0.9
        });
        const lineSegment = new THREE.Line(geometry, material);
        cornerGroup.add(lineSegment);
      });
      
      group.add(cornerGroup);
    });
    
    // Add pulsing animation
    const scale = 1 + Math.sin(Date.now() * 0.005) * 0.1;
    group.scale.set(scale, scale, scale);
    
    // Add rotation animation
    group.rotation.z = Date.now() * 0.001;
    
    // Mark this as a targeting box for animation updates
    group.userData = { isTargetingBox: true };
    
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
            pointLabel=""
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
                // Enhanced radius scaling for better cluster visibility
                if (count < 3) return 0.10;
                if (count < 10) return 0.14;
                if (count < 25) return 0.18;
                if (count < 50) return 0.22;
                if (count < 100) return 0.26;
                if (count < 250) return 0.30;
                if (count < 500) return 0.35;
                if (count < 1000) return 0.40;
                return 0.45; // Massive clusters
              }
              return 0.05; // Individual users - slightly larger
            }}
            onPointClick={handlePointClick}
            width={window.innerWidth}
            height={window.innerHeight}
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="rgba(255, 255, 255, 0.2)"
            atmosphereAltitude={0.1}
            customThreeObject={(d: any) => {
              const group = new THREE.Group();
              
              // Add the main marker (cluster or user)
              const marker = d.isCluster ? createClusterMarker(d) : createUserMarker(d);
              group.add(marker);
              
              // Create permanent tooltip
              const tooltipCanvas = document.createElement('canvas');
              const tooltipContext = tooltipCanvas.getContext('2d');
              if (tooltipContext) {
                tooltipCanvas.width = 400;
                tooltipCanvas.height = d.isCluster ? 180 : 120;
                
                // Background with rounded corners
                tooltipContext.fillStyle = 'rgba(255, 255, 255, 0.95)';
                tooltipContext.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                tooltipContext.lineWidth = 2;
                
                const cornerRadius = 15;
                const width = tooltipCanvas.width - 20;
                const height = tooltipCanvas.height - 20;
                const x = 10;
                const y = 10;
                
                // Draw rounded rectangle
                tooltipContext.beginPath();
                tooltipContext.roundRect(x, y, width, height, cornerRadius);
                tooltipContext.fill();
                tooltipContext.stroke();
                
                // Add text content
                if (d.isCluster) {
                  // Cluster tooltip
                  tooltipContext.fillStyle = '#1f2937';
                  tooltipContext.font = 'bold 28px Arial';
                  tooltipContext.textAlign = 'center';
                  tooltipContext.fillText(`${d.count.toLocaleString()} locations`, 200, 50);
                  
                  tooltipContext.fillStyle = '#6b7280';
                  tooltipContext.font = '22px Arial';
                  tooltipContext.fillText(`${(d.properties?.totalUsers || d.count).toLocaleString()} total users`, 200, 85);
                  
                  tooltipContext.fillStyle = '#2563eb';
                  tooltipContext.font = '18px Arial';
                  tooltipContext.fillText('Click to zoom in', 200, 115);
                } else {
                  // Individual user tooltip
                  tooltipContext.fillStyle = '#1f2937';
                  tooltipContext.font = 'bold 24px Arial';
                  tooltipContext.textAlign = 'center';
                  tooltipContext.fillText(d.properties.city, 200, 45);
                  
                  tooltipContext.fillStyle = '#6b7280';
                  tooltipContext.font = '20px Arial';
                  tooltipContext.fillText(`${d.properties.users.toLocaleString()} users`, 200, 75);
                }
                
                const tooltipTexture = new THREE.CanvasTexture(tooltipCanvas);
                const tooltipMaterial = new THREE.SpriteMaterial({ 
                  map: tooltipTexture,
                  transparent: true,
                  depthTest: false,
                  depthWrite: false
                });
                const tooltipSprite = new THREE.Sprite(tooltipMaterial);
                
                // Position tooltip above the marker
                const tooltipHeight = d.isCluster ? 4.5 : 3;
                const tooltipWidth = d.isCluster ? 6 : 4.5;
                tooltipSprite.position.set(0, (d.isCluster ? 5 : 2), 0.2);
                tooltipSprite.scale.set(tooltipWidth, tooltipHeight, 1);
                
                group.add(tooltipSprite);
              }
              
              return group;
            }}
            customThreeObjectUpdate={(obj: any, d: any) => {
              obj.position.set(0, 0, 0);
              
              // Update targeting box animation if this point is selected
              const isTargeted = selectedPoint && selectedPoint.id === d.id;
              if (isTargeted) {
                // Find and update the targeting box animation
                obj.children.forEach((child: any) => {
                  if (child.userData && child.userData.isTargetingBox) {
                    const scale = 1 + Math.sin(Date.now() * 0.005) * 0.1;
                    child.scale.set(scale, scale, scale);
                    child.rotation.z = Date.now() * 0.001;
                  }
                });
              }
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
