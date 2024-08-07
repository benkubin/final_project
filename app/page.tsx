'use client'

import * as React from "react";
import MapboxMap from "@/app/components/mapbox-map";
import mapboxgl from "mapbox-gl";
import PostForm from "@/app/components/new-post";

export default function Home() {
    // Defines mapRef as the current map element
    const mapRef = React.useRef<mapboxgl.Map | null>(null);


    return (<>
            <PostForm/>
            <MapboxMap ref={mapRef}/>
        </>
    );
}
