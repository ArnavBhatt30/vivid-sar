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

type Loc = { id: string; name: string; status: string; lat: number; lng: number };

const MapPage = () => {
  const { user } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const LRef = useRef<any>(null);
  const [tileKey, setTileKey] = useState<keyof typeof TILES>("dark");

  const addMarker = (L: any, map: any, loc: Loc) => {
    if (markersRef.current.has(loc.id)) return;
    const color = loc.status === "Complete" ? "#3b82f6" : "#f59e0b";
    const marker = L.circleMarker([loc.lat, loc.lng], {
      radius: 8,
      fillColor: color,
      color,
      weight: 2,
      opacity: 0.85,
      fillOpacity: 0.35,
    })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:Inter,sans-serif;font-size:12px"><strong>${loc.name}</strong><br/><span style="color:${color}">${loc.status}</span></div>`,
      );
    markersRef.current.set(loc.id, marker);
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then(async (L) => {
      LRef.current = L;
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
      mapInstanceRef.current = map;

      if (user) {
        const { data } = await supabase
          .from("colorizations")
          .select("id, name, status, lat, lng")
          .not("lat", "is", null)
          .not("lng", "is", null);

        (data ?? []).forEach((loc: any) => addMarker(L, map, loc as Loc));
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current.clear();
      }
    };
  }, [user]);

  // Realtime: new colorizations -> drop a marker live
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("colorizations-map")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "colorizations", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const row = payload.new as any;
          if (row.lat == null || row.lng == null) return;
          const map = mapInstanceRef.current;
          const L = LRef.current;
          if (!map || !L) return;
          addMarker(L, map, { id: row.id, name: row.name, status: row.status, lat: row.lat, lng: row.lng });
          map.flyTo([row.lat, row.lng], Math.max(map.getZoom(), 8), { duration: 1.2 });
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

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
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[-0.04em]">Map View</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Your colorized regions, updated live</p>
        </div>
        <div className="flex rounded-lg border border-border/40 overflow-hidden self-start">
          {(Object.keys(TILES) as (keyof typeof TILES)[]).map((key) => (
            <button
              key={key}
              onClick={() => setTileKey(key)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium transition-colors ${tileKey === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
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
        className="glass-elevated rounded-xl sm:rounded-2xl overflow-hidden"
      >
        <div ref={mapRef} className="w-full h-[350px] sm:h-[500px] md:h-[600px]" />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3, ease }} className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary" />
          <span className="text-[10px] sm:text-xs text-muted-foreground">Complete</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400" />
          <span className="text-[10px] sm:text-xs text-muted-foreground">Processing</span>
        </div>
      </motion.div>
    </div>
  );
};

export default MapPage;
