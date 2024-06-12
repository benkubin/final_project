'use client'
import * as React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import {v4 as uuidv4} from "uuid";


// Imports the mapbox-gl styles so that the map is displayed correctly
type MapboxMapProps = {};
type MapboxMapRef = mapboxgl.Map | null;

// Main source of information for this code was Mapbox MapGL JS docs
const MapboxMap = React.forwardRef<MapboxMapRef, MapboxMapProps>((props, ref) => {
    // Stores map instance after initialization
    const [map, setMap] = React.useState<mapboxgl.Map>();
    // Stores reference to map to be forwarded to page.tsx
    const mapRef = React.useRef(null);

    // Opens form by setting CSS attribute
    const openForm = () => {
        // @ts-ignore
        document.getElementById("newcat-popup").style.display = "flex";
    }

    // Closes form by setting CSS attribute
    const closeForm = () => {
        // @ts-ignore
        document.getElementById("newcat-popup").style.display = "none";
    }

    // The first of a few scary exposed private keys... struggled with this but at least I know it's bad practice
    AWS.config.update({
        region: "us-west-2",
        accessKeyId: 'AKIASCJOCPOJKXRMX4HG',
        secretAccessKey: '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',
    })

    // Initializes new documentclient for DynamoDB
    const ddb = new AWS.DynamoDB.DocumentClient();

    // Function to fetch all items from DynamoDB to add to map
    const fetchAllItems = async () => {
        const params = {
            TableName: "snapacat-posts"
        };

        // @ts-ignore
        let items = [];
        let data;

        // While there is data in database, continue to scan (similar to query) to return items and
        // add to data array
        do {
            data = await ddb.scan(params).promise();
            // @ts-ignore
            items = items.concat(data.Items);
            // @ts-ignore
            params.ExclusiveStartKey = data.LastEvaluatedKey;
        } while (typeof data.LastEvaluatedKey !== "undefined");

        return items;
    };

    // Function to add markers to the map
    // @ts-ignore
    const addMarkersToMap = (map, items) => {
        // For each item in items (database data), adds a marker to the map
        // @ts-ignore
        items.forEach(item => {
            const lng = parseFloat(item.lng);
            const lat = parseFloat(item.lat);
            const name = item.catName;
            const post = item.postContent;
            const imageURL = item.imageURL;

            const marker = new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup({offset: 25})
                    .setHTML(`<h3>${name}</h3>
                          <img src=${imageURL} alt="a beautiful kitty">
                          <p>${post}</p>`))
                .addTo(map);
        });
    };


    // The React DOM will render this component and carry out functions upon loading
    React.useEffect(() => {
        const node = mapRef.current;
        // Checks if map exists
        if (typeof window === "undefined" || node === null) return;

        // If map is not already found, this creates a new map instance
        // Map is centered on Seattle and styled with a Mapbox Studio style I created
        const mapboxMap = new mapboxgl.Map({
            container: node, // I understand that hard-keying access keys like this can be dangerous, but struggled with my process.env files.
            accessToken: "pk.eyJ1IjoiYnhrdWJpbiIsImEiOiJjbHdmcGpwNWwwMnB1MnJvN20wNWoxcXJ4In0.n7Cr1xiFCZKL1WGyZhuBjQ",
            style: "mapbox://styles/bxkubin/clwfpnrl400b301pp23d51ot4",
            center: [-122.358289, 47.606787],
            zoom: 12,
        });

        // Saves the map object to React.useState
        setMap(mapboxMap);

        // Ensures that map is loaded and then calls fetchAllItems function
        // Also calls addMarkersToMap with active map and items params
        mapboxMap.on('load', () => {
            fetchAllItems().then(items => {
                addMarkersToMap(mapboxMap, items);
            });
        });

        if (typeof ref === 'function') {
            ref(mapboxMap);
        } else if (ref && 'current' in ref) {
            ref.current = mapboxMap;
        }

        return () => {
            mapboxMap.remove();
        };

    }, []);

    // Stores form variable for conditional check below
    const form = typeof document !== 'undefined' ? document.getElementById('newcat-form') : null;

    // Adds an event listener to the form and prevents automatic submission if exists
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Function to add markers to the map
            const addMarker = () => {
                // Check if map is available before adding marker
                if (map) {
                    // Uses native JS navigator library to get user's current location
                    navigator.geolocation.getCurrentPosition((position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;

                        // Function that gets the name of the cat when the form is submitted
                        const getFormName = () => {
                            const element = document.getElementById('newcat-form');
                            if (element) {
                                // @ts-ignore
                                return element.elements['form-name'].value;
                            }
                            return "";
                        }

                        // Function that gets the post content from the form when submitted
                        const getFormPost = () => {
                            const element = document.getElementById('newcat-form');
                            if (element) {
                                // @ts-ignore
                                return element.elements['form-post'].value;
                            }
                            return "";
                        }

                        // Stores values of name, post, and image URL by calling functions
                        const nameValue = getFormName();
                        const postValue = getFormPost();
                        const imageURL = getImageURL();
                        // Creates unique id for each image
                        const postUUID = uuidv4();

                        // This function returns a uuid that is only numbers (specified by DynamoDB PK)
                        function removeDashes(inputUUID: string) {
                            return inputUUID.replace(/\D/g, '');
                        }

                        // Removes all non-numeric characters from id
                        const imageId = removeDashes(postUUID);
                        console.log(imageId);

                        // DynamoDB params to put each cat item to database
                        AWS.config.update({
                            region: "us-west-2",
                            accessKeyId: 'AKIASCJOCPOJKXRMX4HG',
                            secretAccessKey: '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',
                        })
                        const ddb = new AWS.DynamoDB({apiVersion: "2012-08-10"});
                        const params = {
                            TableName: "snapacat-posts", Item: {
                                postId: {N: `${imageId.toString()}`},
                                catName: {S: `${nameValue}`},
                                imageURL: {S: `${imageURL}`},
                                postContent: {S: `${postValue}`},
                                lat: {N: `${lat.toString()}`},
                                lng: {N: `${lng.toString()}`},
                            },
                        };

                        // @ts-ignore
                        ddb.putItem(params, function (err, data) {
                            if (err) {
                                console.log("Error", err);
                            } else {
                                console.log("Success", data);
                            }
                        });

                    }, (error) => {
                        console.error("Geolocation error:", error);
                    });
                } else {
                    // Sends console message if the map has not been fully loaded yet
                    console.warn("Map not ready yet. Marker placement delayed.")
                }
            };

            // Adds an event listener to add markers when button is clicked
            const button = document.getElementById('post-newcat');
            if (button) {
                button.addEventListener('click', addMarker);
            }

        })
    }


    // Function that appends the filename to the main URL of my S3 bin
    const getImageURL = () => {
        const baseURL = "https://marss-storage.s3.us-west-2.amazonaws.com/";
        return baseURL.concat(filename);
    }

    // AWS File Upload Code Source:
    // https://dev.to/aws-builders/how-to-upload-files-to-amazon-s3-with-react-and-aws-sdk-b0n
    // & https://docs.aws.amazon.com
    //
    // Had to tailor to this specific use case, was able to learn quite a bit about how to use S3 in projects!

    // Declares variables using useState to ensure they can be accessed from other parts of the code
    const [file, setFile] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const [filename, setFilename] = React.useState<string>("");

    // Sets allowed types for the file upload
    const allowedTypes = ['image/jpeg', 'image/png']

    // Function that takes a change event (onChange in normal JS) and sets the file up for uploading
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Selects first file in array at index 0 of the event (form file element)
        const selectedFile = event.target.files?.[0];
        // If the selected file exists and the type is allowed, file can be set.
        if (selectedFile && allowedTypes.includes(selectedFile.type)) {
            // @ts-ignore
            setFile(selectedFile);
        } else {
            // Else, alert is sent to the user
            alert('Invalid file type. Only images are allowed.');
        }
    };

    // Async function that uploads the file to the AWS S3 bucket
    const uploadFile = async () => {
        setUploading(true);
        // Declares parameter variables for correct bucket and resource region
        const S3_BUCKET = 'marss-storage';
        const REGION = 'us-west-2';

        // Again, not best practice but I struggled with this part a little bit.
        AWS.config.update({
            accessKeyId: 'AKIASCJOCPOJKXRMX4HG', secretAccessKey: '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',
        })

        // Creates new S3 instance
        const s3 = new S3({
            params: {Bucket: S3_BUCKET}, region: REGION,
        });

        // Declares parameters for file to be uploaded
        const params = {
            Bucket: S3_BUCKET, // @ts-ignore
            Key: file.name, Body: file,
        }

        // Exception handling block that awaits the async promise before putting the object to S3 bucket
        try {
            // @ts-ignore
            const upload = await s3.putObject(params).promise();
            // Sets filename variable to be passed into function below, which allows the filepath to be returned
            // for displaying the image
            const filename = params.Key;
            setFilename(filename);
            console.log(upload);
            setUploading(false)
            // Helpful alert to check if file upload is working or not!
            // alert('File uploaded successfully.');
        } catch (error) {
            // Throws error to console and sends alert to browser if file upload fails
            console.error(error);
            setUploading(false)
            // @ts-ignore
            alert('Error uploading file: ' + error.message);
        }

    };


    // Returns all HTML elements
    return <div>
        <button id={"new-cat"} onClick={openForm}>+</button>
        <div id={"newcat-popup"}>
            <form id={"newcat-form"} encType={"multipart/form-data"} onSubmit={closeForm}>
                <div id={"form-top-bar"}>
                    <h2>Add a cat!</h2>
                    <button type={"button"} className={"exit-newcat-button"} onClick={closeForm}>X</button>

                </div>
                <label htmlFor={"photo-uploads"}>Upload Photo:</label>
                <input type={"file"} id={"cat-uploads"} name={"photo-uploads"} accept={"image/*"}
                       onChange={handleFileChange}/>
                <button onClick={uploadFile} id={"file-uploader"}>{uploading ? 'Uploading...' : 'Upload File'}</button>
                <br/>
                <label htmlFor={"name"}>Name:</label>
                <input name={"name"} id={"form-name"} type={"text"} placeholder={"Make one up if you don't know!"}
                       required={true}/>
                <label htmlFor={"post"}>Post:</label>
                <input name={"post"} id={"form-post"} type={"text"} placeholder={"..."} required={true}/>
                <button type={"submit"} className={"submit-newcat"} id={"post-newcat"}>Post</button>
            </form>
        </div>
        <div id={"map"} ref={mapRef}/>

    </div>;
});

// Exports the component for rendering on the page.tsx main page
export default MapboxMap