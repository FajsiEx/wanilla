const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

require("./routes").init(app);

app.listen(process.env.PORT || 3211, function () {
    console.log("Started.");
});