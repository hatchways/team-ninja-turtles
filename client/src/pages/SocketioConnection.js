import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
let endPoint = "http://127.0.0.1:5000/";
let socket = io.connect(null, {port:5000, rememberTransport: false});


function Socketio() {
  const [messageLog, setMessageLog] = useState([]);
  const [message, setMessage] = useState("");
  const urlElement = window.location.href.split('/')
  const room_id = urlElement[4]
  const username = urlElement[5]
  socket.emit("join",room_id)
  
  useEffect(() => {
    return socket.off("message")
  }, []);

  socket.on("join", room => {
    console.log(room)
  })

  socket.on("message", ({name, message}) => {
    setMessageLog([...messageLog, `${name}: ${message}`])
  })

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
    <div key={room_id}>
      {messageLog.length > 0 &&
        messageLog.map((msg, key) => (
          <div key={key}>
            <p>{msg}</p>
          </div>
        ))}
      <input value={message} name="message" onChange={e => onChange(e)} />
      <button onClick={() => onClick()}>Send Message</button>
    </div>
  );
};



export default Socketio;