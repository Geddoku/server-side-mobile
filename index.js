const http = require('http');
const controller = require('./controller');

const port = process.env.PORT || 5000;
const server = http.createServer(controller);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('streaming', (image) => {
  	io.emit('play stream', image)
  })
})

server.listen(port);
