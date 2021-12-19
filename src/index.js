var express = require("express");

require("dotenv").config();

require("./db/mongoose");

var userRoute = require("./routes/user");

const bcrypt = require("bcryptjs");

var taskRoute = require("./routes/task");

const app = express();

const port = process.env.PORT || 3000;



// automatic parse
app.use(express.json());

app.use(userRoute);

app.use(taskRoute);

/*
app.get("/users" , function(req , res)
{
    res.send("Testing");
})
*/




app.listen(port , function()
{
    console.log("listening on port " + port);
})





/*


api news: a5bar

Schemas (reporter and news)

reporter: name: password: phoneNumber: age: email
{
    name,
    email
    age
    phoneNumber
    password
}

all fields are required except age

password: hashed

sign up and login

all crud operators

news:
{
    title
    description
    reporter (owner)
    date(  built in mongoose SEARCH (created at and updated at)  ) of post


    DEADLINE: Tuesday 10:00 pm
}


*/