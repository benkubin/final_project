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

    const openForm = () => {
        // @ts-ignore
        document.getElementById("newcat-popup").style.display = "block";
    }

    const closeForm = () => {
        // @ts-ignore
        document.getElementById("newcat-popup").style.display = "none";
    }

    const addMarker = () => {

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;



        if (mapRef.current) {
            const name = document.getElementById("form-name");
            const post = document.getElementById("form-post");
            const marker = new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 })
                        .setHTML(
                            `<h3>${name}</h3><p>${post}</p>`
                        )
                )
                .addTo(mapRef.current);
        }
        })
    };

    return (<>
            <button id={"new-cat"} onClick={openForm}>+</button>
            <div id={"newcat-popup"}>
                <form id={"newcat-form"} encType={"multipart/form-data"} onSubmit={addMarker}>
                    <button type={"button"} className={"exit-newcat-button"} onClick={closeForm}>X</button>
                    <h2>Add a cat!</h2>
                    <label htmlFor={"photo-uploads"}>Upload Photo</label>
                    <input type={"file"} id={"cat-uploads"} name={"photo-uploads"} accept={"image/*"} required={true}/>
                    <label htmlFor={"name"}>Name</label>
                    <input name={"name"} id={"form-name"} type={"text"} placeholder={"Make one up if you don't know!"}
                           required={true}/>
                    <label htmlFor={"post"}>Post</label>
                    <input name={"post"} id={"form-post"} type={"text"} placeholder={"..."} required={true}/>
                    <button type={"submit"} className={"submit-newcat"}>Post</button>
                </form>
            </div>
            <MapboxMap ref={mapRef}/>
        </>
    );
}
