const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config()
require("./config/database").connect();

const corsOptions = {
    origin: 'http://localhost:3000',  // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Enable credentials (cookies, authorization headers)
    optionsSuccessStatus: 204,  // Some legacy browsers choke on 204
};

app.use(cors());

const PORT = process.env.PORT || 4000;

app.use(express.json());

const Routes = require("./routes/Routes")
app.use("/api/v1", Routes)

app.listen(PORT, () => {
    console.log(`server has started at port ${PORT}`)
})

