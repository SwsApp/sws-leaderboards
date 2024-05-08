//require("dotenv").config();
var express = require("express");
var moment = require("moment");
var cors = require("cors");
var https = require("follow-redirects").https;
var bodyParser = require("body-parser");
var app = express();

// var cron = require("node-cron");

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialectModule: pg,
// });

var envConfig = {
  BASE_URL: "https://api1.callyzer.co/api//v2/call-log/",
  ACCESS_TOKEN: "29313ee9-ae27-4401-8bf3-31a7d1bf72ce",
};

var port = 4000;
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.get("/leaderboards_weekly", async function (requestGet, response, next) {
  var postData = JSON.stringify({
    call_from: moment().startOf("week").unix(),
    call_to: moment().endOf("week").unix(),
  });
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": postData.length,
      authorization: `Bearer ${envConfig.ACCESS_TOKEN}`,
    },
  };

  var req = https.request(
    `${envConfig.BASE_URL}employee-summary`,
    options,
    function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        let final = JSON.parse(body.toString());

        console.log(final, "final");
        if (final?.result?.length > 0) {
          return response.status(200).send(final);
        } else {
          response.status(400).send(new Error("Failed to fetch leaderboards!"));
        }
      });

      res.on("error", function (error) {
        response.status(400).send(new Error("Failed to fetch leaderboards!"));
        console.error(error);
      });
    }
  );

  req.on("error", (err) => {
    reject(err);
  });

  req.on("timeout", () => {
    req.destroy();
    reject(new Error("Request time out"));
  });

  req.write(postData);

  req.end();
});

app.get("/leaderboards_daily", async function (requestGet, response, next) {
  var postData = JSON.stringify({
    call_from: moment().startOf("day").unix(),
    call_to: moment().endOf("day").unix(),
  });
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": postData.length,
      authorization: `Bearer ${envConfig.ACCESS_TOKEN}`,
    },
  };

  var req = https.request(
    `${envConfig.BASE_URL}employee-summary`,
    options,
    function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        let final = JSON.parse(body.toString());

        console.log(final, "final");
        if (final?.result?.length > 0) {
          return response.status(200).send(final);
        } else {
          response.status(400).send(new Error("Failed to fetch leaderboards!"));
        }
      });

      res.on("error", function (error) {
        response.status(400).send(new Error("Failed to fetch leaderboards!"));
        console.error(error);
      });
    }
  );

  req.on("error", (err) => {
    reject(err);
  });

  req.on("timeout", () => {
    req.destroy();
    reject(new Error("Request time out"));
  });

  req.write(postData);

  req.end();
});

app.listen(port, function () {
  console.log("CORS-enabled web server listening on port 4000");
});
