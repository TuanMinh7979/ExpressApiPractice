const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch(error => console.log('ERROR WHEN CONNECT TO DB'));
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION SHUTTING DOWN :))');
  server.close(() => {
    process.exit(1);
  });
});
process.on('uncaughtException', err=>{
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION SHUTTING DOWN :))');
  server.close(() => {
    process.exit(1);
  });
})
