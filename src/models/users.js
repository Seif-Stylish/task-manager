const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const multer = require("multer");

//const { use } = require("../routes/user");

const userSchema = mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        trim: true
    },
    email:
    {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Email is invalid");
            }
        }
    },
    age:
    {
        type: Number,
        default: 20,
        validate(value)
        {
            if(value < 0)
            {
                throw new Error("age must be positive");
            }
        }   
    },
    password:
    {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tokens:
    [
        {
            type: String,
            required: true
        }
    ],
    avatar:
    {
        type: Buffer
    }
})

userSchema.pre("save" , async function(next)
{
    const user = this;
    console.log(user);
    if(user.isModified("password"))
    {
        user.password = await bcrypt.hash(user.password , 8);
    }
    next();
})

userSchema.statics.findByCredentials = async function(email , password)
{
    const user = await User.findOne({email});
    // console.log(user)

    if(!user)
    {
        throw new Error("unable to login... please check email or password");
    }

    const isMatch = await bcrypt.compare(password , user.password);
    
    if(!isMatch)
    {
        throw new Error("unable to login... please check email or password");
    }

    return user;
}

userSchema.methods.generateToken = async function()
{
    const user = this;
    const token = jwt.sign({_id: user._id.toString()} , process.env.JWT_SECRET);
    user.tokens = user.tokens.concat(token);

    await user.save();

    return token;
}

userSchema.methods.toJSON = function()
{
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.virtual("tasks" ,
{
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
});

const User = mongoose.model("User" , userSchema);

module.exports = User