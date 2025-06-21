import mongoose from "mongoose";
import bcrypt from 'bcryptjs'


const userSchema = new mongoose.Schema({
    name : {
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },

    
    password:{
        type:String,
        require:true
    },
   
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const UserModel = new mongoose.model('userSchema',userSchema)
export default UserModel