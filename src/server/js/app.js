
// per jest Separate your app and Server
// The reason behind this is that it wont listen to the port after testing
// set up per
// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest

//app.js
const express = require("express");
const app = express();

app.use(express.static('dist'))

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

module.exports = app;
