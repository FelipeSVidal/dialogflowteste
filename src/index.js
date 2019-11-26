
const express = require("express");
const port = process.env.PORT || 4000;

const app = express();

app.post("/allCourse", function (req, res){
    res.send("HABABABA");
});

app.get("/", function(req,res){
    res.send("WECOM");
});

app.listen(port, function(){
    console.log("tudo ok!");
});

module.exports = app;
