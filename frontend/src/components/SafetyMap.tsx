import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Compass, Navigation, RefreshCw } from 'lucide-react';
import { getNearbySafety, SafetyPoint } from '../services/api';

interface SafetyMapProps {
  initialLat?: number;
  initialLon?: number;
  onLocationUpdate?: (lat: number, lon: number) => void;
}

export const SafetyMap: React.FC<SafetyMapProps> = ({
  initialLat = 26.4499,
  initialLon = 80.3319,
  onLocationUpdate,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [coords, setCoords] = useState<{ lat: number; lon: number }>({
    lat: initialLat,
    lon: initialLon,
  });
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [loadingPoints, setLoadingPoints] = useState<boolean>(false);
  const [safetyPoints, setSafetyPoints] = useState<SafetyPoint[]>([]);
  const [statusText, setStatusText] = useState<string>('Spatial telemetry calibrated');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lon],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Muted Forest / Dark Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);

      // Render Geofence Caution Rings
      const cautionZoneCircle = L.circle([26.46, 80.34], {
        color: '#dfb15b',
        fillColor: '#dfb15b',
        fillOpacity: 0.16,
        radius: 1500,
        weight: 1.5,
      }).addTo(map);
      cautionZoneCircle.bindPopup('<b>⚠️ Alpine Caution Zone</b><br>Radius: 1.5 km');

      const restrictedZoneCircle = L.circle([26.4499, 80.3319], {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.22,
        radius: 1000,
        weight: 2,
      }).addTo(map);
      restrictedZoneCircle.bindPopup('<b>🚨 Demo Restricted Zone</b><br>Radius: 1.0 km');

      mapInstanceRef.current = map;
    }

    updateUserMarker(coords.lat, coords.lon);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const updateUserMarker = (lat: number, lon: number) => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
    }

    const customUserIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#dfb15b] opacity-75"></span>
          <span class="relative inline-flex rounded-full h-5 w-5 bg-[#dfb15b] border-2 border-[#070e0a] shadow-[0_0_15px_#dfb15b]"></span>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const marker = L.marker([lat, lon], { icon: customUserIcon }).addTo(mapInstanceRef.current);
    marker.bindPopup(`<b>📍 Traveler GPS</b><br>Lat: ${lat.toFixed(5)}<br>Lon: ${lon.toFixed(5)}`).openPopup();
    userMarkerRef.current = marker;

    mapInstanceRef.current.setView([lat, lon], 14);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'police':
        return '🚓';
      case 'hospital':
        return '🏥';
      case 'fire_station':
        return '🚒';
      case 'pharmacy':
        return '💊';
      default:
        return '🛡️';
    }
  };

  const fetchNearbyPlaces = async (lat: number, lon: number) => {
    setLoadingPoints(true);
    setStatusText('Querying Overpass OpenStreetMap radar...');
    try {
      const data = await getNearbySafety(lat, lon);
      if (data && data.places) {
        setSafetyPoints(data.places);
        setStatusText(`Discovered ${data.places.length} emergency safety points.`);

        if (markersLayerRef.current) {
          markersLayerRef.current.clearLayers();
          data.places.forEach((place) => {
            const iconHtml = `<div class="text-xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">${getIconForType(
              place.type
            )}</div>`;
            const customIcon = L.divIcon({
              className: 'safety-point-marker',
              html: iconHtml,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });

            if (mapInstanceRef.current && markersLayerRef.current) {
              const marker = L.marker([place.latitude, place.longitude], {
                icon: customIcon,
              });
              marker.bindPopup(`
                <div class="font-sans text-xs">
                  <strong class="text-sm text-[#dfb15b]">${getIconForType(place.type)} ${place.name}</strong>
                  <p class="text-sandstone-dark capitalize mt-1">Category: ${place.type.replace('_', ' ')}</p>
                  <p class="text-emerald-400 font-mono mt-0.5">${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}</p>
                </div>
              `);
              markersLayerRef.current.addLayer(marker);
            }
          });
        }
      }
    } catch (error) {
      console.error(error);
      setStatusText('Could not connect to Overpass safety API.');
    } finally {
      setLoadingPoints(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setStatusText('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingLocation(true);
    setStatusText('Triangulating GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
        setLoadingLocation(false);
        setStatusText('GPS lock acquired.');
        updateUserMarker(latitude, longitude);
        if (onLocationUpdate) onLocationUpdate(latitude, longitude);
        fetchNearbyPlaces(latitude, longitude);
      },
      (error) => {
        setLoadingLocation(false);
        setStatusText(
          error.code === 1
            ? 'Location permission denied. Using demo coordinates.'
            : 'GPS detection timed out. Using demo coordinates.'
        );
        fetchNearbyPlaces(coords.lat, coords.lon);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="glass-forest rounded-3xl p-6 flex flex-col h-full border border-[#dfb15b]/25 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#fffdfa] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#dfb15b]" />
            <span>Interactive Alpine Safety Radar</span>
          </h3>
          <p className="text-xs text-sandstone-dark font-mono mt-0.5">{statusText}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDetectLocation}
            disabled={loadingLocation}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-[#14261c] hover:bg-[#1a3325] border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${loadingLocation ? 'animate-spin' : ''}`} />
            <span>{loadingLocation ? 'Detecting...' : 'Detect GPS'}</span>
          </button>

          <button
            onClick={() => fetchNearbyPlaces(coords.lat, coords.lon)}
            disabled={loadingPoints}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-[#262013] hover:bg-[#332a19] border border-[#dfb15b]/40 text-[#dfb15b] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingPoints ? 'animate-spin' : ''}`} />
            <span>{loadingPoints ? 'Scanning...' : 'Scan 3km Radar'}</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[380px] md:h-[440px] rounded-2xl overflow-hidden border border-[#dfb15b]/20 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[1000] glass-forest px-3 py-2 rounded-xl text-[11px] text-sandstone-light flex flex-wrap items-center gap-3 border border-[#dfb15b]/30 backdrop-blur-md">
          <span className="flex items-center gap-1">📍 You</span>
          <span className="flex items-center gap-1">🚓 Police</span>
          <span className="flex items-center gap-1">🏥 Hospital</span>
          <span className="flex items-center gap-1">🚒 Fire</span>
          <span className="flex items-center gap-1">💊 Pharmacy</span>
          <span className="flex items-center gap-1 text-[#dfb15b]">⚠️ Caution Zone</span>
          <span className="flex items-center gap-1 text-rose-400">🚨 Restricted</span>
        </div>
      </div>

      {/* Nearby Safety Points Stream */}
      {safetyPoints.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-sandstone-dark mb-2">
            Discovered Safety Anchors ({safetyPoints.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-40 overflow-y-auto pr-1">
            {safetyPoints.slice(0, 9).map((point, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#09150e] border border-[#dfb15b]/15 flex items-center gap-2.5 text-xs text-sandstone-light"
              >
                <span className="text-base">{getIconForType(point.type)}</span>
                <div className="overflow-hidden">
                  <p className="font-semibold truncate">{point.name}</p>
                  <p className="text-[10px] text-sandstone-dark font-mono capitalize">
                    {point.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
