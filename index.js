const dotenv = require('dotenv');
const http = require('http');
const fs = require('fs');
const express = require("express");
var requests = require("requests");
const app = express();
//
dotenv.config({path:'./.env'});
// html file
const homeFile = fs.readFileSync("home.html" , "utf-8");
//port
const PORT = process.env.PORT || 3000;

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
    return temperature;
}

//const server = http.createServer((req,res) =>{
 app.route('/')
     .get((req,res) =>{
    // if (req.url == "/") {
        requests(
            `http://api.openweathermap.org/data/2.5/weather?q=Dhaka&appid=${process.env.APP_ID}&units=metric`
        )
        .on("data", (chunk)=>{
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            
            const realTimeData = arrData
                    .map((val)=>replaceVal(homeFile, val))
                    .join("");

            res.write(realTimeData);
        })
        .on("end",(err)=>{
            if(err) return console.log("error",err);
            res.end();
        })
    })
       
//})

app.listen(PORT,()=>{
    console.log('running');
});
