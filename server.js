const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}));
require("./routes").init(app);

app.listen(process.env.PORT || 3211, function () {
    console.log("Started.");
});