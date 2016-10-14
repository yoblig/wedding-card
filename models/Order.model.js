'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    bride: String,
    groom: String,
    sayings: Array,
    confirmId: String
});

module.exports = OrderSchema;


// TODO: Explain this - module.exports = mongoose.model('Order', OrderSchema);