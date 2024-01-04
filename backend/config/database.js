const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("DB connected")
    }).catch((err) => {
        console.log("DB connection failed");
        console.log(err);
        process.exit(1);
    })
}