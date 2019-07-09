const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

require("./routes").init(app);

app.listen(process.env.PORT || 3211, function () {
    console.log("Started.");
});