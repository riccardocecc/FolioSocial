import mongoose from 'mongoose'

let isConnected = false;

export const connectToDB = async () =>{
    mongoose.set('strictQuery', true)

    if(!process.env.MONGODB_URL)
        return console.log("mongodb url not fonude")
    if(isConnected)
        return console.log("Already connected")

    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected = true;
        console.log("Connected to mongodb")
    } catch (error) {
        console.log(error)
    }
}