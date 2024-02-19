const categoryModel = require('../models/category.model')

const categoryList = async () => {
    return await categoryModel.find()
}


module.exports = { categoryList }