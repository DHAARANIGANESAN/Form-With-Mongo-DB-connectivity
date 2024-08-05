const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 4055;

app.use(bodyParser.urlencoded({ extended: true }));

const mongoUrl = "mongodb://localhost:27017";
const dbName = "end";
let db;

MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        db = client.db(dbName);
        console.log("Connected to the database");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/mongo.html");
});

app.post("/insert", async (req, res) => {
    const { name, lname, mailid, age, address, date } = req.body;

    try {
        await db.collection("sem").insertOne({ name, lname, mailid, age, address, date });
        res.send("Inserted");
    } catch (err) {
        console.error("Error inserting:", err);
        res.status(500).send("Could not insert");
    }
});

app.post("/update", async (req, res) => {
    const { name, lname, mailid, age, address, date } = req.body;

    try {
        await db.collection("sem").updateOne({ name: name }, { $set: { lname, mailid, age, address, date } });
        res.send("Updated");
    } catch (err) {
        console.error("Error updating:", err);
        res.status(500).send("Could not update");
    }
});

app.post("/delete", async (req, res) => {
    const { name } = req.body;

    try {
        await db.collection("sem").deleteOne({ name });
        res.send("Deleted");
    } catch (err) {
        console.error("Error deleting:", err);
        res.status(500).send("Could not delete");
    }
});

app.post("/find", async (req, res) => {
    try {
        const items = await db.collection("sem").find().toArray();
        let tableContent = "<h1>PERSONAL INFO</h1><table border='1'><tr><th>Name</th><th>Lname</th><th>Mail</th><th>Age</th><th>Address</th><th>Date</th></tr>";
        tableContent += items.map(item => `<tr><td>${item.name}</td><td>${item.lname}</td><td>${item.mailid}</td><td>${item.age}</td><td>${item.address}</td><td>${item.date}</td></tr>`).join('');
        tableContent += "</table><br><a href='/'>Back to form </a>";
        res.send(tableContent);
    } catch (err) {
        console.error("Error finding:", err);
        res.status(500).send("Could not find");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
