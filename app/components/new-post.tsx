'use client'
import * as React from "react";

const PostForm = () => {
    return (
        <div className={"post-form"}>
            <div className={"post-form-content"}>
                <div className={"post-form-header"}>
                    <button className={"post-form-exit-btn"}>exit</button>
                    <h2>add a cat</h2>
                </div>
                <div className={"image-preview"}>

                </div>
                <div className={"file-upload"}>
                    <input type={"file"} id={"selected-file"} name={"image-uploader"} accept={"image/*"} style={{display: "none"}}/>
                    <input type={"button"} id={"file-picker"} value={"choose file"} onClick={() => document.getElementById('selected-file')?.click()}></input>
                    <button id={"delete-file"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="12" fill="#784E7A" fillOpacity="0.75"/>
                            <line x1="15.7767" y1="7.32927" x2="7.90085" y2="16.3293" stroke="white"/>
                            <line x1="7.32927" y1="7.74831" x2="16.3293" y2="15.6242" stroke="white"/>
                        </svg>
                    </button>
                    <button id={"file-uploader"}>upload</button>

                </div>
                <div className={"post-content"}>
                    <label htmlFor={"post"}>@USERNAME</label>
                    <input name={"post"} id={"post"} type={"text"} placeholder={"..."} required={true}/>
                    {/*<h5 id={"char-limit"}>Remaining characters:</h5>*/}
                </div>
                    <hr style={{width: '90%', position: 'absolute', bottom: '2.125rem'}}/>
                    <button className={"post-btn"}>post</button>
            </div>
        </div>
    )
}

export default PostForm