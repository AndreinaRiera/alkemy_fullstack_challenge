const create = require('./create');
const list = require('./list');
const update = require('./update');
const deleteOperation = require('./delete');

const controllers = {
    create,
    list,
    update,
    delete: deleteOperation
};

module.exports = controllers;