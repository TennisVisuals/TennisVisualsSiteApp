// server.js
// Copyright 2015-2017 Charles Allen -- All Rights Reserved

// scoped variables
var port = process.env.PORT || 8080;
var static_files = "/app/static/";

// external module dependencies
var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var compress = require("compression");

var fs = require("fs");
var dns = require("dns");
var util = require("util");
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Database Connection
// ===========================================================================
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var models = require("./models")(mongoose);

// set environment
// mongoose.connect('mongodb://aip:t3nn15@localhost:27017/abstract');

// ===========================================================================
app.set("views", "app/views");
app.set("view engine", "jade");

app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));
app.use(compress());

// ROUTERS
// =============================================================================
var tava_router = require("./app/routes/tava.js")(models);
var api_router = require("./app/routes/api.js")(models);

// ROUTES -------------------------------
app.use("/", express.static(__dirname + static_files));
app.use("/", tava_router);
app.use("/api", api_router);

// Handle 404
app.use(function (req, res) {
  res.status(404);
  var ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  var ref = req.headers ? req.headers.referer : "";

  var message = util.format(ip) + " " + req.url + " " + ref;
  // console.log('404:', message);
  var options = { root: "./app/static" };
  res.sendFile("index.html", options);
});

// Handle 500
app.use(function (error, req, res, next) {
  console.log("Internal Server Error: ", error);
  res.status(500);
  url = req.url;
  res.render("500", {
    title: "500: Internal Server Error",
    url: url,
    message: "500: Internal Server Error",
  });
});

// START THE SERVER
// =============================================================================

var server = require("http").Server(app);
server.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("--------------------- AiP ---------------------");
  console.log(new Date());
  console.log("host=" + host + " port=" + port);
  console.log("...............................................");
});

// External Log
function zeroPad(number) {
  return number.toString()[1] ? number : "0" + number;
}

server.on("request", function (req, res) {
  var ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  var ua = req.headers["user-agent"];
  var user_agent = ua ? ua.split(")")[0] : "";
  var nowDate = new Date();
  // var date = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
  var date = [
    nowDate.getFullYear(),
    zeroPad(nowDate.getMonth() + 1),
    zeroPad(nowDate.getDate()),
  ].join("-");
  var message = [date, util.format(ip), req.originalUrl, user_agent].join("; ");
  if (
    req.originalUrl &&
    (req.originalUrl.indexOf("/report") >= 0 ||
      req.originalUrl.indexOf("examples") >= 0 ||
      req.originalUrl.indexOf("playerName") >= 0)
  ) {
    console.log("page:", message);
  }
});
