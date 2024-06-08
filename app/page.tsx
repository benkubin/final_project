'use client'

import * as React from "react";
import MapboxMap from "@/app/components/mapbox-map";
import mapboxgl from "mapbox-gl";



// SOURCE: https://www.freecodecamp.org/news/simplify-your-file-upload-process-in-express-js/


export default function Home() {
    const mapRef = React.useRef<mapboxgl.Map | null>(null);

    const getLocation = () => {
       return new Promise<[number, number]>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve([longitude, latitude]);
        }, reject);
        });
    }





    // YOU MADE IT BACK!!



    return (<>
            <MapboxMap ref={mapRef}/>
        </>
    );
}
