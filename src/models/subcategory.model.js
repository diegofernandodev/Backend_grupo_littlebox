const { Schema, model } = require('mongoose')

const subcategorySchema = new Schema ({
    tenantId: {type: String
},

    name: {type: String,
    required: [true, 'Name is required.']
},
    description: {
        type: String,
        required: [true, 'Name is required.']

},
    category: { type: Schema.Types.ObjectId,
    ref: 'category',
    required: true}
})


module.exports = model('subcategory' , subcategorySchema , 'subcategories')