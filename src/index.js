
const express = require("express");

const app = express();

app.post("/allCourse", function (req, res){
    res.send("HABABABA");
});

app.get("/", function(req,res){
    res.send("WECOM");
});

app.listen(4000, function(){
    console.log("tudo ok!");
});

module.exports = app;
