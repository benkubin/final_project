'use client'
import * as React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import the mapbox-gl styles so that the map is displayed correctly

type MapboxMapProps = {};
type MapboxMapRef = mapboxgl.Map |null;

const MapboxMap = React.forwardRef<MapboxMapRef, MapboxMapProps>((props, ref) => {
    // this is where the map instance will be stored after initialization
    const [map, setMap] = React.useState<mapboxgl.Map>();

    // React ref to store a reference to the DOM node that will be used
    // as a required parameter `container` when initializing the mapbox-gl
    // will contain `null` by default
    const mapNode = React.useRef(null);

    React.useEffect(() => {
        const node = mapNode.current;
        // if the window object is not found, that means
        // the component is rendered on the server
        // or the dom node is not initialized, then return early
        if (typeof window === "undefined" || node === null) return;

        // otherwise, create a map instance
        const mapboxMap = new mapboxgl.Map({
            container: node,
            accessToken: "pk.eyJ1IjoiYnhrdWJpbiIsImEiOiJjbHdmcGpwNWwwMnB1MnJvN20wNWoxcXJ4In0.n7Cr1xiFCZKL1WGyZhuBjQ",
            style: "mapbox://styles/bxkubin/clwfpnrl400b301pp23d51ot4",
            center: [-122.358289, 47.606787],
            zoom: 12,
        });

        // save the map object to React.useState
        setMap(mapboxMap);

        if (typeof ref === 'function') {
            ref(mapboxMap);
        } else if (ref && 'current' in ref) {
            ref.current = mapboxMap;
        }

        return () => {
            mapboxMap.remove();
        };
    }, []);

    return <div ref={mapNode} style={{ width: "100%", height: "100%" }} />;
});

export default MapboxMap