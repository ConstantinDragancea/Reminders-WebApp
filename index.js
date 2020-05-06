const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

// Middleware
app.use(express.static('public'));

// Possible server responses to attemps to log in / register

const successful_login = {
    'user_id' : 'abcd',
    'token' : '1234',
    'successful': true
}

const failed_login = {
    'message' : 'Wrong username and/or password',
    'successful': false
}

// Useful functions

let CreateUniqueID = () => {
    let length = 20;
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let ValidUserName = str => {
    if ((typeof str) !== 'string')
        return false;
    if (str.length == 0 || str.length > 100 ||
      str.match(/^[0-9a-z\._]*$/ig) === null)
        return false;
    return true;    
};

let ReadUser = user => {
    let user_data;
    fetch('http://localhost:3000/users/' + user.id)
        .then((res) => res.json())
        .then((userFound) => {
            user_data = userFound;
        });
    return user_data;
}

// Write an user to the database
let WriteUser = user => {
    let db = readJSONFile();
    let found = false;
    for (let i=0; i<db.users.length; i++){
        if (db['users'][i].id == user.id){
            db['users'][i] = user;
            found = true;
            break;
        }
    }
    if (!found){
        db.users.push(user);
    }
    writeJSONFile(db);
}

// Write a reminder to the database
let WriteNote = (user_id, note) => {
    let db = readJSONFile();
    for (let i=0; i < db.users.length; i++){
        if (db['users'][i].id == user_id){
            db['users'][i].push(note);
        }
    }
    writeJSONFile(db);
}

// For storing the logged user
let active_user = { };

// LOGIN and SIGNUP API

app.post('/API/login', (req, res) => {
    let user = req.body;
    const users = readJSONFile()['users'];

    let found = false;
    for (let i=0; i<users.length; i++){
        if (users[i].username === user.username && users[i].password === user.password){
            found = true;
            user = users[i];
        }
    }
    let server_response = { };
    if (found){
        server_response = successful_login;
        server_response.user_id = user.id;
        server_response.token = CreateUniqueID();
    }
    else {
        server_response = failed_login;
    }
    res.end(JSON.stringify(server_response));
})

// CRUD API

// CREATE


// Read One


// Read All

// Update


// Delete


function readJSONFile() {
    return JSON.parse(fs.readFileSync('database.json'));
}

function writeJSONFile(content) {

    fs.writeFileSync('database.json',
        JSON.stringify(content, null, '\t'),
        'utf-8',
        err => {
            if (err) {
                console.log(err)
            }
        });
}

app.listen(port, () => console.log(`Web App listening on port ${port}!`));