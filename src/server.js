require('dotenv').config();
const initModel = require('./models/initModels')
const app = require('./app');
const { db } = require('./database/config');
const { Server } = require('socket.io');
const Sockets =require('./sockets')
/* const cron = require('node-cron');

cron.schedule('* * * * *', () => { 
  console.log('running a task every minute');
}); */

db.authenticate()
  .then(() => console.log('db connected!...😎'))
  .catch((err) => console.log(err));

initModel();

db.sync()
  .then(() => console.log('db synchronized!...🙌'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

new Sockets(io);
