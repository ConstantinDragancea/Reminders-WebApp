const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

// Middleware
app.use(express.static('public'));

// CRUD API

// CREATE


// Read One


// Read All

// Update


// Delete


function readJSONFile() {
    return JSON.parse(fs.readFileSync("database.json"))["reminders"];
}

function writeJSONFile(content) {

    fs.writeFileSync("database.json",
        JSON.stringify({ reminders: content }, null, '\t'),
        "utf-8",
        err => {
            if (err) {
                console.log(err)
            }
        });
}

app.listen(port, () => console.log(`Flora listening on port ${port}!`));