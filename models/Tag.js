const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const objectId = Schema.Types.ObjectId;
const tagSchema = new Schema({
    title       : {
        type: String,
        trim: true
    },
    description : {
        type: String,
        trim: true
    },
    slug        : {
        type: String
    },
    /**
     * 1. active
     * 0. block
     */
    status      : {
        type   : Number,
        default: 1
    },
    createAt    : {
        type   : Date,
        default: Date.now
    },
    products    : [
        {
            type: Schema.Types.ObjectId,
            ref : 'product'
        }
    ]
})
const tagModel = mongoose.model('tag', tagSchema);
module.exports = tagModel;