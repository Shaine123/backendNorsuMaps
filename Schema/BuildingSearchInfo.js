const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  floorone: [String],
  floortwo: [String],
  floorthree: [String]
}, { _id: false });

const buildingSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  stories: { type: Number, required: true },
  rooms: { type: roomSchema, required: true }
});

const BuildingSearch = mongoose.model('Building', buildingSchema);

module.exports = BuildingSearch;
