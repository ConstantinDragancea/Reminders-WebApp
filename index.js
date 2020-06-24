const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const port = 3000;
const morgan = require('morgan');
const requestIp = require('request-ip');

//test

// Middleware ------------------------------------------------------
app.use(express.static('public'));
app.use(morgan('tiny'));
app.use(express.json());
app.use(requestIp.mw())

// Possible server responses to attemps to log in / register --------

const successful_login = {
    'user_id' : 'abcd',
    'token' : '1234',
    'successful': true
}

const failed_login = {
    'reason' : 'Wrong username and/or password',
    'successful': false
}

const successful_operation = {
    'successful' : true
}

const failed_operation = {
    'successful': false
}

const incorrect_token = {
    'successful': false
}

// Useful functions -------------------------------------------------

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

let CreateRandomIp = () => {
    let result = '';
    result += Math.floor(Math.random() * 193)+ '.' + Math.floor(Math.random() * 167) + '.';
    result += Math.floor(Math.random() * 100) + '.' + Math.floor(Math.random() * 100);
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

// For storing the logged user
let active_user = { };

// LOGIN and SIGNUP API -------------------------------

app.post('/API/login', (req, res) => {
    let user = req.body;
    let index_response = { };

    // check if there is an existing token and that it is correct
    if (user.hasOwnProperty('token')){
        let server_response = failed_login;
        if (active_user.hasOwnProperty('token') && 
            active_user['token'] === user['token']){
                index_response = successful_login;
                index_response['id'] = active_user['id'];
                index_response['token'] = active_user['token'];
        }
        else {
            active_user = { };
            delete server_response.reason;
        }
        res.send(server_response);
        return;
    }


    let db = readJSONFile();

    let found = false;
    let user_idx = 0;
    for (let i=0; i < db['users'].length; i++){
        if (db['users'][i].username === user.username && db['users'][i].password === user.password){
            found = true;
            user = db['users'][i];
            user_idx = i;
        }
    }
    if (found){
        index_response = successful_login;
        index_response.user_id = user.id;
        index_response.token = CreateUniqueID();
        index_response.last_login_time = user.last_login_time;
        index_response.last_login_ip = user.last_login_ip;
        index_response.birthdate = user.birthdate;

        db['users'][user_idx].last_login_time = new Date();
        db['users'][user_idx].last_login_ip = CreateRandomIp();

        writeJSONFile(db);

        active_user = {
            'token' : index_response.token,
            'user' : user
        };
    }
    else {
        index_response = failed_login;
    }

    let logs = readLogsFile();
    
    let log_message = `[${current_time_formatted()}]`;
    log_message += ` utilizatorul ${active_user.user.username} s-a logat in aplicatie`;
    logs += log_message + '\n';

    writeLogsFile(logs);
    
    res.send(index_response);
})

app.post('/API/signup', (req, res) => {
    let newUser = req.body;

    let server_response = failed_operation;

    if (newUser.password !== newUser.password2){
        server_response['reason'] = "The 2 passwords don't match!";
        res.send(server_response);
        return;
    }

    if (!ValidUserName(newUser.username) || !ValidUserName(newUser.name)){
        server_response['reason'] = "Please insert a valid username!"
        res.send(server_response);
        return;
    }

    let db = readJSONFile();

    for (let i=0; i < db.users.length; i++){
        if (db.users[i].username === newUser.username){
            server_response['reason'] = "There already exists a user with that username!";
            res.send(server_response);
            return;
        }
    }

    let user_formatted = {};
    user_formatted['id'] = CreateUniqueID();
    user_formatted['name'] = newUser.name;
    user_formatted['birthdate'] = newUser.birthdate;
    user_formatted['username'] = newUser.username;
    user_formatted['password'] = newUser.password;
    user_formatted['notes'] = [];
    user_formatted['last_login_time'] = new Date();
    user_formatted['last_login_ip'] = CreateRandomIp();

    db['users'].push(user_formatted);

    writeJSONFile(db);

    active_user['token'] = CreateUniqueID();
    active_user['user'] = user_formatted;

    server_response = {
        'successful': true,
        'user_id': user_formatted.id,
        'token': active_user.token,
        'birthdate': user_formatted.birthdate
    }

    let logs = readLogsFile();
    
    let log_message = `[${current_time_formatted()}]`;
    log_message += ` utilizatorul ${active_user.user.username} si-a creat un cont in aplicatie`;
    logs += log_message + '\n';

    writeLogsFile(logs);

    res.send(server_response);
})

app.delete('/API/logout', (req, res) => {
    let reqToken = req.body.token;

    if (!active_user.hasOwnProperty('token') || active_user['token'] !== reqToken){
        res.send(failed_operation);
        return;
    }

    let logs = readLogsFile();
    
    let log_message = `[${current_time_formatted()}]`;
    log_message += ` utilizatorul ${active_user.user.username} s-a delogat din aplicatie`;
    logs += log_message + '\n';

    writeLogsFile(logs);

    active_user = {};
    res.send(successful_operation);
})

// CRUD API -----------------------------------------------------

// CREATE -----------------------------------
app.post('/user/newnote', (req, res) => {
    let reqToken = req.body.token;
    let newNote = req.body.note;

    newNote['note_id'] = CreateUniqueID();

    if (!active_user.hasOwnProperty('token') || active_user['token'] !== reqToken){
        res.send(failed_operation);
        return;
    }

    active_user['user'].notes.push(newNote);
    
    let db = readJSONFile();
    for (let i = 0; i < db['users'].length; i++){
        if (db['users'][i].id == active_user.user.id){
            db['users'][i] = active_user.user;
            break;
        }
    }

    writeJSONFile(db);

    let logs = readLogsFile();
    
    let log_message = `[${current_time_formatted()}]`;
    log_message += ` utilizatorul ${active_user.user.username} si-a creat o notita noua cu id-ul ${newNote.note_id}`;
    logs += log_message + '\n';

    writeLogsFile(logs);

    res.send(successful_operation);
})

// Read One -----------------------------------

app.get('/user/note/:id', (req, res) => {
    let noteId = req.params.id.substring(1);
    noteId = "note_id" + noteId;
    let reqToken = req.body;
    if (!active_user.hasOwnProperty('token') || active_user['token'] !== reqToken){
        res.sendStatus(404);
        return;
    }

    let userNotes = active_user['user']['notes'];
    for (let i=0; i < userNotes.length; i++){
        if (userNotes[i].noteId === noteId){
            res.send(userNotes[i]);
            return;
        }
    }
    res.sendStatus(404);
})

// Read All --------------------------------

app.get('/users/:token', (req, res) => {
    // let requestToken = req.params.id.substring(1);
    let requestToken = req.params.token;
    if (!active_user.hasOwnProperty('token') || active_user['token'] !== requestToken){
        res.send(failed_operation);
        return;
    }
    res.send(active_user.user);
})


// Update ----------------------------------

app.put('/user/editnote', (req, res) => {
    let reqToken = req.body.token;
    let newNote = req.body.note;

    if (!active_user.hasOwnProperty('token') || active_user['token'] !== reqToken){
        res.send(failed_operation);
        return;
    }

    for (let i=0; i < active_user.user.notes.length; i++){
        if (active_user.user.notes[i].note_id === newNote.note_id){
            active_user.user.notes[i] = newNote;
            break;
        }
    }
    
    let db = readJSONFile();
    for (let i = 0; i < db['users'].length; i++){
        if (db['users'][i].id == active_user.user.id){
            db['users'][i] = active_user.user;
            break;
        }
    }

    writeJSONFile(db);

    let logs = readLogsFile();
    
    let log_message = `[${current_time_formatted()}]`;
    log_message += ` utilizatorul ${active_user.user.username} a editat notita cu id-ul ${newNote.note_id}`;
    logs += log_message + '\n';

    writeLogsFile(logs);

    res.send(successful_operation);

})

app.put('/user/markasdonenote', (req, res) => {
    let reqToken = req.body.token;
    let newNote = req.body.note_id;

    if (!active_user.hasOwnProperty('token') || active_user['token'] !== reqToken){
        res.send(failed_operation);
        return;
    }

    for (let i=0; i < active_user.user.notes.length; i++){
        if (active_user.user.notes[i].note_id === newNote){
            active_user.user.notes[i].done = true;
            break;
        }
    }
    
    let db = readJSONFile();
    for (let i = 0; i < db['users'].length; i++){
        if (db['users'][i].id == active_user.user.id){
            db['users'][i] = active_user.user;
            break;
        }
    }

    writeJSONFile(db);

    let logs = readLogsFile();
    
    let log_message = `[${current_time_formatted()}]`;
    log_message += ` utilizatorul ${active_user.user.username} a marcat reminder-ul ${newNote} ca indeplinit`;
    logs += log_message + '\n';

    writeLogsFile(logs);

    res.send(successful_operation);

})

app.put('/user/markasundonenote', (req, res) => {
    let reqToken = req.body.token;
    let newNote = req.body.note_id;

    if (!active_user.hasOwnProperty('token') || active_user['token'] !== reqToken){
        res.send(failed_operation);
        return;
    }

    for (let i=0; i < active_user.user.notes.length; i++){
        if (active_user.user.notes[i].note_id === newNote){
            active_user.user.notes[i].done = false;
            break;
        }
    }
    
    let db = readJSONFile();
    for (let i = 0; i < db['users'].length; i++){
        if (db['users'][i].id == active_user.user.id){
            db['users'][i] = active_user.user;
            break;
        }
    }

    writeJSONFile(db);

    let logs = readLogsFile();
    
    let log_message = `[${current_time_formatted()}]`;
    log_message += ` utilizatorul ${active_user.user.username} a marcat reminder-ul ${newNote} ca neindeplinit`;
    logs += log_message + '\n';

    writeLogsFile(logs);

    res.send(successful_operation);

})

// Delete -----------------------------------

app.delete('/user/deletenote', (req, res) => {
    let reqToken = req.body.token;
    let to_delete_id = req.body.note_id;

    if (!active_user.hasOwnProperty('token') || active_user['token'] !== reqToken){
        res.send(failed_operation);
        return;
    }

    for (let i=0; i < active_user.user.notes.length; i++){
        if (active_user.user.notes[i].note_id === to_delete_id){
            active_user.user.notes.splice(i, 1);
            break;
        }
    }

    let db = readJSONFile();
    for (let i = 0; i < db['users'].length; i++){
        if (db['users'][i].id == active_user.user.id){
            db['users'][i] = active_user.user;
            break;
        }
    }

    writeJSONFile(db);

    let logs = readLogsFile();

    let log_message = `[${current_time_formatted()}]`;
    log_message += ` utilizatorul ${active_user.user.username} a sters notita cu id-ul ${to_delete_id}`;
    logs += log_message + '\n';

    writeLogsFile(logs);

    res.send(successful_operation);
})

// Helper functions to interact with the database ------------------------

function current_time_formatted(){
    let now = new Date();
    let hrs = (now.getHours() < 10 ? '0' : '') + now.getHours();
    let mins = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    let secs = (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();

    return `${now.toLocaleDateString()}, ${hrs}:${mins}:${secs}`;
}

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

function readLogsFile() {
    return fs.readFileSync('logs.txt');
}

function writeLogsFile(content) {
    fs.writeFileSync('logs.txt', content, 'utf-8', err => {
        if (err){
            console.log(err);
        }
    })
}

app.listen(port, () => console.log(`Reminders Web App listening on port ${port}!`));