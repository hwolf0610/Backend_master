const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Job = new Schema({
    month: {
        type: String
    },
    day: {
        type: String
    },
    year: {
        type: String
    },
    name: {
        type: String
    },
    clientname:{
        type:String
    },
    price:{
        type:String
    }
});
module.exports = mongoose.model('job', Job);