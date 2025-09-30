require('dotenv').config(); 

const app = require('./app'); 
const connectDB = require('./db/db'); 

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

connectDB(uri)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });
