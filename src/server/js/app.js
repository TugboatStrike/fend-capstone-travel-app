
// per jest Separate your app and Server
// The reason behind this is that it wont listen to the port after testing

//app.js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

module.exports = app;
