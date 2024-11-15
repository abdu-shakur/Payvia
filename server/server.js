const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./dbConfig/dbConfig')
const cors = require('cors')


const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/transactionRoutes'), require('./routes/fundsRoutes'));

connectDB();
app.listen(port, ()=> 
    console.log(`Server listening on port ${port}`)
)