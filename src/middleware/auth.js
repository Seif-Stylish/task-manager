const jwt = require("jsonwebtoken");
const User = require('../models/users');

const auth = async function(req , res , next)
{
    try
    {
        const token = req.header("Authorization").replace("Bearer " , "");

        const decode = jwt.verify(token , process.env.JWT_SECRET);

        console.log(decode);

        const user = await User.findOne({_id: decode._id , tokens: token});

        if(!user)
        {
            throw new Error("this user does not exist");
        }

        req.user = user;
        req.token = token;

        next();
    }
    catch(e)
    {
        res.status(401).send(
            {
                error: "Please Authenticate"
            }
        )
    }
}

module.exports = auth