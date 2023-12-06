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
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const database = require('./config/database');
const restaurantRoutes = require('./routes/restaurants');
require('dotenv').config();
const connectionString = process.env.SAMPLE_RESTAURANTS_DB_CONNECTION_STRING;

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

database.initialize(connectionString);

app.use(restaurantRoutes);

app.engine('.hbs', exphbs({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Disable the warning for accessing non-own properties
        allowProtoMethodsByDefault: true // Disable the warning for accessing non-own methods
    }
  }));
app.set('view engine', '.hbs');

app.use('/style', express.static('public/style'));

// UI/Form route
app.get('/ui/restaurants', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 5;
        const borough = req.query.borough || null;

        const restaurants = await database.getAllRestaurants(page, perPage, borough);

        // Render the UI/form using Handlebars
        res.render('restaurants', {
            page,
            perPage,
            borough,
            restaurants,
        });
    } catch (error) {
        console.error('Error rendering UI:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
