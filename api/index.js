const express    = require('express');
const cors       = require('cors');
const middleware = require('./src/middleware/');

// VARIABLES

const app  = express();
const port = process.env.PORT || 3030;

// CONFIGURATION

app.use(cors());
app.use(express.json());

// MIDDLEWARE

app.use(middleware.registeredUser);

// ROUTES 

app.get('/', (req, res) => { 
    res.json({
        message: "Hello!",
        avaliableRoutes: [
            {
                route: "/",
                description: "You are here!",
                method: "GET",
                response: 'none',
                internalRoutes: [
                    {
                        route: "/users",
                        response: 'none',
                        internalRoutes: [
                            {
                                route: "/get/:uid",
                                response: 'user',
                                description: "Get user by id",
                                method: "GET"
                            },
                            {
                                route: "/create",
                                response: 'user',
                                description: "Create user",
                                method: "POST"
                            }
                        ]
                    },
                    {
                        route: "/operations",
                        response: 'none',
                        internalRoutes: [
                            {
                                route: "/list",
                                response: 'operations',
                                description: "Get all operations",
                                method: "GET"
                            },
                            {
                                route: "/create",
                                response: 'operation',
                                description: "Create operation",
                                method: "POST"
                            },
                            {
                                route: "/update",
                                response: 'operation',
                                description: "Update operation",
                                method: "PUT"
                            },
                            {
                                route: "/delete/:id",
                                response: 'operation',
                                description: "Delete operation",
                                method: "DELETE"
                            }
                        ]
                    }
                ]
            }
        ]
    });
});

app.use('/operations', require('./src/routes/operations.js'));
app.use('/users', require('./src/routes/users.js'));

// START SERVER

app.listen(port, () => console.log(`App listening on port ${port}!`));