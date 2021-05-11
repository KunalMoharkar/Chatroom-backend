const express = require('express');
const app = require('express')();
const cors = require('cors')
const server = require('http').createServer(app);

//req body to json
app.use(express.json())
//cors for browser requests
app.use(cors())


//sockets.io instance
const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });


let VALIDATIOR = {};


//this API route will return the unique room ID.
//current implementaion just returns the requesting sockets ID as room ID
app.post('/getRoomId', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log(req.body);
  socketId = req.body.socketId;


  VALIDATIOR[socketId] = [];
  VALIDATIOR[socketId].push(socketId);

  console.log(VALIDATIOR);
  console.log(socketId);
  res.json({'roomId':socketId});
})


  

//Sockets Events
io.on('connection', (socket) => { 

//handles join room requests
socket.on('join-room',(message)=>{
  const username = message.username;
  const roomId = message.roomId;

  if (VALIDATIOR.hasOwnProperty(roomId)) {

    console.log(`socket ${socket.id} -- ${username} joining room ${roomId}`)
    socket.join(roomId);
  
  }
  else
  {

    socket.emit('error',{errorMsg:"invalid room code"});
    console.log(`invalid room code`)

  }

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