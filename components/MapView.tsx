import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FoodDrop } from '../types';
import { KW_CENTER } from '../constants';

interface MapViewProps {
  drops: FoodDrop[];
  onSelectDrop: (drop: FoodDrop) => void;
}

// Custom amber pin — avoids Leaflet's default icon asset resolution issues in Vite
function createMarker(drop: FoodDrop): L.Marker {
  const isClaimed = drop.status === 'claimed';
  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;
      background:${isClaimed ? '#9ca3af' : '#f59e0b'};
      border-radius:50%;
      border:2.5px solid ${isClaimed ? '#d1d5db' : '#fde68a'};
      box-shadow:0 0 0 5px ${isClaimed ? 'rgba(156,163,175,0.15)' : 'rgba(245,158,11,0.2)'};
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
  return L.marker([drop.lat, drop.lng], { icon });
}

export const MapView: React.FC<MapViewProps> = ({ drops, onSelectDrop }) => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<L.Map | null>(null);
  const markersRef    = useRef<L.Marker[]>([]);
  // Keep a stable ref to the latest callback so marker click handlers don't go stale
  const onSelectRef   = useRef(onSelectDrop);
  useEffect(() => { onSelectRef.current = onSelectDrop; }, [onSelectDrop]);

  // Initialise map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    mapRef.current = L.map(containerRef.current, { zoomControl: true, attributionControl: false }).setView(
      [KW_CENTER.lat, KW_CENTER.lng], 13,
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync markers when drops change
  useEffect(() => {
    if (!mapRef.current) return;
    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    drops.forEach((drop) => {
      const marker = createMarker(drop).addTo(mapRef.current!);
      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif;padding:4px 2px;min-width:140px">
          <p style="font-weight:800;font-size:13px;color:#064e3b;margin:0 0 2px">${drop.title}</p>
          <p style="font-size:11px;color:#64748b;margin:0 0 4px">${drop.donorName}</p>
          <p style="font-size:12px;font-weight:600;color:#1e293b;margin:0">${drop.quantity}</p>
        </div>
      `, { closeButton: false });
      marker.on('click', () => onSelectRef.current(drop));
      markersRef.current.push(marker);
    });
  }, [drops]);

  return (
    <div className="w-full h-full relative" ref={containerRef} />
  );
};
