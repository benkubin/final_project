'use client'

import * as React from "react";
// navigation import
import MapboxMap from "@/app/components/mapbox-map";
import mapboxgl from "mapbox-gl";
import axios from "axios";


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

    const newCat = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let name: HTMLElement | null = document.getElementById("form-name") as HTMLInputElement;
        let post: HTMLElement | null = document.getElementById("form-post") as HTMLInputElement;
        let image = (document.getElementById("cat-uploads") as HTMLInputElement).files?.[0];
        let coordinates = await getLocation();


        const formData = new FormData();
        formData.append("file", image);
        formData.append("name", name.value);
        formData.append("post", post.value);
        formData.append("coordinates", JSON.stringify(coordinates));

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("File uploaded successfully:", response.data);
            addCat(name.value, post.value, response.data.filePath, coordinates);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }


    const addCat = (name: string, image: string, coordinates: [number, number]) => {
        geojson.features.push({
            'type': 'Feature', 'properties': {
                'message': name, 'imageId': image, 'iconSize': [60, 60]
            }, 'geometry': {
                'type': 'Point', 'coordinates': [coordinates]
            }
        })
    }

    let geojson = {
        'type': 'FeatureCollection', 'features': [{
            'type': 'Feature', 'properties': {
                'message': 'TEST', 'imageId': 1011, 'iconSize': [60, 60]
            }, 'geometry': {
                'type': 'Point', 'coordinates': [-122.32980, 47.62038] as [number, number]
            }
        }, {
            'type': 'Feature', 'properties': {
                'message': 'TEST2', 'imageId': 2, 'iconSize': [60, 60]
            }, 'geometry': {
                'type': 'Point', 'coordinates': [-61.21582, -15.971891] as [number, number]
            }
        }]
    };

    const openForm = () => {
        // @ts-ignore
        document.getElementById("newcat-popup").style.display = "block";
    }

    const closeForm = () => {
        // @ts-ignore
        document.getElementById("newcat-popup").style.display = "none";
    }

    React.useEffect(() => {
        if (mapRef.current) {
            console.log("Map is initialized", mapRef.current)
            for (const marker of geojson.features) {
                const el = document.createElement('div');
                const width = marker.properties.iconSize[0];
                const height = marker.properties.iconSize[1];
                el.className = 'marker';
                el.style.backgroundImage = `url(https://picsum.photos/id/${marker.properties.imageId}/${width}/${height})`;
                el.style.width = `${width}px`;
                el.style.height = `${height}px`;
                el.style.backgroundSize = '100%';

                el.addEventListener('click', () => {
                    window.alert(marker.properties.message);
                });

                console.log("Adding marker at coordinates ", marker.geometry.coordinates)
                // Add markers to the map.
                new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .addTo(mapRef.current);
            }
        }
    }, [mapRef.current]);

    return (<>
            <button id={"new-cat"} onClick={openForm}>+</button>
            <div id={"newcat-popup"}>
                <form id={"newcat-form"} encType={"multipart/form-data"} onSubmit={newCat}>
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
