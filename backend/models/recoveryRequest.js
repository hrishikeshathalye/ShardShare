var mongoose = require('mongoose')

const requestSchema = mongoose.Schema({
    requester: {type: String, required: true},
    secretId: {type: ObjectId, required: true},
    date: { type: Date, expires: 86400, default: Date.now, required: true},
    numApproved: {type: Number, required: true},
    numDeclined: {type: Number, required: true}
})

module.exports =  mongoose.model("Secret", requestSchema);