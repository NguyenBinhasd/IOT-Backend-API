const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    name: {type: String, required: true},
    devices: {type: Object},
    user: {type: Schema.Types.ObjectId, ref: 'Users'}
});

module.exports = mongoose.model('Rooms', PostSchema);