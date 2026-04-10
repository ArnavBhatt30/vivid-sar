import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const locations = [
  { name: "Mumbai Coastal", lat: 19.076, lng: 72.8777, status: "Complete" },
  { name: "Delhi Urban", lat: 28.6139, lng: 77.209, status: "Complete" },
  { name: "Goa Shoreline", lat: 15.2993, lng: 74.124, status: "Processing" },
  { name: "Jaipur Desert", lat: 26.9124, lng: 75.7873, status: "Complete" },
  { name: "Bangalore Metro", lat: 12.9716, lng: 77.5946, status: "Complete" },
];

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = L.map(mapRef.current!, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      locations.forEach((loc) => {
        const color = loc.status === "Complete" ? "#3b82f6" : "#f59e0b";
        L.circleMarker([loc.lat, loc.lng], {
          radius: 8,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.3,
        })
          .addTo(map)
          .bindPopup(`<div style="font-family:Inter,sans-serif;font-size:12px"><strong>${loc.name}</strong><br/><span style="color:${color}">${loc.status}</span></div>`);
      });

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.04em]">Map View</h1>
        <p className="text-sm text-muted-foreground mt-1">Colorized regions across the globe</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
        className="glass-elevated rounded-2xl overflow-hidden"
      >
        <div ref={mapRef} className="w-full h-[500px] sm:h-[600px]" />
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease }}
        className="flex items-center gap-6 mt-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="text-xs text-muted-foreground">Processing</span>
        </div>
      </motion.div>
    </div>
  );
};

export default MapPage;
