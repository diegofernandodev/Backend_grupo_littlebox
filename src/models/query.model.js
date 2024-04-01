const { Schema, model } = require('mongoose');

const querySchema = new Schema({
    tenantId:{type: String,
        // required: [true, 'TenantId is required.']
    },
    
    identifier: { type: Number,
        // required: [true, 'Identifier is required.']
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
        ref: 'subcategory',  
        required: true
    },
    date: { type: Date, 
        default: Date.now() }
});

module.exports = model('query', querySchema, 'queries');