const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const pubDir = `${__dirname}/public`;
const io = require('socket.io')(http);
const path = require('path');
const WebSocket = require('ws');

const userRoutes = require('./server/routes/users');
const courseRoutes = require('./server/routes/courses');

io.on('connection', (socket) => {
    socket.on('stream', (image) => {
        socket.broadcast.emit('stream',image);
    });
});

app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb+srv://dbMOBILE:serverjs@mobile-server-rjy4g.mongodb.net/test?retryWrites=true&w=majority',
{useNewUrlParser: true} );

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use((res, req, next) => {
  res.header("Access-Control-Expose-Headers", "ETag");
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods',
    'PUT, POST, PATCH, GET, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.get('/client', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client.html'));
});

app.get('/streaming', (req, res) => {
  res.sendFile(path.resolve(__dirname, './streaming.html'));
});

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

app.use((res, req, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

module.exports = app;
