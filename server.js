const express = require("express");
const app = express();

require("./routes").init(app);

app.listen(3211, function () {
    console.log("Started.");
});