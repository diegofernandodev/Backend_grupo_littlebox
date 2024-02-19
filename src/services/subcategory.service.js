const subcategoryModel = require('../models/subcategory.model')

const subcategoryList = async () => {
    return await subcategoryModel.find()
}



module.exports = { subcategoryList }