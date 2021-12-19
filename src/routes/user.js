
//const { use } = require("express/lib/application");
//const { findById } = require("../models/users");
//const { use } = require("express/lib/application");
//const { findById } = require("../models/users");

const express = require("express");
const router = express.Router();
const User = require("../models/users");
const auth = require("../middleware/auth");
const multer = require("multer");



// post user: sign up

// create: post
// find: get
//update: patch
//delete: delete

/*

before token

router.post("/users" , function(req , res)
{
    const user = new User(req.body);
    user.save().then(function()
    {
        res.status(200).send(user);
    }).catch(function(error)
    {
        res.status(400).send(error);
    })
})
*/



// after token

router.post("/users" , async function(req , res)
{
    try
    {
        const user = new User(req.body);
        const token = await user.generateToken();
        res.status(200).send({user , token});

    }
    catch(error)
    {
        res.status(400).send(error.message);
    }

    /*

    const user = new User(req.body);
    user.save().then(function()
    {
        res.status(200).send(user);
    }).catch(function(error)
    {
        res.status(400).send(error);
    })
    */
})




router.get("/users" , auth , function(req , res)
{
    console.log(req.user)
    User.find({}).then((users)=>
    {
        res.status(200).send(users);
    }).catch((error)=>
    {
        res.status(500).send(error);
    })
})

router.get("/users/:id" , auth , function(req , res)
{
    const ourId = req.params.id;
    User.findById(ourId).then((user)=>
    {
        console.log(user);
        if(!user)
        {
            return res.status(404).send("Unable to find the user");
        }
        
        res.status(200).send(user)
    }).catch((error)=>
    {
        res.status(500).send(error);
    })
})


////////////////////////////////


// note: (req , res)
// req deals with the url and the data


// before hashing password
/*
router.patch("/users/:id" , async function(req , res)
{
    var ourKeys = Object.keys(req.body);
    
    if(ourKeys.indexOf("email") != -1 || ourKeys.indexOf("password") != -1)
    {
        return res.status(400).send("Neither email nor password can be updated");
    }

    try
    {
        const ourId = req.params.id;

        const user = await User.findByIdAndUpdate(ourId , req.body ,
            {
                new: true,
                runValidators: true
            });
            if(!user)
            {
                return res.status(404).send("user not found");
            }
            res.status(200).send(user);
    }
    
    catch(error)
    {
        res.status(500).send(error.message);
    }

})
*/


// after password hash



router.patch("/users/:id" , auth , async function(req , res)
{
    const ourKeys = Object.keys(req.body);
    
    if(ourKeys.indexOf("email") != -1)
    {
        return res.status(400).send("Neither email nor password can be updated");
    }

    try
    {
        const ourId = req.params.id;

        const user = await User.findById(ourId);
        if(!user)
        {
            return res.status(404).send("user not found");
        }
        console.log(user)

        for(var i = 0; i < ourKeys.length; i++)
        {
            user[ourKeys[i]] = req.body[ourKeys[i]];
        }
        
        //ourKeys.forEach((el)=>(user[el] = req.body[el]));
        await user.save();
        res.status(200).send(user);
    }

    catch(error)
    {
        res.status(500).send(error.message);
    }

})






router.delete("/users/:id" , auth , async function(req , res)
{
    try
    {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if(!user)
        {
            return res.status(404).send("user not found");
        }
        res.status(200).send(user);
    }
    
    catch(error)
    {
        res.status(500).send(error);
    }
    //User.find
})


router.post("/login" , async function(req , res)
{
    try
    {
        const user = await User.findByCredentials(req.body.email , req.body.password);
        const token = await user.generateToken();
        res.status(200).send({user , token});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
    console.log(req.body);

    //req.header("Authorization") = `Bearer ${token}`;
})


router.get("/profile" , auth , function(req , res)
{
    res.status(200).send(req.user);
})

router.delete("/logout" , auth , async function(req , res)
{
    console.log(req.user)
    try
    {
        req.user.tokens = req.user.tokens.filter((el)=>
        {
            return el !== req.token
        })
        await req.user.save();
        res.status(200).send("logged out successfully");
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }

})

router.delete("/logoutall" , auth , async function(req , res)
{
    try
    {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send("loggoed out all successfully");
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
})

const uploads = multer(
    {
        limits:
        {
            fileSize: 1000000
        },
        fileFilter(req , file , cb)
        {
            if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/))
            {
                cb(new Error("please upload an image"));
            }
            cb(null , true);
        }
    }
)

router.post("/profile/avatar" , auth , uploads.single("avatar") , async function(req , res)
{
    try
    {
        req.user.avatar = req.file.buffer;
        await req.user.save();
        res.status(200).send();
    }
    catch(e)
    {
        res.status(400).send(e.message);
    }
})

module.exports = router