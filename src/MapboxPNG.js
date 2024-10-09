import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapboxMap.css';

mapboxgl.accessToken = 'pk.eyJ1IjoidmlrdG9ydmVsIiwiYSI6ImNtMXA5aWRnZjAxbHQyanIwNGJpdm5laW8ifQ.GgVEWeC2CA3J-EfZj6VHNQ';

const MapboxMap = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLayerVisible, setIsLayerVisible] = useState(true);

  useEffect(() => {
    // Initialize the map
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0], // Initial map center [lng, lat]
      zoom: 5
    });

    // Add OpenAIP raster tile source when the map is loaded
    mapInstance.on('load', () => {
      mapInstance.addSource('openaip', {
        type: 'raster',
        tiles: [
          'https://api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.png?apiKey=520d0bec91fa6c97e4fa33a76f531186'
        ],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 14
      });

      // Add a layer to display OpenAIP raster tiles
      mapInstance.addLayer({
        id: 'openaip-tiles',
        type: 'raster',
        source: 'openaip',
        paint: {
          'raster-opacity': 1
        }
      });

      setMap(mapInstance);
    });

    // Cleanup on unmount
    return () => mapInstance.remove();
  }, []);

  // Toggle the visibility of the OpenAIP layer
  const toggleLayerVisibility = () => {
    if (map) {
      const visibility = map.getLayoutProperty('openaip-tiles', 'visibility');
      if (visibility === 'visible') {
        map.setLayoutProperty('openaip-tiles', 'visibility', 'none');
        setIsLayerVisible(false);
      } else {
        map.setLayoutProperty('openaip-tiles', 'visibility', 'visible');
        setIsLayerVisible(true);
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div ref={mapContainerRef} className="map-container" />
      <button
        onClick={toggleLayerVisibility}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: '#ff0000',
          color: '#ffffff',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 15px',
          cursor: 'pointer',
          fontSize: '16px',
          zIndex: 10, // Ensure it appears above the map
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#cc0000'; // Darker red on hover
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#ff0000'; // Reset to original red
        }}
      >
        {isLayerVisible ? 'Hide OpenAIP Layer' : 'Show OpenAIP Layer'}
      </button>
    </div>
  );
};

export default MapboxMap;      