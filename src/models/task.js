//const { mongo } = require("mongoose");
const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
    {
        title:
        {
            type: String,
            required: true
        },
        description:
        {
            type: String,
            required: true
        },
        completed:
        {
            type: Boolean,
            default: false
        },
        owner:
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    }
)

const Task = mongoose.model("Task" , taskSchema);

module.exports = Task