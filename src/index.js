
import express from "express";

const app = express();

app.post("/allCourse", function (req, res){
    res.send("HABABABA");
});

app.listen(3000, function(){
    console.log("tudo ok!");
});

export default app;
