import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import "leaflet/dist/leaflet.css";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const TILES = {
  dark: { url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", label: "Dark" },
  satellite: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", label: "Satellite" },
};

const MapPage = () => {
  const { user } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const [tileKey, setTileKey] = useState<keyof typeof TILES>("dark");

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then(async (L) => {
      const map = L.map(mapRef.current!, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: false,
      });

      tileLayerRef.current = L.tileLayer(TILES[tileKey].url, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Fetch user colorizations with coordinates
      if (user) {
        const { data } = await supabase
          .from("colorizations")
          .select("name, status, lat, lng")
          .not("lat", "is", null)
          .not("lng", "is", null);

        (data ?? []).forEach((loc: any) => {
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
      }

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [user]);

  // Switch tile layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    import("leaflet").then((L) => {
      tileLayerRef.current.remove();
      tileLayerRef.current = L.tileLayer(TILES[tileKey].url, {
        attribution: '&copy; OSM',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    });
  }, [tileKey]);

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.04em]">Map View</h1>
          <p className="text-sm text-muted-foreground mt-1">Your colorized regions on the map</p>
        </div>
        <div className="flex rounded-lg border border-border/40 overflow-hidden">
          {(Object.keys(TILES) as (keyof typeof TILES)[]).map((key) => (
            <button
              key={key}
              onClick={() => setTileKey(key)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${tileKey === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {TILES[key].label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
        className="glass-elevated rounded-2xl overflow-hidden"
      >
        <div ref={mapRef} className="w-full h-[500px] sm:h-[600px]" />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3, ease }} className="flex items-center gap-6 mt-4">
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
