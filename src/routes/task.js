const Task = require("../models/task");
const auth = require("../middleware/auth");
const express = require("express"); 
const router = express.Router();


router.post("/tasks" , auth , async function(req , res)
{
    try
    {
        var task = new Task({...req.body , owner: req.user._id});
        await task.save();
        res.status(201).send(task);
    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
})
/*
router.get("/tasks" , async function(req , res)
{
    try
    {
        const user = await Task.find({});
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
})
*/

router.get("/tasks/:id" , auth , async function(req , res)
{
    try
    {
        const ourId = req.params.id;
        const task = await Task.findOne({_id:ourId, owner:req.user._id});
        console.log(task);
        if(!task)
        {
            return res.status(404).send("user not found");
        }
        res.status(200).send(task);
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
})

router.patch("/tasks/:id" , auth , async function(req , res)
{

    var tasksKeys = Object.keys(req.body);
    if(tasksKeys.indexOf("title") != -1)
    {
        return res.status(400).send("title can't be updated");
    }

    try
    {
        var ourId = req.params.id;
        var task = await Task.findOne({_id: ourId , owner: req.user._id});
        if(!task)
        {
            return res.status(404).send("this task does not exist");
        }

        for(var i = 0; i < tasksKeys.length; i++)
        {
            task[tasksKeys[i]] = req.body[tasksKeys[i]];
        }

        await task.save();

        res.status(200).send(task)

        console.log(task)

    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
})

router.delete("/tasks/:id" , auth , async function(req , res)
{
    try
    {
        const ourID = req.params.id;
        const task = await Task.findOneAndDelete({_id: ourID , owner: req.user._id});
        if(!task)
        {
            return res.status(404).send("this task does not exist");
        }
        res.status(200).send(task);
        
    }
    catch(error)
    {
        res.status(500).send(error);
    }
})

router.get("/tasks" , auth , async function(req , res)
{
    try
    {
        //const tasks = await Task.find({});
        await req.user.populate("tasks");
        res.send(req.user.tasks);
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
})



module.exports = router;