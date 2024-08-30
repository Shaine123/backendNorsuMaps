const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { GridFsStorage } = require('multer-gridfs-storage');
const { GridFSBucket } = require('mongodb');
const multer = require('multer');
const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const dotenv = require('dotenv')

app.use(bodyParser.json());
app.use(cors())
app.use(express.json())

dotenv.config()
// const mongooseUrl = "mongodb+srv://admin:NgNSzeoN3QXq72Vv@cluster0.jhovera.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const mongooseUrl = "mongodb+srv://admin2:TbZsakWRkKYMdLqX@cluster0.jhovera.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// const mongooseUrl = "mongodb+srv://admin:NgNSzeoN3QXq72Vv@cluster0.jhovera.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



mongoose.connect(mongooseUrl)
.then(()=>{
   console.log('Database Connected')
})
.catch(()=>{
   console.log('Database Failed to Connect')
})

let gfs,gfsImages;
const conn = mongoose.connection;
conn.once('open', () => {
    gfs = new GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
    gfsImages = new GridFSBucket(conn.db, {
      bucketName: 'buildingImages'
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

const storageBuildingImage = new GridFsStorage({
   url: mongooseUrl,
   file: (req, file) => {
       return {
           bucketName: 'buildingImages', // collection name
           filename: `${Date.now()}-${file.originalname}` // filename
       };
   }
});

const upload = multer({ storage });
const uploadBuildingImage = multer({ storage: storageBuildingImage });

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
   console.log('uploaded data')
    res.json({ file: req.file });
});

//S3 Bucket
const s3 = new AWS.S3({
   accessKeyId: process.env.ACCESS_KEY,
   secretAccessKey: process.env.SECRET_KEY,
   region: process.env.REGION,
 });

 const upload2 = multer({
   storage: multer.memoryStorage(),
 });

 app.post('/uploadS3', upload2.single('file'), (req, res) => {
   const file = req.file;
   const s3Params = {
     Bucket: process.env.S3_BUCKET,
     Key: `uploads/${uuid()}.jpg`,
     Body: file.buffer,
     ContentType: file.mimetype,
     ACL: 'public-read',
   };
 
   s3.upload(s3Params, (err, data) => {
     if (err) {
       return res.status(500).json({ message: 'Upload failed', error: err });
     }
 
     // Return the file's public URL
     res.status(201).json({ imageUrl: data.Location });
   });
 });


app.get('/files/:filename', (req, res) => {
   console.log(`Received request to retrieve file: ${req.params.filename}`);
    
   const filesCollection = conn.db.collection('uploads.files');

   filesCollection.findOne({ filename: req.params.filename })
   .then((result) => {
      const downloadStream = gfs.openDownloadStreamByName(result.filename);
       
       downloadStream.on('error', (error) => {
           console.error('Error while streaming file:', error);
           res.status(500).json({ err: 'Error while streaming file' });
       });

       downloadStream.pipe(res).on('finish', () => {
           console.log('File successfully streamed to client');
       });
   })
  
});

app.post('/uploadBuildingImg', uploadBuildingImage.single('file'), (req, res) => {
   console.log('uploaded data')
    res.json({ file: req.file });
});

app.get('/filesBuilgindImg/:filename', (req, res) => {
   console.log(`Received request to retrieve file: ${req.params.filename}`);
    
   const filesCollection = conn.db.collection('buildingImages.files');

   filesCollection.findOne({ filename: req.params.filename })
   .then((result) => {
      const downloadStream = gfsImages.openDownloadStreamByName(result.filename);
       
       downloadStream.on('error', (error) => {
           console.error('Error while streaming file:', error);
           res.status(500).json({ err: 'Error while streaming file' });
       });

       downloadStream.pipe(res).on('finish', () => {
           console.log('File successfully streamed to client');
       });
   })
  
});

let transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com', // Replace with your SMTP server
   port: 465, // Port for TLS/STARTTLS
   secure: true, // True for 465, false for other ports
   auth: {
       user: 'karmaakubane@gmail.com', // Stored in environment variable
       pass: 'yguv rdak rhjz sved'  // Stored in environment variable
   }
});

app.post('/send-email', (req, res) => {
   const { to, subject, text, html } = req.body;
   console.log(req.body)
   // Set up email data
   let mailOptions = {
       from: `"Admin" <karmaakubane@gmail.com>`, // Sender address
       to: to, // List of recipients
       subject: subject, // Subject line
       text: text, // Plain text body
       html: html // HTML body
   };

   // Send email with defined transport object
   transporter.sendMail(mailOptions, (error, info) => {
       if (error) {
           console.error('Error while sending email:', error);
           return res.status(500).json({ error: 'Error while sending email' });
       }
       console.log('Message sent: %s', info.messageId);
       res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
   });
});


const userSchema = require('./Schema/UserDetail')

app.get('/', (req,res) => {
   res.send({status: 'Started'})
})

app.post('/register', async(req,res) => {
   const {name,password,email,verified,refImage,fileName,phone,studentid} = req.body
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
      fileName: fileName,
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

app.post('/addEmergencyInfo', async (req,res) => {

   const newAgency = req.body;
   console.log(newAgency)
   try {
     let emergencyInfo = await emergencyInfoSchema.findOne({});
     
     if (!emergencyInfo) {
       emergencyInfo = new emergencyInfoSchema({ dynamicAgencies: {} });
     }
     
     emergencyInfo.dynamicAgencies = { ...emergencyInfo.dynamicAgencies, ...newAgency };
     await emergencyInfo.save();
 
     res.json(newAgency);
   } catch (err) {
     res.status(500).send(err);
   }
})
app.put('/editEmergencyInfo', (req,res) => {
   const {id,fireStationNumbers,policeStationNumbers,cdrmmoNumbers,cpsoNumbers,ambulanceNumber,healthOfficeNumber,norecoNumbers,coastGuardNumbers,dynamicAgencies} = req.body

   emergencyInfoSchema.findByIdAndUpdate({_id:id},{
      fireStationNumbers: fireStationNumbers,
      policeStationNumbers: policeStationNumbers,
      cdrmmoNumbers: cdrmmoNumbers,
      cpsoNumbers: cpsoNumbers,
      ambulanceNumber: ambulanceNumber,
      healthOfficeNumber: healthOfficeNumber,
      norecoNumbers: norecoNumbers,
      coastGuardNumbers: coastGuardNumbers,
      dynamicAgencies: dynamicAgencies
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
   const { enrollmentData } = req.body;

   try {
     let enrollmentInfo = await Enrollment.findOne({});
 
     if (!enrollmentInfo) {
       enrollmentInfo = new Enrollment(enrollmentData);
     } else {
       Object.keys(enrollmentData).forEach((key) => {
         enrollmentInfo[key] = enrollmentData[key];
       });
     }
     
     const updatedInfo = await enrollmentInfo.save();
     res.json(updatedInfo);
   } catch (err) {
     res.status(500).send(err);
   }
})

app.get('/getEnrollmentProcess', (req,res) => {
   Enrollment.find()
   .then((result) => {res.json(result)})
   .catch((error) => {res.json(error)} )
})

const BuildingSearchInfo = require('./Schema/BuildingSearchInfo')
app.post('/addBuildingSearchInfo', async (req,res) => {
   const buildingInfo = req.body.buildingInfo;
   const building = new BuildingSearchInfo(buildingInfo);
   try {
     const newBuilding = await building.save();
     res.status(201).json(newBuilding);
   } catch (err) {
     res.status(400).json({ message: err.message });
   }
})
app.put('/editBuildingSearchInfo', async (req,res) => {
   const updatedBuildings = req.body.buildingInfo;
   try {
     await BuildingSearchInfo.deleteMany({});
     await BuildingSearchInfo.insertMany(updatedBuildings);
     res.json({ message: 'Building information updated successfully' });
   } catch (err) {
     res.status(500).json({ message: err.message });
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
