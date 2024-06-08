'use client'
import * as React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import the mapbox-gl styles so that the map is displayed correctly

type MapboxMapProps = {};
type MapboxMapRef = mapboxgl.Map | null;

const MapboxMap = React.forwardRef<MapboxMapRef, MapboxMapProps>((props, ref) => {
    // this is where the map instance will be stored after initialization
    const [map, setMap] = React.useState<mapboxgl.Map>();

    // React ref to store a reference to the DOM node that will be used
    // as a required parameter `container` when initializing the mapbox-gl
    // will contain `null` by default
    const mapRef = React.useRef(null);


    const openForm = () => {
        // @ts-ignore
        document.getElementById("newcat-popup").style.display = "block";
    }

    const closeForm = () => {
        // @ts-ignore
        document.getElementById("newcat-popup").style.display = "none";
    }


    React.useEffect(() => {
        const node = mapRef.current;
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

    const form = typeof document !== 'undefined' ? document.getElementById('newcat-form') : null;
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const addMarker = () => {
                // Check if map is available before adding marker
                if (map) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        const marker = new mapboxgl.Marker()
                            .setLngLat([lng, lat])
                            .addTo(map as mapboxgl.Map); // Use map from useState
                    }, (error) => {
                        console.error("Geolocation error:", error);
                    });
                } else {
                    console.warn("Map not ready yet. Marker placement delayed.")
                }
            };

            const button = document.getElementById('post-newcat');
            if (button) {
                button.addEventListener('click', addMarker);
            }

        })
    }
    return (<div>
        <button id={"new-cat"} onClick={openForm}>+</button>
        <div id={"newcat-popup"}>
            <form id={"newcat-form"} encType={"multipart/form-data"}>
                <button type={"button"} className={"exit-newcat-button"} onClick={closeForm}>X</button>
                <h2>Add a cat!</h2>
                <label htmlFor={"photo-uploads"}>Upload Photo</label>
                <input type={"file"} id={"cat-uploads"} name={"photo-uploads"} accept={"image/*"}/>
                <label htmlFor={"name"}>Name</label>
                <input name={"name"} id={"form-name"} type={"text"} placeholder={"Make one up if you don't know!"}
                       required={true}/>
                <label htmlFor={"post"}>Post</label>
                <input name={"post"} id={"form-post"} type={"text"} placeholder={"..."} required={true}/>
                <button type={"submit"} className={"submit-newcat"} id={"post-newcat"}>Post</button>
            </form>
        </div>
        <div ref={mapRef} style={{width: '100vw', height: '100vh'}}/>
    </div>);
});

export default MapboxMap