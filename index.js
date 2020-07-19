const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const app = express();
app.use(formidable());
app.use(cors());
require("dotenv").config();
//MAILGUN
const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.get("/", (req, res) => {
  res.send("Server is up");
});
app.post("/", (req, res) => {
  const { firstname, lastname, email, title, message } = req.fields;
  //   const firstname = req.fields.firstname;
  //   const lastname = req.fields.lastname;
  //   const email = req.fields.email;
  //   const title = req.fields.title;
  //   const message = req.fields.message;
  /* CREATION DE L'OBJET DATA */
  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to:
      "guerpillon.gregory@gmail.com" /* EMAIL AVEC LAQUELLE VOUS VOUS ÊTES ENREGISTRÉS SUR MAILGUN */,
    subject: title,
    text: message,
  };
  console.log(data);
  /* ENVOI DE L'OBJET VIA MAILGUN */
  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      return res.status(200).json(body);
    }
    res.status(401).json(error);
  });
  //   res.status(200).json({ firstname, lastname, title, message });
});
app.all("*", (req, res) => {
  res.json({ message: "page introuvable" });
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
