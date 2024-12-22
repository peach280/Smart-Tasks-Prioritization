import mongoose from "mongoose";
const userSchema = mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }
    }
)
const users = mongoose.model('users',userSchema)
export default users
