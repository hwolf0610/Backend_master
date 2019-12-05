const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Plan = new Schema({
    month: {
        type: String
    },
    year: {
        type: String
    },
    name: {
        type: String
    },
    detail:{
        type:String
    },
    price:{
        type:String
    }
});
module.exports = mongoose.model('plan', Plan);