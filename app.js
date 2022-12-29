//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const fs = require("fs");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsondata = JSON.stringify(data);

  fs.readFile(__dirname + "/apiKeys.json", (err, data) => {
    if (err) throw err;
    const apiDetails = JSON.parse(data);

    const url =
      "https://us21.api.mailchimp.com/3.0/lists/" + apiDetails.list_id;
    const options = {
      method: "POST",
      auth: "benzter:" + apiDetails.api_key,
    };

    const request = https.request(url, options, function (response) {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
        console.log(response);
      }
      // response.on("data", function (data) {
      //   console.log(JSON.parse(data));
      // });
    });

    request.write(jsondata);
    request.end();
  });
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is succesfully started on port 3000");
});
