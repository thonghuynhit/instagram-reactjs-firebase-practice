import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import { storage, db,  } from './firebase'
import firebase from 'firebase'

import "./imageUpload.css"


function ImageUpload({ username }) {
    const [image, setImage] = useState(null)
    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    
    const handleChange = event => {
        if (event.target.files[0]) {
            setImage(event.target.files[0])
            console.log(event.target.files[0])
        }
    }
    const handleUpload = () => {
        const upTask = storage.ref(`images/${ image.name }`).put(image)
        upTask
            .on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setProgress(progress)
                }, 
                error => {
                    console.log(error)
                    alert(error.message)
                },
                () => {
                    storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            db.collection("posts").add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                caption: caption,
                                imageUrl: url,
                                username: username,
                            })
                        })
                }
            )
            if (parseInt(progress) >= 100) {
                setProgress(0)
            }
    } 

    return (
        <div className="imageUpload">
            <h2>Upload Post</h2>
            <progress value={ progress } max="100" />
            <textarea type="text" placeholder="Enter a caption..." value={ caption } onChange={ event => setCaption(event.target.value) } />
            <input type="file" onChange={ handleChange } />
            <Button onClick={ handleUpload }>
                Upload
            </Button>
        </div>
    )
}
export default ImageUpload
