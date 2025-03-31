import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from  'dotenv'
import authRoute from './Routes/auth.js'
import userRoute from './Routes/user.js'
import doctorRoute from './Routes/doctor.js'
import reviewRoute from './Routes/review.js'
import bookingRoute from './Routes/booking.js'


dotenv.config()

const app=express()
const port=process.env.PORT || 8000

const corsOptions={
    origin:true
}
app.get('/',(req,res)=>{
    res.send('Hello World!')
})
//database connection
mongoose.set('strictQuery',false)
const connectDB=async()=>{
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Database is Connected")
    } catch (error) {
        console.log("MongoDb database is connection failed",error);
    }
}

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/users',userRoute)
app.use('/api/v1/doctors',doctorRoute)
app.use("/api/v1/reviews",reviewRoute)
app.use("/api/v1/booking",bookingRoute)

//routes


app.listen(port,()=>{
    connectDB();
    console.log(`Server is running on ${port}`)
})
