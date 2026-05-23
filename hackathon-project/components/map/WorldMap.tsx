"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { REGIONS } from "@/lib/regions";
import { Region } from "@/types/regions";
import RegionPopup from "./RegionPopup";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Props = {
  onRegionSelect?: (region: Region) => void;
  flyToCoords?: [number, number];
};

export default function WorldMap({ onRegionSelect, flyToCoords }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [popupCoords, setPopupCoords] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 20],
      zoom: 1.8,
      minZoom: 1,
      maxZoom: 12,
      projection: { name: "mercator" },
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;

    map.on("load", () => {
      REGIONS.forEach((region) => {
        // Outer wrapper — Mapbox writes its positioning transform here
        const el = document.createElement("div");
        el.style.cssText = "width:18px;height:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;";

        // Inner dot — we animate this independently so Mapbox's transform is never overwritten
        const dot = document.createElement("div");
        dot.style.cssText = `
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${region.pinColor};
          border: 2px solid rgba(255,255,255,0.6);
          box-shadow: 0 0 8px ${region.pinColor}88;
          transition: transform 0.15s, box-shadow 0.15s;
        `;
        el.appendChild(dot);

        el.addEventListener("mouseenter", () => {
          dot.style.transform = "scale(1.6)";
          dot.style.boxShadow = `0 0 16px ${region.pinColor}cc`;
        });
        el.addEventListener("mouseleave", () => {
          dot.style.transform = "scale(1)";
          dot.style.boxShadow = `0 0 8px ${region.pinColor}88`;
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(region.coords)
          .addTo(map);

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          const rect = el.getBoundingClientRect();
          setPopupCoords({ x: rect.left + rect.width / 2, y: rect.top });
          setSelectedRegion(region);
          onRegionSelect?.(region);
          map.flyTo({ center: region.coords, zoom: Math.max(map.getZoom(), 4), duration: 800 });
        });

        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (flyToCoords && mapRef.current) {
      mapRef.current.flyTo({ center: flyToCoords, zoom: 5, duration: 1200 });
    }
  }, [flyToCoords]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {selectedRegion && (
        <RegionPopup
          region={selectedRegion}
          onClose={() => setSelectedRegion(null)}
        />
      )}
    </div>
  );
}
