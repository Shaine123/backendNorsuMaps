const mongoose = require('mongoose')

const emergencyInfoSchema = new mongoose.Schema({
  fireStationNumbers: Object,
  policeStationNumbers: Object,
  cdrmmoNumbers: Object,
  cpsoNumbers: Object,
  ambulanceNumber: Object,
  healthOfficeNumber: Object,
  norecoNumbers: Object,
  coastGuardNumbers: Object,
});

const emergencyModal = mongoose.model('Emergency', emergencyInfoSchema)

module.exports = emergencyModal