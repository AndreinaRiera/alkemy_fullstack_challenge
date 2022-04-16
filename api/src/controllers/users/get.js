const {createResponse} = require('../utils');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function get(req, res) {
    const { uid: uidParams } = req.params;
    const { uid: uidUser } = req.user;

    if(uidParams == uidUser){
        /*___________________________SQL____________________________________
                
            SELECT * FROM Users WHERE uid like ?
        _________________________________________________________________*/

        prisma.Users.findUnique({
            where: {
                uid: uidParams
            }
        }).then(user => {
            createResponse(res, {
                status: 'ok',
                data: user
            });
        }).catch(error => {
            createResponse(res, {
                error
            });
        });
    }
}

module.exports = get;