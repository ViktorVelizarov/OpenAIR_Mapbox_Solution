import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapboxMap.css';

mapboxgl.accessToken = 'pk.eyJ1IjoidmlrdG9ydmVsIiwiYSI6ImNtMXA5aWRnZjAxbHQyanIwNGJpdm5laW8ifQ.GgVEWeC2CA3J-EfZj6VHNQ';

const MapboxMap = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLayerVisible, setIsLayerVisible] = useState(true);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0], // Initial map center [lng, lat]
      zoom: 5
    });

    mapInstance.on('load', () => {
      // Add OpenAIP vector tile source
      mapInstance.addSource('openaip-vector', {
        type: 'vector',
        tiles: [
          'https://api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.pbf?apiKey=520d0bec91fa6c97e4fa33a76f531186'
        ],
        minzoom: 0,
        maxzoom: 14
      });

      // 1. Airspaces (fill with red and opacity)
      mapInstance.addLayer({
        id: 'airspaces-fill',
        type: 'fill',
        source: 'openaip-vector',
        'source-layer': 'airspaces',
        paint: {
          'fill-color': '#ff0000', // Red fill
          'fill-opacity': 0.3 // Semi-transparent
        }
      });

      // 2. Airspaces Border Offset 2x (as thinner pink lines)
      mapInstance.addLayer({
        id: 'airspaces-border-offset-2x',
        type: 'line',
        source: 'openaip-vector',
        'source-layer': 'airspaces_border_offset_2x',
        paint: {
          'line-color': '#ff1493', // Pink color
          'line-width': 0.5, // Even thinner lines
          'line-opacity': 0.7 // Somewhat transparent
        }
      });

      // 3. Airspaces Border Offset (as lines)
      mapInstance.addLayer({
        id: 'airspaces-border-offset',
        type: 'line',
        source: 'openaip-vector',
        'source-layer': 'airspaces_border_offset',
        paint: {
          'line-color': '#0000ff',
          'line-width': 2
        }
      });

      setMap(mapInstance);
    });

    return () => mapInstance.remove(); // Cleanup on unmount
  }, []);

  // Toggle the visibility of the OpenAIP layers
  const toggleLayerVisibility = () => {
    if (map) {
      const visibility = map.getLayoutProperty('airspaces-fill', 'visibility');
      const newVisibility = visibility === 'visible' ? 'none' : 'visible';

      // Toggle visibility for the remaining layers
      const layers = ['airspaces-fill', 'airspaces-border-offset', 'airspaces-border-offset-2x'];
      layers.forEach(layerId => {
        map.setLayoutProperty(layerId, 'visibility', newVisibility);
      });

      setIsLayerVisible(!isLayerVisible);
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
          zIndex: 10,
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#cc0000';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#ff0000';
        }}
      >
        {isLayerVisible ? 'Hide OpenAIP Layers' : 'Show OpenAIP Layers'}
      </button>
    </div>
  );
};

export default MapboxMap;
