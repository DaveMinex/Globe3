import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface GlobeViewProps {
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  radius?: number; // in meters
  onZoom?: (level: number) => void;
}

const GlobeView: React.FC<GlobeViewProps> = ({ 
  userLocation, 
  radius = 20,
  onZoom 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.5;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    // Create Earth sphere
    const geometry = new THREE.SphereGeometry(2, 128, 128);
    const textureLoader = new THREE.TextureLoader();
    
    // Load textures
    const earthTexture = textureLoader.load('textures/earth_texture.jpg');
    const bumpMap = textureLoader.load('textures/earth_bump.jpg');
    const specularMap = textureLoader.load('textures/earth_specular.jpg');
    const cloudsTexture = textureLoader.load('textures/earth_clouds.jpg');

    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      specularMap: specularMap,
      specular: new THREE.Color(0x333333),
      shininess: 5
    });

    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Add clouds layer
    const cloudsGeometry = new THREE.SphereGeometry(2.01, 128, 128);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Add stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate clouds
      clouds.rotation.y += 0.0005;
      
      // Update controls
      controls.update();
      
      // Calculate zoom level
      const newZoomLevel = Math.round((camera.position.z - 2.5) / 0.5);
      if (newZoomLevel !== zoomLevel) {
        setZoomLevel(newZoomLevel);
        onZoom?.(newZoomLevel);
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      scene.clear();
    };
  }, [onZoom]);

  // Handle user location updates
  useEffect(() => {
    if (!userLocation || !sceneRef.current) return;

    // Convert lat/long to 3D coordinates
    const phi = (90 - userLocation.latitude) * (Math.PI / 180);
    const theta = (userLocation.longitude + 180) * (Math.PI / 180);
    const radius = 2; // Earth radius in our scene

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    // Create marker for user location
    const markerGeometry = new THREE.SphereGeometry(0.02, 32, 32);
    const markerMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff0000,
      transparent: true,
      opacity: 0.8
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(x, y, z);
    sceneRef.current.add(marker);

    // Create radius indicator
    const radiusGeometry = new THREE.RingGeometry(0.02, 0.03, 32);
    const radiusMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff0000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const radiusIndicator = new THREE.Mesh(radiusGeometry, radiusMaterial);
    radiusIndicator.position.set(x, y, z);
    radiusIndicator.lookAt(0, 0, 0);
    sceneRef.current.add(radiusIndicator);

    // Add pulsing effect to marker
    const pulse = () => {
      marker.scale.x = 1 + Math.sin(Date.now() * 0.003) * 0.2;
      marker.scale.y = 1 + Math.sin(Date.now() * 0.003) * 0.2;
      marker.scale.z = 1 + Math.sin(Date.now() * 0.003) * 0.2;
      requestAnimationFrame(pulse);
    };
    pulse();

    return () => {
      if (sceneRef.current) {
        sceneRef.current.remove(marker);
        sceneRef.current.remove(radiusIndicator);
      }
    };
  }, [userLocation, radius]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ position: 'relative' }}
    />
  );
};

export default GlobeView; 