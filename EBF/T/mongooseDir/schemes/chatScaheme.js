const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let chatLogSchema = new Schema({
    cmd: String,
    opt: String,
    id: String,
    content: String
}, { timestamps: true });


module.exports = mongoose.model('chatLog', chatLogSchema);
