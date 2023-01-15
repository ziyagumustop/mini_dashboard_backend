const { default: mongoose } = require('mongoose');
const mongose = require('mongoose');
const productSchema = mongose.Schema({
    product_name: {
        type: String,
        required: true,
        trim: true,
    },
    product_category: {
        type: String,
        required: true,
        trim: true
    },
    incorporation_amount: {
        type: String,
        required: true,
        minlenght: 7,
        trim: true
    },
    amount_unit: {
        type: String,
        required: true,
        minlenght: 7,
        trim: true
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
        default: new Date()
    },
    deleted_at: {
        type: Date,
        required: false,
        default: null
    }
}, { versionKey: false })
const Product = mongose.model('Product', productSchema)
module.exports = Product