const { Schema, model } = require('mongoose')

const categorySchema = new Schema ({
    name: {type: String,
    required: [true, 'Name is required.']
},
    description: {type: String,
    required: [true, 'Description required.']
}
})

module.exports = model('category' , categorySchema , 'categories')