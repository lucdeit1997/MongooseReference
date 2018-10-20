const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: { type: String, require: true, trim: true },
    slug : { type: String },
    /**
     * 1. hoatdong
     * 0. khoa
     */
    status: { type: Number, default: 1 },
    description: { type: String},
})
const categoryModel = mongoose.model('category', categorySchema);
module.exports = categoryModel;