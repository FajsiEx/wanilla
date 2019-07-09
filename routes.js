const express = require("express");
const auth = require('http-auth');

const bridge = require("./bridge");
bridge.initDB();

let dashSec = auth.basic({ realm: 'dashboard' }, function (username, password, callback) {
    callback(username == 'admin' && password == 'p455w0rd');
});

let dashAuthMiddleware = auth.connect(dashSec);

module.exports = {
    init: function (app) {
        app.use(express.static('public'));

        app.get("/dash", dashAuthMiddleware, function (req, res) {
            res.send("You made iititti");
        });

        
        app.get("/", function (req, res) {
            res.send("Wanilla API.");
        });
        app.get("/api/timeline", async function (req, res) {
            try {
                let timelineData = await bridge.getTimeline();
                res.json(timelineData);
            }catch(e){
                res.status(500).send(e);
            }
        });
    }
};