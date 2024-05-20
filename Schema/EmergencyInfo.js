const mongoose = require('mongoose')

const emergencyInfoSchema = new mongoose.Schema({
  fireStationNumbers: Object,
  policeStationNumbers: Object,
  cdrmmoNumbers: Object,
  cpsoNumbers: Object,
  ambulanceNumber: String,
  healthOfficeNumber: String,
  norecoNumbers: Object,
  coastGuardNumbers: Object,
});

const emergencyModal = mongoose.model('Emergency', emergencyInfoSchema)

module.exports = emergencyModal