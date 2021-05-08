const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });






io.on('connection', (socket) => { 


console.log(socket.id);

const id = socket.id;

console.log("client connected");

//socket.join('room');

console.log("client in room");

//io.to('room').emit('common msg','yeh msg har jagh');
/*
io.to('room').emit('newMessage', {
  from:'jen@mds',
  text:id,
  createdAt:123
});
*/

socket.on('send-message',function(message){

  console.log("message from client");
  console.log(message);

  io.sockets.emit('receive-message', message);

});

//socket.on('create-new-room',(message)=>{
//  console.log("i was called");
  
//})


});




server.listen(5000);