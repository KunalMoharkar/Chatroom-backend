const express = require('express');
const app = require('express')();
const cors = require('cors')
const server = require('http').createServer(app);

app.use(express.json())
app.use(cors())


//sockets.io instance
const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });



//this API route will return the unique room ID.
//current implementaion just returns the requesting sockets ID as room ID
app.post('/getRoomId', (req, res) => {
  

  console.log(req.body)
  socketId = req.socketId;
  res.send({'roomId':socketId});
})
  

//Sockets Events
io.on('connection', (socket) => { 

//handles join room requests
socket.on('join-room',(message)=>{
  const username = message.username;
  const roomId = message.roomId;
  console.log(`socket ${socket.id} -- ${username} joining room ${roomId}`)
  socket.join(roomId);

})


//broadcast message sent by client to its Room
socket.on('send-message',function(message){

  console.log("message from client");
  console.log(message);
  const roomId = message.roomId;
  io.to(roomId).emit('receive-message', message);

});


});




server.listen(5000);