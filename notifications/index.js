const nodemailer = require("nodemailer");
const { consumeMessages } = require("./kafka");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Notification = require("./notificationSchema");

dotenv.config();


// connect to DB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MONGODB CONNECTED WITH NOTIFICATION SERVICE");
}).catch((err) => {console.log("ERROR WHILE CONNECTING TO MONGODB => ", err)});



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "temp07066@gmail.com",
        pass: "mrycavaanedovpnv"
    }
});


// function that actually sends the email
const sendEmail = async ({ email, name , userId }) => {
    try {
        const response = await transporter.sendMail({
            from: "temp07066@gmail.com",
            to: email,
            subject: "Welcome to Kafka world",
            html: `<p> Welcome ${name} to this Kafka world </p>`
        });

        await Notification.create({
            to: email,
            message: `<p> Welcome ${name} to this Kafka world </p>`,
            response,
            userId
        })

        console.log("EMAIL SENT SUCCESSFULLY TO:", email);

    } catch (err) {
        console.error("EMAIL SEND ERROR:", err);
    }
};


// 🔥 THIS is where you were missing Kafka consuming!
consumeMessages("user-created", sendEmail);


console.log("Email service is listening for Kafka messages...");
