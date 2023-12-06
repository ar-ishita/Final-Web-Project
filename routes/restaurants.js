/******************************************************************************
*   ITE5315 – Project
*   I declare that this assignment is my own work in accordance with Humber Academic Policy.
*   No part of this assignment has been copied manually or electronically from any other source
*   (including web sites) or distributed to other students.
*
*   Group member Name: Spencer Standish     Student IDs: N01576620      Date: 05/12/2023
*   Group member Name: Ishita Arora     Student IDs: N01543414      Date: 05/12/2023                                       
******************************************************************************/

const express = require('express');
const database = require('../config/database');

const router = express.Router();

// POST /api/restaurants
router.post('/api/restaurants', async (req, res) => {
    try {
        const result = await database.addNewRestaurant(req.body);
        console.log('Restaurant added successfully:', result);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding new restaurant:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/restaurants
router.get('/api/restaurants', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 5;
        const borough = req.query.borough || null;

        const restaurants = await database.getAllRestaurants(page, perPage, borough);
        console.log('Restaurants retrieved successfully:', restaurants);
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error getting restaurants:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/restaurants/:id
router.get('/api/restaurants/:id', async (req, res) => {
    try {
        const restaurant = await database.getRestaurantById(req.params.id);
        if (!restaurant) {
            res.status(404).json({ error: 'Restaurant not found' });
        } else {
            console.log('Restaurant retrieved successfully:', restaurant);
            res.status(200).json(restaurant);
        }
    } catch (error) {
        console.error('Error getting restaurant by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/restaurants/:id
router.put('/api/restaurants/:id', async (req, res) => {
    try {
        const updatedRestaurant = await database.updateRestaurantById(req.body, req.params.id);
        console.log('Restaurant updated successfully:', updatedRestaurant);
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        console.error('Error updating restaurant by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /api/restaurants/:id
router.delete('/api/restaurants/:id', async (req, res) => {
    try {
        const result = await database.deleteRestaurantById(req.params.id);
        if (!result) {
            res.status(404).json({ error: 'Restaurant not found' });
        } else {
            console.log('Restaurant deleted successfully:', result);
            res.status(204).send();
        }
    } catch (error) {
        console.error('Error deleting restaurant by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
