const DB_URI = process.env.DB_URI;
const MongoClient = require('mongodb').MongoClient;

let client, db;

// Status:
// 0 - initial: no even attempted to connect yet
// 1 - connected
// 2 - failed to connect in the first place
// 3 - got disconnected
let dbConnStatus = 0;

module.exports = {
    // * Connection management methods

    initDB: async function () {
        try { // To connect to Wanilla mongoDB
            console.log("[DB] Trying to connect to db...");
            connectedClient = await MongoClient.connect(DB_URI, {
                bufferMaxEntries: 0, // If there's an error, throw it instead of waiting on reconnect!
                reconnectTries: Number.MAX_VALUE, // Reconnect as many times as you can! 1.79E+308 should be enough...
                reconnectInterval: 1000, // Try to reconnect every second
                autoReconnect: true,
                useNewUrlParser: true
            });

            client = connectedClient;
            db = client.db('web');

            db.on('close', () => {
                console.log("Connection closed for some reason. Will try to reconnect.");
                dbConnStatus = 3; // Got disconnected.
            });
            db.on('reconnect', () => {
                console.log("Reconnected to db.");
                dbConnStatus = 1; // Connected. again.
            });

            console.log("[DB] Connected to the database");
            dbConnStatus = 1; // Connected.
            return client;
        } catch (e) {
            dbConnStatus = 2; // Failed to connect.

            client = false;
            db = false;

            console.error("Failed to connect to db! " + e);

            setTimeout(this.initDB, 5000);
            return;
        }
    },

    isDBReady: function () {
        switch (dbConnStatus) {
            case 0:
                console.log("[DBSTAT] Database connection not yet tried");
                return false;
            case 1:
                return true;
            case 2:
                console.log("[DBSTAT] Failed to connect to database. Retrying in the background.");
                return false;
            case 3:
                console.log("[DBSTAT] Got disconnected from the database. Retrying in the background.");
                return false;
            default:
                throw ("Unknown dbConnStat:" + e);
        }
    },

    web: {

        getTimeline: async function (limitArg, project, type) {
            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }

            limitInt = limitArg || 10;

            let filter = {}
            if (project != 'all') {
                filter.project_id = project;
            }
            if (type != 'all') {
                filter.type = type;
            }

            let events;
            try {
                events = await db.collection("timeline").find(filter).sort({ time: -1 }).limit(limitInt).toArray();
            } catch (e) {
                throw ("Could not get docs from collection: " + e);
            }

            return events;
        },

        getLatestChangelogs: async function (project) {
            if (dbConnStatus != 1) throw ("Database error. !DB!");
            let events;


            let alphaChangelog, betaChangelog, stableChangelog;

            // Get alpha changelog
            try {
                alphaChangelog = await db.collection("timeline").find({ project_id: project, tag: 'alpha', type: "release" }).sort({ time: -1 }).limit(1).toArray();
            } catch (e) {
                throw ("Could not get alpha docs from collection: " + e);
            }
            // Get beta changelog
            try {
                betaChangelog = await db.collection("timeline").find({ project_id: project, tag: 'beta', type: "release" }).sort({ time: -1 }).limit(1).toArray();
            } catch (e) {
                throw ("Could not get beta doc from collection: " + e);
            }
            // Get stable changelog
            try {
                stableChangelog = await db.collection("timeline").find({ project_id: project, tag: { $exists: false }, type: "release" }).sort({ time: -1 }).limit(1).toArray();
            } catch (e) {
                throw ("Could not get stable doc from collection: " + e);
            }

            return {
                id: project,
                alpha: alphaChangelog,
                beta: betaChangelog,
                stable: stableChangelog
            };
        }
    }
};