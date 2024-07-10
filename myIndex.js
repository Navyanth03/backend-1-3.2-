const express=require('express');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
require('dotenv').config();
const app=express();
const jwtPassword='xyz123';

const user=mongoose.model('users',{ name: String, email: String, password: String});

app.use(express.json());

app.post('/signup',async(req,res)=>{
    const name=req.body.name;
    const email=req.body.email.toLowerCase();
    const password=req.body.password;
    const existingUser=await user.findOne({email:email});
    if(existingUser){
        return res.status(400).json({msg:'User exists, please signin'});
    }
    const newUser=await user.create({name:name,email:email,password:password});
    res.status(201).json({msg:'Hurray, you have created an acoount',data:newUser});
})

app.post('/signin',async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const existingUser=await user.findOne({email:email,password:password});
    if(!existingUser){
        return res.status(404).json({msg:'Please provide correct credentials'});
    }
    const token=jwt.sign({email:email, password: password}, jwtPassword);
    res.status(200).json({msg: 'logged in succesfully', token: token});
})

app.get('/users',async(req,res)=>{
    const token=req.headers.authorization;
    try {
        const response=jwt.verify(token,jwtPassword);
        const email=response.email;
        let others=await user.find({});
        //test
        others=others.filter((data)=>data.email!==email);
        res.status(200).json({msg:'success',data:others});
    } catch (error) {
        res.status(401).json({err:error,msg:'unauthorized access'});
    }
})


async function start(){
    try {
        await mongoose.connect(process.env.database_Url);
        console.log('Connected to database...');
        app.listen(5000,()=>console.log('Listening on port 5000.....')); 
    } catch (error) {
        console.log(err);
    }
}

start();