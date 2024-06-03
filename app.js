const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { GridFsStorage } = require('multer-gridfs-storage');
const { GridFSBucket } = require('mongodb');
const multer = require('multer');

app.use(bodyParser.json());
app.use(cors())
app.use(express.json())

const mongooseUrl = "mongodb+srv://admin:NgNSzeoN3QXq72Vv@cluster0.jhovera.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



mongoose.connect(mongooseUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
   console.log('Database Connected')
})
.catch(()=>{
   console.log('Database Failed to Connect')
})

let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
    gfs = new GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
});

const storage = new GridFsStorage({
   url: mongooseUrl,
   file: (req, file) => {
       return {
           bucketName: 'uploads', // collection name
           filename: `${Date.now()}-${file.originalname}` // filename
       };
   }
});

const upload = multer({ storage });

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
});

app.get('/files/:filename', (req, res) => {
    gfs.find({ filename: req.params.filename }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

const userSchema = require('./Schema/UserDetail')

app.get('/', (req,res) => {
   res.send({status: 'Started'})
})

app.post('/register', async(req,res) => {
   const {name,password,email,verified,refImage,phone,studentid} = req.body
   console.log(req.body)
   
   const oldUser = await userSchema.findOne({studentid: studentid})
    
   console.log(req.body)
   if(oldUser){
      return res.send({data: "User already exist!!"})
   }
   try{ 
     await userSchema.create({
      name: name,
      email: email,
      phone: phone,
      verified: verified,
      refImage: refImage,
      studentid: studentid,
      password: password
     }).then((result) => res.json(result) )
     .catch((error) => res.json(error))
   }catch(error){
     console.log(error)
   }
})
app.get('/getAccount', (req,res) => {
   console.log('send data')
    userSchema.find()
    .then((result) => {res.json(result)})
    .catch((error) => {res.json(error)} )
})

app.put('/updateUser', (req,res) => {
   const {id,name,password,email,verified,refImage,phone,studentid} = req.body
    console.log(req.body)
   userSchema.findByIdAndUpdate({_id: id}, {
      name: name,
      email: email,
      phone: phone,
      verified: verified,
      refImage: refImage,
      studentid: studentid,
      password: password
     }).then((result) => res.json(result) )
     .catch((error) => res.json(error))
})

app.delete('/deleteUser/:id', (req,res) => {
      const {id} = req.params
      console.log(id)
      userSchema.findByIdAndDelete({_id:id})
      .then((result) => res.json(result) )
     .catch((error) => res.json(error))
})

const buildingInfoSchema = require('./Schema/BuildingInfo')

app.post('/addBuilding', (req,res) => {
     const {latitude,longitude,latitudeText,longitudeText,title,description,noRooms,noRoomsText,textInfo,numFloors,numRooms,grounds,seconds,thirds,fourths,newImage} = req.body
       
     console.log(req.body)
     buildingInfoSchema.create({
      latitude: latitude,
      longitude: longitude,
      latitudeText: latitudeText,
      longitudeText: longitudeText,
      title: title,
      description: description,
      noRooms: noRooms,
      noRoomsText: noRoomsText,
      textInfo: textInfo,
      numFloors: numFloors,
      numRooms: numRooms,
      roomGroundFloor: grounds,
      roomSecondFloor: seconds,
      roomThirdFloor: thirds,
      roomFourthFloor: fourths,
      buildingNewImage: newImage
     })
     .then((result) => res.json(result) )
     .catch((error) => res.json(error))
})
app.put('/updateBuilding', (req,res) => {
   const {id,latitude,longitude,latitudeText,longitudeText,title,description,noRooms,noRoomsText,textInfo,numFloors,numRooms,grounds,seconds,thirds,fourths,newImage} = req.body
   console.log(id)
   console.log(req.body)

   // noRooms: noRooms,
   // noRoomsText: noRoomsText,
   buildingInfoSchema.findByIdAndUpdate({_id: id }, {
      latitude: latitude,
      longitude: longitude,
      latitudeText: latitudeText,
      longitudeText: longitudeText,
      title: title,
      description: description,
      textInfo: textInfo,
      numFloors: numFloors,
      numRooms: numRooms,
      roomGroundFloor: grounds,
      roomSecondFloor: seconds,
      roomThirdFloor: thirds,
      roomFourthFloor: fourths,
      buildingNewImage: newImage
   })
   .then((result) => res.json(result))
   .catch((error) => res.json(error))
})

app.delete('/deleteBuilding/:id', (req,res) => {
    
   const {id} = req.params
   buildingInfoSchema.findByIdAndDelete({_id:id})
   .then((result) => res.json(result))
   .catch((error) => res.json(error))
})
app.get('/getBuilding', (req,res) => {
   console.log('send building info')
   buildingInfoSchema.find()
   .then((result) => {res.json(result)})
   .catch((error) => {res.json(error)} )
})

const emergencyInfoSchema = require('./Schema/EmergencyInfo')

app.post('/addEmergencyInfo', (req,res) => {

   const {fireStationNumbers,policeStationNumbers,cdrmmoNumbers,cpsoNumbers,ambulanceNumber,healthOfficeNumber,norecoNumbers,coastGuardNumbers} = req.body

   emergencyInfoSchema.create({
      fireStationNumbers: fireStationNumbers,
      policeStationNumbers: policeStationNumbers,
      cdrmmoNumbers: cdrmmoNumbers,
      cpsoNumbers: cpsoNumbers,
      ambulanceNumber: ambulanceNumber,
      healthOfficeNumber: healthOfficeNumber,
      norecoNumbers: norecoNumbers,
      coastGuardNumbers: coastGuardNumbers,
   })
   .then((result) => {res.json(result)})
   .catch((error) => {res.json(error)} )
})
app.put('/editEmergencyInfo', (req,res) => {
   const {id,fireStationNumbers,policeStationNumbers,cdrmmoNumbers,cpsoNumbers,ambulanceNumber,healthOfficeNumber,norecoNumbers,coastGuardNumbers} = req.body

   emergencyInfoSchema.findByIdAndUpdate({_id:id},{
      fireStationNumbers: fireStationNumbers,
      policeStationNumbers: policeStationNumbers,
      cdrmmoNumbers: cdrmmoNumbers,
      cpsoNumbers: cpsoNumbers,
      ambulanceNumber: ambulanceNumber,
      healthOfficeNumber: healthOfficeNumber,
      norecoNumbers: norecoNumbers,
      coastGuardNumbers: coastGuardNumbers,
   })
   .then((result) => {res.json(result)})
   .catch((error) => {res.json(error)} )
})

const Enrollment = require('./Schema/EnrollmentSchema')

app.post('/addEnrolmentProcess', async (req,res) => {
   try {
      const {enrollmentData} = req.body;
      console.log(enrollmentData)
      const newEnrollment = new Enrollment(enrollmentData);
      const savedEnrollment = await newEnrollment.save();
      res.status(201).json(savedEnrollment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})

app.put('/editEnrolmentProcess', async (req,res) => {
   try {
      const {enrollmentData} = req.body;
      const newEnrollment = new Enrollment(enrollmentData);
      const savedEnrollment = await newEnrollment.save();
      res.status(201).json(savedEnrollment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})

app.get('/getEnrollmentProcess', (req,res) => {
   Enrollment.find()
   .then((result) => {res.json(result)})
   .catch((error) => {res.json(error)} )
})

const BuildingSearchInfo = require('./Schema/BuildingSearchInfo')
app.post('/addBuildingSearchInfo', async (req,res) => {
   try {
      const {buildingInfo} = req.body;
      console.log(buildingInfo)
      const newBuildingSearchInfo = new BuildingSearchInfo(buildingInfo);
      const savedBuildingSearchInfo = await newBuildingSearchInfo.save();
      res.status(201).json(savedBuildingSearchInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})
app.put('/editBuildingSearchInfo', async (req,res) => {
   try {
      const {buildingInfo} = req.body;
      console.log(buildingInfo)
      const newBuildingSearchInfo = new BuildingSearchInfo(buildingInfo);
      const savedBuildingSearchInfo = await newBuildingSearchInfo.save();
      res.status(201).json(savedBuildingSearchInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})
app.get('/getBuildingSearchInfo', (req,res) => {
   BuildingSearchInfo.find()
   .then((result) => res.json(result))
   .catch((error) => res.json(error))
})


app.get('/getEmergencyInfo', (req,res) => {
   emergencyInfoSchema.find()
   .then((result) => {res.json(result)})
   .catch((error) => {res.json(error)} )
})
app.listen(3003,()=>{
   console.log('Server has Started')
})