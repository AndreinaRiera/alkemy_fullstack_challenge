const { checkTypeOperation, createResponse } = require('../utils');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function update(req, res) {
    /*___________________________SQL____________________________________
                
        UPDATE OperationsHistory
        SET type = ?, amount = ?, date = ?, description = ?
        WHERE id = ? AND userUid like ?
    _________________________________________________________________*/

    let { uid: userUid } = req.user;
    let { id: idOperation } = req.params;
    let { type, amount, description, date } = req.body;
    let { typeCode, isValidType } = checkTypeOperation(type);

    if (isValidType && amount && (!isNaN(amount)) && date) {
        idOperation = parseInt(idOperation);

        // Create data
        let data = {};

        if (description) data.description = description;
        if (typeCode) data.type = typeCode;
        if (amount) data.amount = parseFloat(amount);
        if (date) data.date = new Date(date).toISOString();

        try {
            // Request
            const operation = await prisma.operationsHistory.findMany({
                where: {
                    id: idOperation,
                    userUid
                }
            });

            if (operation && operation.length > 0) {
                const updated = await prisma.operationsHistory.update({
                    where: {
                        id: idOperation
                    },
                    data
                });

                // Response
                createResponse(res, {
                    status: 'updated',
                    data: updated
                });
            } else {

                // Response errors
                createResponse(res, {
                    error: 'Operation not found'
                });
            }
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

module.exports = update;