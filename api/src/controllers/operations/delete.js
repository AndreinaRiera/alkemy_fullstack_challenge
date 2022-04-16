const { createResponse } = require('../utils');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteOperation(req, res) {
    const { uid: userUid } = req.user;
    let { id: idOperation } = req.params;

    if (idOperation && !isNaN(idOperation)) {
        idOperation = parseInt(idOperation);

        try {
            /*___________________________SQL____________________________________
                
                DELETE FROM OperationsHistory
                WHERE id = ? AND userUid like ?
            _________________________________________________________________*/

            const operation = await prisma.operationsHistory.findMany({
                where: {
                    id: idOperation,
                    userUid
                }
            });

            if (operation.length > 0) {
                const deleted = await prisma.operationsHistory.delete({
                    where: {
                        id: idOperation
                    }
                });

                createResponse(res, {
                    status: 'deleted',
                    data: deleted
                });
            } else {
                createResponse(res, {
                    error: 'Operation not found'
                });
            }
        } catch (error) {
            createResponse(res, {
                error
            });
        }
    }
}

module.exports = deleteOperation;