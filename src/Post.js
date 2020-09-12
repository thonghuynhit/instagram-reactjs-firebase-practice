import React from 'react'
import { userContext } from './App'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from './firebase'
import send from './send.png'
import firebase from 'firebase'

function Post({ username, caption, imageUrl, postId }) {

    const [comment, setComment] = React.useState([])
    const [comm, setComm] = React.useState('')

    const userIs = React.useContext(userContext)

    React.useEffect(() => {
        let unsubscribe
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comment")
                .orderBy("timestamp", "desc")
                .onSnapshot(snapshot => {
                    let temp = snapshot.docs.map(item => {
                        return item.data()
                    })
                    setComment(temp)
                    console.log(temp)

                })
            
        return () => {
            unsubscribe()
        }
        }
    },[postId])

    const postComment = event => {
        event.preventDefault()
        if (!userIs.user) {
            console.log(userIs.setOpenSignIn(true))
        } else {
            db
            .collection('posts')
            .doc(postId)
            .collection("comment")
            .add({
                text: comm,
                username: userIs.user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                setComm('')
            })
        }

    }
    return (
        <div className="post">
            <div className="post_header">
                <Avatar className="post_avatar" src="https://www.ryadel.com/wp-content/uploads/2019/06/react-native-logo.png" />
                <h3>{ username }</h3>
            </div>
            <img className="post_img" src={ imageUrl } />
            <h4 className="post_text">
                 <strong>{ username } </strong> 
                 { caption }
            </h4>
            <div className="comments">
                {
                    comment.map((item, index) => (
                        <h4 key={ index } style={{ fontWeight: 'normal' }}>
                            <strong>{ item.username } </strong> 
                            { item.text }
                        </h4>
                    ))
                }
            </div>
            <form>
                <input className="post__input" placeholder="Add a comment..." value={ comm } onChange={ event => setComm(event.target.value) } />
                <button className="post__button" onClick={ postComment } disabled={ !comm } type="submit">
                    <img src={ send } alt="" />
                </button>
            </form>
        </div>
    )
}
export default Post