const timelineData = [
    {
        type: "release",
        project: "Website",
        build: "19.7.9:1",
        changes: {
            updated: [
                "Replace tags with normal text"
            ],
            fixed: [
                "Change text width - lines were cut way before the end of their container",
                "Line spacing being too big"
            ],
            code: [
                "Use API instead of dummy data"
            ]
        }
    },
    {
        type: "release",
        project: "Website",
        build: "19.7.9",
        changes: {
            added: [
                "Dark gradient background to navbar",
                "Finally added the footer",
                "Tooltips to change tags on hover",
                "F logo has purple hover color"
            ],
            removed: [
                "Sample changelog entry"
            ],
            code: [
                "Use variables for colors instead of hard-coding them",
                "Changed 'modified' to 'updated'"
            ]
        }
    },
    {
        type: "release",
        project: "Website",
        build: "19.7.8",
        description: "Finally removed the placeholders and added a changelog",
        changes: {
            added: [
                "This changelog"
            ],
            updated: [
                "Navbar icons to stay on the right on all devices"
            ],
            fixed: [],
            removed: [
                "Placeholders",
                "Mouse parallax effect"
            ],
            code: [
                "Added basic HTML generation and dummy data in preparations for API calls"
            ]
        }
    },
    {
        type: "release",
        project: "Noter",
        build: "19.7.8",
        tag: "alpha",
        changes: {
            added: [
                "Local storage to remember last theme used and to display that theme on next launch"
            ]
        }
    },
    {
        type: "release",
        project: "Tea-bot Re:Write",
        build: "19.7.7",
        tag: "beta",
        changes: {
            added: [
                "Splash strings to config and their picker",
                "Color subspecial",
            ],
            updated: [
                "Discord onready event to display random splash string in the console",
                "!info:about to use the random splash string"
            ],
        }
    }
];

module.exports = {
    init: function (app) {
        app.get("/", function (req, res) {
            res.send("Wanilla API.");
        });
        app.get("/api/timeline", function (req, res) {
            res.json(timelineData);
        });
    }
};