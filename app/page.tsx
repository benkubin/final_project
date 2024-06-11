'use client'

import * as React from "react";
import MapboxMap from "@/app/components/mapbox-map";
import mapboxgl from "mapbox-gl";

export default function Home() {
    // Defines mapRef as the current map element
    const mapRef = React.useRef<mapboxgl.Map | null>(null);


    return (<>
            <MapboxMap ref={mapRef}/>
        </>
    );
}
