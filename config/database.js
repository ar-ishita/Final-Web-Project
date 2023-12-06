/******************************************************************************
*   ITE5315 – Project
*   I declare that this assignment is my own work in accordance with Humber Academic Policy.
*   No part of this assignment has been copied manually or electronically from any other source
*   (including web sites) or distributed to other students.
*
*   Group member Name: Spencer Standish     Student IDs: N01576620      Date: 05/12/2023
*   Group member Name: Ishita Arora     Student IDs: N01543414      Date: 05/12/2023                                       
******************************************************************************/

const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');

const initialize = function (url) {
    mongoose.connect(url);

    const db = mongoose.connection;

    db.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
};

const addNewRestaurant = function (data) {
    const newRestaurant = new Restaurant({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return newRestaurant.save();
};

const getAllRestaurants = function (page, perPage, borough) {
    const query = borough ? { borough: borough } : {};
    return Restaurant.find(query)
        .sort({ restaurant_id: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
};

const getRestaurantById = function (id) {
    return Restaurant.findById(id).exec();
};

const updateRestaurantById = function (data, id) {
    return Restaurant.findByIdAndUpdate(id, data, { new: true }).exec();
};

const deleteRestaurantById = function (id) {
    return Restaurant.findByIdAndDelete(id)
        .exec()
        .then((result) => {
            if (!result) {
                console.log(`No restaurant found with _id: ${id}`);
            } else {
                console.log(`Restaurant deleted: ${result}`);
            }
            return result;
        })
        .catch((error) => {
            console.error(`Error deleting restaurant with _id ${id}: ${error}`);
            throw error;
        });
};

const closeConnection = function () {
    mongoose.connection.close();
};

module.exports = {
    initialize,
    addNewRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurantById,
    deleteRestaurantById,
    closeConnection
};
