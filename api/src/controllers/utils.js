function parametersReceived(req, params){
    for (let i = 0; i < params.length; i++) {
        if(!req.hasOwnProperty(params[i])){
            return false;
        }
    }

    return true;
}

const createResponse = (res, config = {}) => {
    const statusObj = {
        ok: 200,
        updated: 200,
        created: 201,
        deleted: 204,
        missingParameters: 400,
        unauthorized: 401,
        notFound: 404,
        error: 500,
    };

    if(config.error){
        console.log(config.error);
    }

    const status = statusObj[config.status] || (Number.isInteger(config.status) ? config.status : (config.error ? statusObj.error : statusObj.ok));

    res.status(status).json({
        message: (config.error && config.error.message) ? config.error.message: (config.message ? config.message : ''),
        status : config.status,
        error  : (config.error && config.error.code) ? config.error.code      : (status >= 400),
        data   : config.data || {}
    });
}

function checkTypeOperation(type) {
    let isValidType = false;
    let isIncome = false;
    let typeCode = 0;
    let typeName = '';

    switch (type) {
        case 1:
        case 'income':
            isValidType = true;
            isIncome = true;
            typeCode = 1;
            typeName = 'income';
            break;
        case 2:
        case 'expense':
            isValidType = true;
            typeCode = 2;
            typeName = 'expense';
        break;
    }

    return {
        isValidType,
        isIncome,
        typeCode,
        typeName
    };
}

module.exports = {parametersReceived, createResponse, checkTypeOperation};