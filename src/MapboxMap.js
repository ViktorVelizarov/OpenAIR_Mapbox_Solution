import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapboxMap.css';

mapboxgl.accessToken = 'pk.eyJ1IjoidmlrdG9ydmVsIiwiYSI6ImNtMXA5aWRnZjAxbHQyanIwNGJpdm5laW8ifQ.GgVEWeC2CA3J-EfZj6VHNQ';

const MapboxMap = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0], // Initial map center [lng, lat]
      zoom: 5
    });

    // Add OpenAIP raster tile source when the map is loaded
    map.on('load', () => {
      // Add OpenAIP source as a raster layer
      map.addSource('openaip', {
        type: 'raster',
        tiles: [
          'https://api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.png?apiKey=520d0bec91fa6c97e4fa33a76f531186'
        ],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 14
      });

      // Add a layer to display OpenAIP raster tiles
      map.addLayer({
        id: 'openaip-tiles',
        type: 'raster',
        source: 'openaip',
        paint: {
          'raster-opacity': 1
        }
      });
    });

    // Cleanup on unmount
    return () => map.remove();
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapboxMap;
