require("dotenv").config();
const User = require("../models/User")
// const Order = require("../models/Order")
const fs = require('fs')

exports.signup = async (req, res) => {
    try {
        const userData = req.body; // Assuming the array is sent in the request body

        // Validate the presence of data
        if (!Array.isArray(userData) || userData.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data format',
            });
        }

        // Insert data into MongoDB
        await User.insertMany(userData);

        return res.status(201).json({
            success: true,
            message: 'Data added successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { SeatNumber, PNR } = req.body;
        if (!SeatNumber || !PNR) {
            return res.status(400).json({
                success: false,
                message: 'Fill full details',
            })
        }

        let user = await User.findOne({ SeatNumber });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'seat number not registered'
            })
        }

        if (user.PNR !== PNR) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect PNR',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                SeatNumber: user.SeatNumber
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

exports.getData = async (req, res) => {
    try {
        const jsonData = fs.readFileSync('C://webtechnologies//temp//allo_health//backend//controllers//allo-fullstack-assignment-dataset_1.json', 'utf8');
        const parsedData = JSON.parse(jsonData);
        // const parsedData = "testdata"

        return res.status(200).json({
            success: true,
            data: parsedData,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}
