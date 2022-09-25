const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });
app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
