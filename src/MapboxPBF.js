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

      // Add all layers with appropriate settings
      // 1. Airports (as points)
      mapInstance.addLayer({
        id: 'airports',
        type: 'circle',
        source: 'openaip-vector',
        'source-layer': 'airports',
        paint: {
          'circle-radius': 5,
          'circle-color': '#ff0000'
        }
      });

      // 2. Airspaces (as polygons)
      mapInstance.addLayer({
        id: 'airspaces',
        type: 'fill',
        source: 'openaip-vector',
        'source-layer': 'airspaces',
        paint: {
          'fill-color': '#00ff00',
          'fill-opacity': 0.4
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

      // 4. Airspaces Border Offset 2x (as lines)
      mapInstance.addLayer({
        id: 'airspaces-border-offset-2x',
        type: 'line',
        source: 'openaip-vector',
        'source-layer': 'airspaces_border_offset_2x',
        paint: {
          'line-color': '#ff00ff',
          'line-width': 3
        }
      });

      // 5. Hotspots (as points)
      mapInstance.addLayer({
        id: 'hotspots',
        type: 'circle',
        source: 'openaip-vector',
        'source-layer': 'hotspots',
        paint: {
          'circle-radius': 4,
          'circle-color': '#ff0000'
        }
      });

      // 6. Navaids (as points)
      mapInstance.addLayer({
        id: 'navaids',
        type: 'circle',
        source: 'openaip-vector',
        'source-layer': 'navaids',
        paint: {
          'circle-radius': 4,
          'circle-color': '#ff9900'
        }
      });

      // 7. Reporting Points (as points)
      mapInstance.addLayer({
        id: 'reporting-points',
        type: 'circle',
        source: 'openaip-vector',
        'source-layer': 'reporting_points',
        paint: {
          'circle-radius': 3,
          'circle-color': '#ffff00'
        }
      });

      // 8. Obstacles (as points)
      mapInstance.addLayer({
        id: 'obstacles',
        type: 'circle',
        source: 'openaip-vector',
        'source-layer': 'obstacles',
        paint: {
          'circle-radius': 6,
          'circle-color': '#ff00ff'
        }
      });

      // 9. RC Airfields (as points)
      mapInstance.addLayer({
        id: 'rc-airfields',
        type: 'circle',
        source: 'openaip-vector',
        'source-layer': 'rc_airfields',
        paint: {
          'circle-radius': 5,
          'circle-color': '#0000ff'
        }
      });

      setMap(mapInstance);
    });

    return () => mapInstance.remove(); // Cleanup on unmount
  }, []);

  // Toggle the visibility of the OpenAIP layers
  const toggleLayerVisibility = () => {
    if (map) {
      const visibility = map.getLayoutProperty('airports', 'visibility');
      const newVisibility = visibility === 'visible' ? 'none' : 'visible';

      // Toggle visibility for all layers
      const layers = ['airports', 'airspaces', 'airspaces-border-offset', 'airspaces-border-offset-2x', 'hotspots', 'navaids', 'reporting-points', 'obstacles', 'rc-airfields'];
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
