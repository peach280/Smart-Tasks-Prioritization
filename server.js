import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from 'cors'
import users from './model/users.js'
import bcrypt from 'bcrypt'
import Task from './model/tasks.js'
import jwt from 'jsonwebtoken';
dotenv.config()
const url=process.env.MONGO_URL
const port = process.env.PORT
const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect(url)
    .then(()=>{
        console.log("connected")
        app.listen(port,()=>{
            console.log("c")
        })
    })
    .catch((error)=>{
        console.log(error)
    })
    

   
    const verifyToken = (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }
    
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.userId = decoded.id; 
            next();
        });
    };
app.post('/register',async (req,res)=>{
   
    const {username,password} = req.body;
    console.log("je")
    try {
        console.log(username)
        const existingUser = await users.findOne({username})
        if(existingUser){
            return res.status(400).json({message:'This username is already in use'})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new users({
            username,
            password:hashedPassword
        })
        await newUser .save()
        const token = jwt.sign({ id: newUser ._id }, `${process.env.JWT_SECRET}`, { expiresIn: '1h' }); // Generate token
        res.status(200).json({ message: 'Registration successful', id: newUser ._id, token })
    }
    catch (error) {
        console.log(error)
    }
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser  = await users.findOne({ username });
        if (existingUser ) {
            
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (isPasswordValid) {
                const token = jwt.sign({ id: existingUser ._id }, `${process.env.JWT_SECRET}`, { expiresIn: '1h' }); // Generate token
                res.status(200).json({ message: 'Login successful', id: existingUser ._id, token }); // Send token
            } else {
                return res.status(400).json({ message: 'Incorrect password' });
            }
        } else {
            return res.status(400).json({ message: 'Not registered' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/addtasks', verifyToken, async (req, res) => {
    const userId = req.userId; 
    try {
        const tasks = await Task.find({ userId }).sort({ priority: -1 }); 
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/addtasks', verifyToken, async (req, res) => {
    const { task, priority } = req.body;
    const userId = req.userId; 
    console.log(userId)
    const newTask = new Task({ task, priority, userId });

    try {
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.put('/markAsDone', verifyToken, async (req, res) => {
    const { id, completed } = req.body;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        
        if (task.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        task.completed = completed;
        await task.save();
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});