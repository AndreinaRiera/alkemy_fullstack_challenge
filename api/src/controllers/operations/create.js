const { checkTypeOperation, createResponse } = require('../utils');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function create(req, res) {
    const { uid: userUid } = req.user;
    const { type, amount, description, date } = req.body;
    const { typeCode, isValidType } = checkTypeOperation(type);

    if (isValidType && amount && (!isNaN(amount)) && date) {
        try {
            /*___________________________SQL____________________________________
                
                INSERT INTO OperationsHistory (userUid, type, amount, description, date)
                VALUES (?, ?, ?, ?, ?)
            _________________________________________________________________*/

            const user = await prisma.Users.findUnique({
                where: {
                    uid: userUid
                }
            });

            if (!user) {
                createResponse(res, {
                    error: 'User not found'
                });
                return;
            }

            const operation = await prisma.OperationsHistory.create({
                data: {
                    type: typeCode,
                    amount: parseFloat(amount),
                    description: description || undefined,
                    date: new Date(date).toISOString(),
                    userUid,
                    userId: user.id
                }
            });

            createResponse(res, {
                status: 'created',
                data: operation
            });

        } catch (error) {
            createResponse(res, {
                error
            });
        }
    }else{
        createResponse(res, {
            state: 'missingParameters'
        });
    }
}

module.exports = create;