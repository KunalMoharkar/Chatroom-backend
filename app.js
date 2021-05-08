const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });


io.on('connection', (socket) => { 

socket.on('join-room',(message)=>{
  const username = message.username;
  const roomId = message.roomId;
  console.log(`socket ${socket.id} -- ${username} joining room ${roomId}`)
  socket.join(roomId);

})


socket.on('send-message',function(message){

  console.log("message from client");
  console.log(message);
  const roomId = message.roomId;
  io.to(roomId).emit('receive-message', message);

});

//socket.on('create-new-room',(message)=>{
//  console.log("i was called");
  
//})


});




server.listen(5000);