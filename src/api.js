const express = require('express');
const nodemailer = require('nodemailer');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

app.use(express.json());

const validateApiKey = async (req, res, next) => {
  const apiKey = req.header('Authorization');
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  
  if (apiKey !== process.env.API_KEY) {
    console.log(apiKey,process.env.API_KEY)
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

app.use(validateApiKey)

app.get("/api", async (req,res)=>{
  res.status(200).send('Welcome to STMP server')
})

app.post("/api/send-email", async (req, res) => {
  const { to, subject, body } = req.body;

  console.log(process.env.EMAIL_USER)
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // SMTP server host
    port: 465,               // Port for SSL
    secure: true,            // Use SSL
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  let mailOptions = {
    from: "polane82@gmail.com",
    to,
    subject,
    text: "ukgkgkj",
  };

  try {
    console.log(mailOptions)
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error sending email', error });
  }
});

module.exports.handler = serverless(app);
