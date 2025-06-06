
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

  // Create pin-style markers like in the reference image
  const createClusterMarker = (cluster: ClusterFeature) => {
    const group = new THREE.Group();
    
    // Determine cluster size and color based on count
    const count = cluster.count || 0;
    const totalUsers = cluster.properties?.totalUsers || count;
    let pinColor, textColor, pinSize;
    
    // Color coding based on count ranges like in reference image
    if (count < 10) {
      pinColor = '#FF9800'; // Orange for small clusters
      textColor = '#ffffff';
      pinSize = 1.2;
    } else if (count < 20) {
      pinColor = '#FF9800'; // Orange for medium clusters
      textColor = '#ffffff';
      pinSize = 1.4;
    } else if (count < 50) {
      pinColor = '#FF9800'; // Orange for larger clusters
      textColor = '#ffffff';
      pinSize = 1.6;
    } else {
      pinColor = '#FF9800'; // Orange for massive clusters
      textColor = '#ffffff';
      pinSize = 1.8;
    }
    
    // Create simple circular marker
    const circleGeometry = new THREE.CircleGeometry(0.15, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({ 
      color: pinColor,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
      depthWrite: false
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.set(0, 0, 0.05);
    circle.renderOrder = 1;
    group.add(circle);
    
    // Create always-visible label positioned above the marker
    const labelCanvas = document.createElement('canvas');
    const labelContext = labelCanvas.getContext('2d');
    if (labelContext) {
      const canvasSize = 512;
      labelCanvas.width = canvasSize;
      labelCanvas.height = canvasSize;
      
      // Clear canvas
      labelContext.clearRect(0, 0, canvasSize, canvasSize);
      
      // Create label background (rounded rectangle)
      const labelWidth = 200;
      const labelHeight = 80;
      const labelX = (canvasSize - labelWidth) / 2;
      const labelY = (canvasSize - labelHeight) / 2;
      const cornerRadius = 8;
      
      // Background
      labelContext.fillStyle = 'rgba(0, 0, 0, 0.8)';
      labelContext.beginPath();
      labelContext.roundRect(labelX, labelY, labelWidth, labelHeight, cornerRadius);
      labelContext.fill();
      
      // Border
      labelContext.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      labelContext.lineWidth = 2;
      labelContext.beginPath();
      labelContext.roundRect(labelX, labelY, labelWidth, labelHeight, cornerRadius);
      labelContext.stroke();
      
      // Format the location count display text
      let displayText = count.toString();
      if (count >= 1000) {
        displayText = Math.floor(count / 1000) + 'k';
      } else if (count >= 100) {
        displayText = Math.floor(count / 100) + '00+';
      } else {
        displayText = count.toString();
      }
      
      // Location count text
      labelContext.fillStyle = '#ffffff';
      labelContext.font = 'bold 32px Arial, sans-serif';
      labelContext.textAlign = 'center';
      labelContext.textBaseline = 'middle';
      
      // Draw location count with outline for better visibility
      labelContext.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      labelContext.lineWidth = 4;
      labelContext.strokeText(displayText + ' locations', labelX + labelWidth / 2, labelY + labelHeight / 2 - 12);
      labelContext.fillText(displayText + ' locations', labelX + labelWidth / 2, labelY + labelHeight / 2 - 12);

      // Format the user count display text
      let userDisplayText = totalUsers.toString();
      if (totalUsers >= 1000000) {
        userDisplayText = (totalUsers / 1000000).toFixed(1) + 'M';
      } else if (totalUsers >= 1000) {
        userDisplayText = Math.floor(totalUsers / 1000) + 'k';
      } else {
        userDisplayText = totalUsers.toString();
      }
      
      // User count text
      labelContext.font = 'bold 28px Arial, sans-serif';
      labelContext.strokeText(userDisplayText + ' users', labelX + labelWidth / 2, labelY + labelHeight / 2 + 12);
      labelContext.fillStyle = '#4CAF50';
      labelContext.fillText(userDisplayText + ' users', labelX + labelWidth / 2, labelY + labelHeight / 2 + 12);
      
      // Create sprite from canvas
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      labelTexture.needsUpdate = true;
      labelTexture.flipY = false;
      labelTexture.minFilter = THREE.LinearFilter;
      labelTexture.magFilter = THREE.LinearFilter;
      labelTexture.generateMipmaps = false;
      
      const labelMaterial = new THREE.SpriteMaterial({ 
        map: labelTexture,
        transparent: true,
        alphaTest: 0.01,
        depthTest: false,
        depthWrite: false
      });
      const labelSprite = new THREE.Sprite(labelMaterial);
      
      // Scale label based on camera distance
      const pov = globeRef.current?.pointOfView();
      const altitude = pov?.altitude || 2;
      const scale = Math.max(0.8, Math.min(2.5, altitude * 1.2));
      
      labelSprite.scale.set(scale, scale, 1);
      labelSprite.position.set(0, 0, 0.8); // Position above the marker
      labelSprite.renderOrder = 2;
      
      group.add(labelSprite);
    }
    
    // Add targeting box effect if this cluster is selected
    const isTargeted = selectedPoint && selectedPoint.id === cluster.id && selectedPoint.isCluster;
    if (isTargeted) {
      const targetingBox = createTargetingBox(2.0);
      group.add(targetingBox);
    }
    
    return group;
  };

  const createUserMarker = (user: ClusterFeature) => {
    const group = new THREE.Group();
    const isHighlighted = highlightedUsers.some(u => u.lat === user.lat && u.lng === user.lng);
    const isSelected = selectedCity && selectedCity.lat === user.lat && selectedCity.lng === user.lng;
    const isTargeted = selectedPoint && selectedPoint.id === user.id && !selectedPoint.isCluster;
    
    // Get user count from properties
    const userCount = user.properties?.users || 1;
    const city = user.properties?.city || 'Unknown';
    
    // Determine color based on state
    let markerColor = '#2196F3'; // Default blue
    if (isSelected) markerColor = '#F44336'; // Red for selected
    if (isHighlighted) markerColor = '#4CAF50'; // Green for highlighted
    
    // Create simple circular marker for individual users
    const circleGeometry = new THREE.CircleGeometry(0.08, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({ 
      color: markerColor,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
      depthWrite: false
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.set(0, 0, 0.05);
    circle.renderOrder = 1;
    group.add(circle);
    
    // Create always-visible label for individual users
    const labelCanvas = document.createElement('canvas');
    const labelContext = labelCanvas.getContext('2d');
    if (labelContext) {
      const canvasSize = 512;
      labelCanvas.width = canvasSize;
      labelCanvas.height = canvasSize;
      
      // Clear canvas
      labelContext.clearRect(0, 0, canvasSize, canvasSize);
      
      // Create label background
      const labelWidth = 180;
      const labelHeight = 70;
      const labelX = (canvasSize - labelWidth) / 2;
      const labelY = (canvasSize - labelHeight) / 2;
      const cornerRadius = 6;
      
      // Background
      labelContext.fillStyle = 'rgba(0, 0, 0, 0.8)';
      labelContext.beginPath();
      labelContext.roundRect(labelX, labelY, labelWidth, labelHeight, cornerRadius);
      labelContext.fill();
      
      // Border
      labelContext.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      labelContext.lineWidth = 2;
      labelContext.beginPath();
      labelContext.roundRect(labelX, labelY, labelWidth, labelHeight, cornerRadius);
      labelContext.stroke();
      
      // City name text
      labelContext.fillStyle = '#ffffff';
      labelContext.font = 'bold 28px Arial, sans-serif';
      labelContext.textAlign = 'center';
      labelContext.textBaseline = 'middle';
      
      // Draw city name with outline
      labelContext.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      labelContext.lineWidth = 4;
      labelContext.strokeText(city, labelX + labelWidth / 2, labelY + labelHeight / 2 - 10);
      labelContext.fillText(city, labelX + labelWidth / 2, labelY + labelHeight / 2 - 10);

      // Format user count for display
      let displayText;
      if (userCount >= 1000000) {
        displayText = (userCount / 1000000).toFixed(1) + 'M';
      } else if (userCount >= 1000) {
        displayText = Math.floor(userCount / 1000) + 'k';
      } else {
        displayText = userCount.toString();
      }
      
      // User count text
      labelContext.font = 'bold 24px Arial, sans-serif';
      labelContext.strokeText(displayText + ' users', labelX + labelWidth / 2, labelY + labelHeight / 2 + 10);
      labelContext.fillStyle = '#4CAF50';
      labelContext.fillText(displayText + ' users', labelX + labelWidth / 2, labelY + labelHeight / 2 + 10);
      
      // Create sprite from canvas
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      labelTexture.needsUpdate = true;
      labelTexture.flipY = false;
      labelTexture.minFilter = THREE.LinearFilter;
      labelTexture.magFilter = THREE.LinearFilter;
      labelTexture.generateMipmaps = false;
      
      const labelMaterial = new THREE.SpriteMaterial({ 
        map: labelTexture,
        transparent: true,
        alphaTest: 0.01,
        depthTest: false,
        depthWrite: false
      });
      const labelSprite = new THREE.Sprite(labelMaterial);
      
      // Scale label based on camera distance
      const pov = globeRef.current?.pointOfView();
      const altitude = pov?.altitude || 2;
      const scale = Math.max(0.6, Math.min(2.0, altitude * 1.0));
      
      labelSprite.scale.set(scale, scale, 1);
      labelSprite.position.set(0, 0, 0.6); // Position above the marker
      labelSprite.renderOrder = 2;
      
      group.add(labelSprite);
    }
    
    // Add targeting box effect if selected
    if (isTargeted) {
      const targetingBox = createTargetingBox(1.5);
      group.add(targetingBox);
    }
    
    return group;
  };

  // Create targeting/selection box effect
  const createTargetingBox = (size: number) => {
    const group = new THREE.Group();
    
    // Create animated green targeting box with better visibility
    const boxSize = size;
    const cornerLength = boxSize * 0.4;
    const lineWidth = 0.15;
    
    // Create corner brackets (4 corners, 2 lines each)
    const corners = [
      // Top-left corner
      { pos: [-boxSize/2, boxSize/2, 0.5], lines: [
        { start: [0, 0, 0], end: [cornerLength, 0, 0] },
        { start: [0, 0, 0], end: [0, -cornerLength, 0] }
      ]},
      // Top-right corner
      { pos: [boxSize/2, boxSize/2, 0.5], lines: [
        { start: [0, 0, 0], end: [-cornerLength, 0, 0] },
        { start: [0, 0, 0], end: [0, -cornerLength, 0] }
      ]},
      // Bottom-left corner
      { pos: [-boxSize/2, -boxSize/2, 0.5], lines: [
        { start: [0, 0, 0], end: [cornerLength, 0, 0] },
        { start: [0, 0, 0], end: [0, cornerLength, 0] }
      ]},
      // Bottom-right corner
      { pos: [boxSize/2, -boxSize/2, 0.5], lines: [
        { start: [0, 0, 0], end: [-cornerLength, 0, 0] },
        { start: [0, 0, 0], end: [0, cornerLength, 0] }
      ]}
    ];
    
    corners.forEach(corner => {
      const cornerGroup = new THREE.Group();
      cornerGroup.position.set(...corner.pos);
      
      corner.lines.forEach(line => {
        // Create thick lines using cylinder geometry for better visibility
        const start = new THREE.Vector3(...line.start);
        const end = new THREE.Vector3(...line.end);
        const distance = start.distanceTo(end);
        
        const geometry = new THREE.CylinderGeometry(lineWidth, lineWidth, distance, 8);
        const material = new THREE.MeshBasicMaterial({ 
          color: 0x00ff00, // Bright green
          transparent: true,
          opacity: 1.0,
          emissive: 0x004400 // Add glow effect
        });
        
        const cylinder = new THREE.Mesh(geometry, material);
        
        // Position and orient the cylinder
        const direction = new THREE.Vector3().subVectors(end, start);
        cylinder.position.copy(start.clone().add(direction.clone().multiplyScalar(0.5)));
        cylinder.lookAt(end);
        cylinder.rotateX(Math.PI / 2);
        
        cornerGroup.add(cylinder);
      });
      
      group.add(cornerGroup);
    });
    
    // Add outer glow ring
    const ringGeometry = new THREE.RingGeometry(boxSize * 0.8, boxSize * 0.9, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.z = 0.3;
    group.add(ring);
    
    // Add pulsing animation
    const scale = 1 + Math.sin(Date.now() * 0.008) * 0.15;
    group.scale.set(scale, scale, scale);
    
    // Add rotation animation
    group.rotation.z = Date.now() * 0.002;
    
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
            pointLabel={() => ''}
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
              // Create the appropriate marker type
              if (d.isCluster) {
                return createClusterMarker(d);
              } else {
                return createUserMarker(d);
              }
            }}
            customThreeObjectUpdate={(obj: any, d: any) => {
              // Always ensure the object is positioned correctly
              Object3D.prototype.position.set.call(obj, 0, 0, 0);
              
              // Update scale based on camera distance for better visibility
              const pov = globeRef.current?.pointOfView();
              const altitude = pov?.altitude || 2;
              const baseScale = d.isCluster ? 1.2 : 0.8;
              const scale = Math.max(0.5, Math.min(3.0, altitude * baseScale));
              
              // Update all sprite children to maintain proper scale
              obj.children.forEach((child: any) => {
                if (child.type === 'Sprite') {
                  child.scale.set(scale, scale, 1);
                }
              });
              
              // Update targeting box animation if this point is selected
              const isTargeted = selectedPoint && selectedPoint.id === d.id;
              if (isTargeted) {
                // Find and update the targeting box animation
                obj.children.forEach((child: any) => {
                  if (child.userData && child.userData.isTargetingBox) {
                    const animScale = 1 + Math.sin(Date.now() * 0.008) * 0.15;
                    child.scale.set(animScale, animScale, animScale);
                    child.rotation.z = Date.now() * 0.002;
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
