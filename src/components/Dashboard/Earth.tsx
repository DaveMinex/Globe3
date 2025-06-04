import React, { useEffect } from "react";
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { GlowingRippleDot } from "./GlowingRippleDot";

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
  useEffect(() => {
    if (viewMode === '3D' && globeRef.current) {
      globeRef.current.pointOfView({
        lat: 39.8283,
        lng: -98.5795,
        altitude: 1.8,
        rotation: 0
      }, 1000); // 1000ms for smooth transition
    }
  }, [viewMode, globeRef]);

  return (
    <div className={`w-full h-[100vh] z-0 relative  translate-x-[-60px] ${viewMode === '2D' ? 'pointer-events-none' : ''}`}>
      {viewMode === '3D' ? (
        <div className="w-full h-full flex justify-center items-center">
          <Globe
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            pointsData={locations}
            pointLat={(d: any) => d.lat}
            pointLng={(d: any) => d.lng}
            pointAltitude={0.01}
            pointLabel={(d: any) => `
              <div class='bg-white p-2 rounded-lg shadow-lg'>
                <div class='font-bold text-gray-800'>${d.city}</div>
                <div class='text-sm text-gray-600'>${d.users.toLocaleString()} users</div>
              </div>
            `}
            onPointClick={onPointClick}
            width={window.innerWidth * 1}
            height={window.innerHeight * 1}
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="rgba(255, 255, 255, 0.2)"
            atmosphereAltitude={0.1}
            customThreeObject={(d: any) => {
              // Create a glowing sphere
              const group = new THREE.Group();
              const geometry = new THREE.SphereGeometry(0.7, 16, 16);
              const material = new THREE.MeshBasicMaterial({ color: d === selectedCity ? 0xff4444 : 0xffff00 });
              const sphere = new THREE.Mesh(geometry, material);
              // Add glow
              const glowMaterial = new THREE.MeshBasicMaterial({ color: d === selectedCity ? 0xff4444 : 0xffff00, transparent: true, opacity: 0.3 });
              const glow = new THREE.Mesh(new THREE.SphereGeometry(1, 50, 50), glowMaterial);
              group.add(sphere);
              group.add(glow);
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