const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const objectId = Schema.Types.ObjectId;
const productSchema = new Schema({
    nameProduct: { type: String, unique: true, require: true},
    slug: String,
    description: String,
    image: String,
    /**
     * 1: active
     * 0: block
     */
    status: { type: String, default: 1},
    category: {
        type: objectId,
        ref: 'category'
    },
    author: {
        type: objectId,
        ref: 'user'
    }
})
const productModel = mongoose.model('product', productSchema);
module.exports = productModel;