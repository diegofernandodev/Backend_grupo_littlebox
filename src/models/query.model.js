const { Schema, model } = require('mongoose');

const querySchema = new Schema({
    
    identifier: { type: Number,
        required: [true, 'Identifier is required.']
    },

    question: { 
        type: String, 
        required: [true, 'Question is required.'] 
    },
    answer: { 
        type: String, 
        required: [true, 'Answer is required.'] 
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'subcategories',  
        required: true
    },
    date: { type: Date, 
        default: Date.now() }
});

module.exports = model('query', querySchema, 'queries');