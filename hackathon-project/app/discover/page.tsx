"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import MapSearchBar from "@/components/map/MapSearchBar";

const WorldMap = dynamic(() => import("@/components/map/WorldMap"), { ssr: false });

export default function DiscoverPage() {
  const [flyToCoords, setFlyToCoords] = useState<[number, number] | undefined>();

  return (
    <div className="relative w-full h-[calc(100vh-56px)]">
      <WorldMap flyToCoords={flyToCoords} />
      <MapSearchBar onRegionFound={setFlyToCoords} />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-xs text-gray-400 pointer-events-none">
        Click any pin to discover music from that region
      </div>
    </div>
  );
}
