const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

const mongooseUrl = "mongodb+srv://admin:NgNSzeoN3QXq72Vv@cluster0.jhovera.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongooseUrl)
.then(()=>{
   console.log('Database Connected')
})
.catch(()=>{
   console.log('Database Failed to Connect')
})

const userSchema = require('./Schema/UserDetail')

app.get('/', (req,res) => {
   res.send({status: 'Started'})
})

app.post('/register', async(req,res) => {
   const {name,password,email,phone,studentid} = req.body
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
   const {name,password,email,phone,studentid,id} = req.body
    console.log(req.body)
   userSchema.findByIdAndUpdate({_id: id}, {
      name: name,
      email: email,
      phone: phone,
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
     const {latitude,longitude,title,numFloors,numRooms,grounds,seconds,thirds,fourths} = req.body

     buildingInfoSchema.create({
      latitude: latitude,
      longitude: longitude,
      title: title,
      numFloors: numFloors,
      numRooms: numRooms,
      roomGroundFloor: grounds,
      roomSecondFloor: seconds,
      roomThirdFloor: thirds,
      roomFourthFloor: fourths
     })
     .then((result) => res.json(result) )
     .catch((error) => res.json(error))
})

app.get('/getBuilding', (req,res) => {
   console.log('send building info')
   buildingInfoSchema.find()
   .then((result) => {res.json(result)})
   .catch((error) => {res.json(error)} )
})

app.listen(3003,()=>{
   console.log('Server has Started')
})