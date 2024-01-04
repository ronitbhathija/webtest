const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    SeatNumber: {
        type: String,
        required: true,
        trim: true
    },

    PNR: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("user", userSchema)