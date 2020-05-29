var mongoose=require("mongoose");

var contactSchema = new mongoose.Schema({
    name:String,
    dob: Date,
    phone:[
        {
            type:Number,
            unique: true,
        }
    ],
    email:[
        {
            type:String
        }
    ]
})

module.exports = mongoose.model("Contact", contactSchema);