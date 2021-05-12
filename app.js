const express = require('express');
const app = require('express')();
const cors = require('cors')
const short = require('short-uuid');
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
//current implementaion just returns the random uinque string  as room ID
app.post('/getRoomId', (req, res) => {

  //cors
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log(req.body);
  socketId = req.body.socketId;

  //generate a unique room id
  roomId = short.generate();
  VALIDATIOR[roomId] = [];
  console.log(VALIDATIOR);

  //send room id to client
  res.json({roomId:roomId});

})


//Sockets Events
io.on('connection', (socket) => { 

//handles join room requests
socket.on('join-room',(message)=>{
  const username = message.username;
  const roomId = message.roomId;

  console.log(`usrname - ${username}`)
  console.log(`room id - ${roomId}`);

  //if room code is correct
  if (VALIDATIOR.hasOwnProperty(roomId)) {

    //push into participants list
    VALIDATIOR[roomId].push({socketId:socket.id,userName:username});
    console.log(`socket ${socket.id} -- ${username} joining room ${roomId}`)
    //join room
    socket.join(roomId);

    //send the list to all in a room
    io.to(roomId).emit('participants',{participantsList:VALIDATIOR[roomId]});
  
  }
  else
  {

    //error msg
    socket.emit('error',{errorMsg:"invalid room code"});
    console.log(`invalid room code`)

  }

});

//on disconnection kick the client of the room
socket.on("disconnecting", (reason) => {
  let socketRooms = socket.rooms; 

  let socketRoomsArray = socketRooms.entries();

  console.log(socketRoomsArray);


});


//broadcast message sent by client to its Room
socket.on('send-message',function(message){

  console.log("message from client");
  console.log(message);
  const roomId = message.roomId;
  io.to(roomId).emit('receive-message', message);

});


});




server.listen(5000);