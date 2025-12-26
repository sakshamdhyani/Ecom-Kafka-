const mongoose = require("mongoose");
const {Schema} = mongoose;

const notificationSchema = new Schema({


    to: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    response: {
        type: Object
    },

    userId:{
        type: String
    }


},{timestamps: true});


module.exports = mongoose.model("Notifications" , notificationSchema);