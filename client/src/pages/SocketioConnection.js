import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
let endPoint = "http://127.0.0.1:5000/";
let socket = io.connect(null, {port:5000, rememberTransport: false});


function Socketio() {
  const [messages, setMessages] = useState("");
  const [message, setMessage] = useState("");
  const urlElement = window.location.href.split('/')
  const room_id = urlElement[4]
  const username = urlElement[5]
  socket.emit("join",room_id)
  useEffect(() => {
    getMessages()
  }, [messages.length]);

  socket.on("join", room => {
        console.log(room)
    })

  const getMessages = () => {
    socket.on("message", ({name, message}) => {
      setMessages([...messages, `${name}   :    ${message}`]);
    });
  };

  // On Change
  const onChange = e => {
    setMessage(e.target.value);
  };

  // On Click
  const onClick = () => {
    if (message !== "") {
      socket.emit("message", {message,room_id,username});
      setMessage("");
    } else {
      alert("Please Add A Message");
    }
  };

  return (
    <div>
      {messages.length > 0 &&
        messages.map(msg => (
          <div>
            <p>{msg}</p>
          </div>
        ))}
      <input value={message} name="message" onChange={e => onChange(e)} />
      <button onClick={() => onClick()}>Send Message</button>
    </div>
  );
};



export default Socketio;