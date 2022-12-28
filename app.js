//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
// const { response } = require('express');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const data = {
        members:[{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstName,
                LNAME:lastName}}
            ]
    }

    const jsondata = JSON.stringify(data);
   
   
    const url = "https://us21.api.mailchimp.com/3.0/lists/112eeb3a20"
    const options = {
        method:"POST",
        auth:"Benzter:790380658db5b5b8e819f1ae07b3a744-us21"
    }

    const request = https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname +"/failure.html");
        }
        // response.on("data",function(data){
        //     console.log(JSON.parse(data));
        // })
    });

    request.write(jsondata);
    request.end();
})

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server is succesfully started on port 3000")
})



// 790380658db5b5b8e819f1ae07b3a744-us21
// 112eeb3a20