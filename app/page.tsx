'use client'

import * as React from "react";
import MapboxMap from "@/app/components/mapbox-map";
import mapboxgl from "mapbox-gl";
import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3'



// SOURCE: https://www.freecodecamp.org/news/simplify-your-file-upload-process-in-express-js/


export default function Home() {
    const mapRef = React.useRef<mapboxgl.Map | null>(null);



    return (<>
            <MapboxMap ref={mapRef}/>
        </>
    );
}
