const mongose = require('mongoose');
const companySchema = mongose.Schema({
    company_name: {
        type: String,
        required: true,
        trim: true,
        label:true
    },
    company_legal_number: {
        type: String,
        required: true,
        minlenght: 7,
        trim: true
    },
    incorporation_country: {
        type: String,
        required: true,
        minlenght: 7,
        trim: true
    },
    website: {
        type: String,
        required: true,
        minlenght: 7,
        trim: true
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
const Company = mongose.model('Company', companySchema)
module.exports = Company