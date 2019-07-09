const express = require("express");
const app = express();

require("./routes").init(app);

app.listen(process.env.PORT || 3211, function () {
    console.log("Started.");
});