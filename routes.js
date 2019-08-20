const express = require("express");
const auth = require('http-auth');

const bridge = require("./bridge");
bridge.initDB();

let dashSec = auth.basic({ realm: 'dashboard' }, function (username, password, callback) {
    callback(username == 'admin' && password == 'p455w0rd');
});

let dashAuthMiddleware = auth.connect(dashSec);

const allowedProjects = [
    "website",
    "wanilla",
    "teabotre",
    "ama",
    //"teabot",
    "noter",
    "all"
];
const allowedTypes = [
    "all",
    "post",
    "release",
    "issue",
];

module.exports = {
    init: function (app) {
        app.use(express.static('public'));

        app.get("/dash", dashAuthMiddleware, function (req, res) {
            res.send("You made iititti");
        });

        
        app.get("/", function (req, res) {
            res.send("Wanilla API.");
        });

        app.get("/api/timeline/:project/:type", async function (req, res) {
            const project = req.params.project;
            const type = req.params.type;

            if (!allowedProjects.includes(project)) {
                res.status(400).send("Invalid project");
                return false;
            }
            if (!allowedTypes.includes(type)) {
                res.status(400).send("Invalid type");
                return false;
            }

            try {
                let timelineData = await bridge.getTimeline(null,project,type);
                res.json(timelineData);
            }catch(e){
                res.status(500).send(e);
            }
        });

        app.get("/api/build_numbers/:project", async function (req, res) {
            let _project = req.params.project;

            if (!allowedProjects.includes(_project)) {
                res.status(400).send("Invalid project");
                return false;
            }
            
            let projects = [];

            if (_project == 'all') {
                for (const projectName of allowedProjects) {
                    if (projectName == 'all') continue;

                    try {
                        projects.push(await bridge.getLatestChangelogs(projectName));
                    }catch(e){
                        res.status(500).send(e);
                        console.log(e);
                        return false;
                    }
                }
            }

            for (let project of projects) {
                if (project.alpha.length < 1) {project.alpha = false;}
                if (project.beta.length < 1) {project.beta = false;}
                if (project.stable.length < 1) {project.stable = false;}

                if (project.alpha) {
                    project.alpha = project.alpha[0].build + " alpha";
                }
                if (project.beta) {
                    project.beta = project.beta[0].build + " beta";
                }
                if (project.stable) {
                    project.stable = project.stable[0].build;
                }
            }

            res.json(projects);
        });
    }
};