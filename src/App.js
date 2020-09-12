import React, { useState, useEffect } from 'react';
import logo from './logo.png'

import Post from './Post'
import ImageUpload from './imageUpload'

import { db, auth } from './firebase'
import { makeStyles } from '@material-ui/core/styles'
//import  from '@material-ui/core/Modal'
import { Button, Modal, Input } from '@material-ui/core'
import InstagramEmbed from 'react-instagram-embed'

const userContext = React.createContext(null)

function App() {

  const [posts, setPosts] = useState([])
  const [modalStyle] = React.useState(getModalStyle)
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [upload, setUpload] = useState(false)


  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: 'none',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      borderRadius: '15px',
      outline: 'none'
    },
  }))

  function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const perPost = posts.map(({id, post}) => {
    return <Post key={ id } postId={ id } username={ post.username } caption={ post.caption } imageUrl={ post.imageUrl } />
  })

  useEffect(() => {
     db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
        let temp = snapshot.docs.map(item => ({ id:item.id, post: item.data() }))
        setPosts(temp)
     })

  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // console.log(authUser)
        setUser(authUser)

      } else {
        setUser(null)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [user, username])

  const signUp = event => {
    setOpen(true)
  }

  const handleLogin = (event) => {
    event.preventDefault()
    setOpen(true)
    auth
    .createUserWithEmailAndPassword(email, password)
    .then(authUser => {
      return authUser.user.updateProfile({ displayName: username })
    })
    .catch(error => alert(error.message))
    setOpen(false)
  }



  const signIn = (event) => {
    event.preventDefault()
    setOpenSignIn(true)

    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        alert(error.message)
        setOpenSignIn(true)
        setPassword('')
      })
    
    setOpenSignIn(false)


  }

const uploadPost = () => {
  setUpload(true)
}

const logout = () => {
  auth.signOut()
  setPassword('')
}

  console.log(user)

  return (
    <userContext.Provider value={ {user, setOpenSignIn} }>
      <div>
        <Modal
          open={upload}
          onClose={() => setUpload(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
              <center>
              { user ? <ImageUpload username={ user.displayName } /> : <h3>You need to Login to upload image</h3> }
              </center>
            </form>
          </div>
        </Modal>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
              <center>
                <img src={ logo } className="app_headerImg" />
                <Input placeholder="Username" type="text" value={ username } onChange={ event => setUsername(event.target.value) } />
                <Input placeholder="Email" type="text" value={ email } onChange={ event => setEmail(event.target.value) } />
                <Input placeholder="Password" type="password" value={ password } onChange={ (event) => setPassword(event.target.value) } />
                <Button type="submit" onClick={ handleLogin }>Login</Button>
              </center>
            </form>
          </div>
        </Modal>
        <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
              <center>
                <img src={ logo } className="app_headerImg" />
                {/* <Input placeholder="Username" type="text" value={ username } onChange={ event => setUsername(event.target.value) } /> */}
                <Input placeholder="Email" type="text" value={ email } onChange={ event => setEmail(event.target.value) } />
                <Input placeholder="Password" type="password" value={ password } onChange={ (event) => setPassword(event.target.value) } />
                <Button type="submit" onClick={ signIn }>Sign In</Button>
              </center>
            </form>
          </div>
        </Modal>
        <div className="app_header">
          <img className="app_headerImg" src={ logo } />
          { user ? (<div className="app__loginContainer">
            <Button onClick={ uploadPost }>Upload</Button>
            <Button onClick={ logout }>Logout</Button>
          </div>
        ) : 
          
        (
        <div className="app__loginContainer">
          <Button onClick={ () => setOpenSignIn(true) }>Sign In</Button>
          <Button onClick={ signUp }>Sign Up</Button>
        </div>
        )}
        </div>
        
        <div className="app__posts">
          <div className="app__postsLeft">
          { perPost }
          </div>
          <div className="app__postsRight">
          <InstagramEmbed 
            url='https://www.instagram.com/p/CD4AxFugGGM/' 
            maxWidth={ 320 }
            hideCaption={ false }
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
        />
        <InstagramEmbed 
            url='https://www.instagram.com/p/CEZSGP-A8nN/' 
            maxWidth={ 320 }
            hideCaption={ false }
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
        />
          </div>
        </div>
        
      </div>
    </userContext.Provider>
  );
}

export { App, userContext }
