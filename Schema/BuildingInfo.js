const mongoose = require('mongoose')

const BuildingInfoSchema = new mongoose.Schema({
   latitude: Number,
   longitude: Number,
   latitudeText: Number,
   longitudeText: Number,
   title: String,
   description: String,
   noRooms: Boolean,
   noRoomsText: String,
   textInfo: String,
   numFloors: Number,
   numRooms: Number,
   roomGroundFloor: [String],
   roomSecondFloor: [String],
   roomThirdFloor: [String],
   roomFourthFloor: [String],
   buildingNewImage: String
})

const buildingInfoModel = mongoose.model('BuildingInfo', BuildingInfoSchema)

module.exports = buildingInfoModel