const express=require('express');
const jwt=require('jsonwebtoken');
const app=express();

const jwtPassword='xyz123';
const users=[{
    name: 'Navyanth',
    username:'navyanth@gmail.com',
    password:'123456'
},{
    name: 'Anurag',
    username:'anurag@gmail.com',
    password:'789101112'
},{
    name: 'Goutham',
    username: 'goutham@gmail.com',
    password: 'abcdef'
}]

app.use(express.json());

function verifyUser(username,password){
    return users.find(user=>user.username===username && user.password===password);
}

app.post('/signin',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    if(!verifyUser(username,password))return res.status(404).json({msg:'Please provide correct credentials'});
    const token=jwt.sign({username:username, password: password}, jwtPassword);
    res.status(200).json({msg: 'you are logged succesfully', token: token});
})

app.get('/users',(req,res)=>{
    const token=req.headers.authorization;
    try {
        const response=jwt.verify(token,jwtPassword);
        const username=response.username;
        const others= users.filter((user)=>user.username!==username);
        res.status(200).json({msg:'success',data:others});
    } catch (error) {
        res.status(401).json({msg:'unauthorized access'});
    }
})


app.listen(5000,()=>console.log('Listening on port 5000.....'));