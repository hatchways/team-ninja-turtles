import React, { useState, useEffect, useContext, useCallback } from 'react';
import io from 'socket.io-client';
import MessageSideNav from '../components/MessageSideNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../App';
import { getMsgLog } from '../apiCalls';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { makeStyles, Typography } from '@material-ui/core';

let socket = io.connect(null, {port:5000, rememberTransport: false});

export const SessionsContext = React.createContext()
export const CurrentSessionContext = React.createContext()

const useStyles = makeStyles((theme) => ({
    avatar: {
      width: '75px',
      height: '75px',
      borderRadius: '50%',
      padding: '10px'
    }, 
    chatTopBar: {
      backgroundColor: '#F6F6F9',
      alignItems: 'center'
    }
}))


function Socketio() {
  const [messageLog, setMessageLog] = useState([]);
  const [message, setMessage] = useState("");
  const {user, setUser} = useContext(UserContext)
  const [room, setRoom] = useState({session: -1, user: {}})
  const [sessions, setSessions] = useState([])
  const username = user.username
  const classes = useStyles()

  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true })
    }
  }, [])

  const addMessage = useCallback(({name, message, time}) => {
    console.log(messageLog)
    setMessageLog([...messageLog, {text:message, user:name, timestamp:time}])
  }, [messageLog])
  
  useEffect(() => {
    if (room.session >= 0) {
      socket.emit("join", room.session)
      getMsgLog(room.session, (data) => {
        console.log(data)
        setMessageLog(data)
      }, (error) => {
        console.log(error.body)
      })
    }
  }, [room])

  useEffect(() => {
    socket.on("message", addMessage)

    return () => {
      socket.off("message")
    }
  }, [addMessage]);

  // On Click
  const onClick = (e) => {
    e.preventDefault()

    if (message !== "") {
      const roomID = room.session
      socket.emit("message", {message, roomID ,username});
      setMessage("");
    }
  };

  return (
    <CurrentSessionContext.Provider value={{room, setRoom}}>
      <SessionsContext.Provider value={{sessions, setSessions}}>
        <div className="d-flex" style={{height: "90vh"}}>
          <MessageSideNav/> 

          <div className="d-flex flex-column flex-grow-1">
            <div className={`d-flex flex-row ${classes.chatTopBar}`}> 
                <img alt="avatar" 
                  src={room.user.icon ? room.user.icon : process.env.PUBLIC_URL + '/images/avatar-1.png'} 
                  className={classes.avatar}/>
                <Typography className={classes.chatTopBarName}>
                  {room.user.username}
                </Typography>
            </div>

            <div className="flex-grow-1 overflow-auto">
              <div className="d-flex flex-column align-items-start justify-content-end px-3">
                {messageLog.map((message, index) => {
                  const lastMessage = messageLog.length - 1 === index
                  const fromMe = message.user === user.username
                  return (
                    <div
                      ref={lastMessage ? setRef : null}
                      key={index}
                      className={`my-1 d-flex flex-column ${fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}
                    >
                      <div
                        className={`rounded px-2 py-1 ${fromMe ? 'bg-primary text-white' : 'border'}`}>
                        {message.text}
                      </div>
                      <div className={`text-muted small ${fromMe ? 'text-right' : ''}`}>
                        {message.fromMe ? 'You' : message.user}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <Form onSubmit={onClick}>
              <Form.Group className="m-2">
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    style={{ height: '75px', resize: 'none' }}
                  />
                  <InputGroup.Append>
                    <Button variant="secondary" type="submit">Send</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Form>
          </div>

        </div>
      </SessionsContext.Provider>
    </CurrentSessionContext.Provider>
  );
};

export default Socketio;