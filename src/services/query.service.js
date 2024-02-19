const queryModel = require('../models/query.model')

const queryList = async () => {
    return await queryModel.find()
}


module.exports = { queryList }