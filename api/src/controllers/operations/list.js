const {checkTypeOperation, createResponse} = require('../utils');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function list(req, res) {

    /*___________________________SQL____________________________________
                
        SELECT * FROM OperationsHistory
        WHERE userUid like ?
        ORDER BY date ASC
    _________________________________________________________________*/

    // Where
    let where = {};
    where.userUid = req.user.uid;

    // Request
    prisma.operationsHistory.findMany({
        where,
        orderBy: {
            date: 'asc'
        }
    }).then(operations => {
        // Response
        const data = operations.map(operation => {
            var {typeName, typeCode, isIncome} = checkTypeOperation(operation.type);
            
            return {
                ...operation,
                typeName,
                typeCode,
                isIncome,
                formatDate: new Date(operation.date).toLocaleString()
            };
        });


        createResponse(res, {
            status: 'ok',
            data
        });
    }).catch(error => {
        // Response error
        createResponse(res, {
            error
        });
    });
}

module.exports = list;