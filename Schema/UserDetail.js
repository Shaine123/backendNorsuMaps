const mongoose = require('mongoose')

const UserDetailSchema = new mongoose.Schema({
   name: String,
   email: String,
   phone: String,
   studentid: {type: String , unique: true},
   verified: Boolean,
   refImage: String,
   fileName: String,
   password: String

})

const userModel = mongoose.model('User', UserDetailSchema)

module.exports = userModel