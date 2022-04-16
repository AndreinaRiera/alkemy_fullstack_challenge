const { parametersReceived, createResponse } = require('../utils');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function create(req, res) {
    if (parametersReceived(req.body, ['name', 'lastname'])) {
        /*___________________________SQL____________________________________
                
            INSERT INTO Users (name, lastname, uid) 
            VALUES (?, ?, ?)
        _________________________________________________________________*/

        const { name, lastname } = req.body;
        const { uid } = req.user;

        prisma.Users.create({
            data: {
                name,
                lastname,
                uid
            }
        }).then(user => {
            createResponse(res, {
                status: 'created',
                data: user
            });
        }).catch(error => {
            createResponse(res, {
                error
            });
        });
    } else {
        createResponse(res, {
            status: 'missingParameters'
        });
    }
}

module.exports = create;