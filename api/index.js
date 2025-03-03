import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from "cookie-parser";
dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch((err)=>{
        console.log(err)
    });

const app = express()

app.use(express.json());
app.use(cookieParser)

app.listen(3000, ()=>{
    console.log('server is running on port 3000')
})

const __dirname = path.resolve()

// TODO: add routes



// TODO: add dist folder to serve static files
app.use(express.static(path.join(__dirname, 'client')));

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname,'client', 'index.html'));
})

app.use((err,req,res,next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})




