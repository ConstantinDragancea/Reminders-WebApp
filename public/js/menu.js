const MENU_html_code =
  `<!-- Navbar at the top -->
<div class="navbar">
  <a class="logo" href="#"><h1>Reminders</h1></a>
  <nav>
    <ul class="nav__links">
      <li><a href="#" onclick="MENU_GoTo(); return false;">Home</a></li>
      <li><a href="#" onclick="HISTORY_GoTo(); return false;">History</a></li>
      <li><a href="#" onclick="MISSED_GoTo(); return false;">Missed reminders</a></li>
    </ul>
  </nav>
  <a class="cta" href="#" onclick="LogOut(); return false;" >Log Out</a>
  <p onclick="openNav()" class="menu cta">Menu</p>
</div>

<!-- Mobile menu that comes from left -->
<div id="mobile__menu" class="overlay">
  <a class="close" onclick="closeNav()">&times;</a>
  <div class="overlay__content">
    <a href="#" onclick="MENU_GoTo(); return false;">Home</a>
    <a href="#" onclick="HISTORY_GoTo(); return false;">History</a>
    <a href="#" onclick="MISSED_GoTo(); return false;" >Missed Reminders</a>
    <a href="#" onclick="LogOut(); return false;" >Log Out</a>
  </div>
</div>

<div class="body-layout">

  <header class="body-greeting">
    <h2 id="greeting">Here are some future reminders:</h2>
  </header>

  <main id="reminders-view" class="container-reminders">

  </main>

  <footer class="footer">
    <p>Copyright 2020 Constantin Dragancea FMI Unibuc</p>
  </footer>

</div>`

// codFunc : 0 - Menu, current reminders
//           1 - History, done reminders
//           2 - Missed reminders
let modal_html_code = (id, nameFunc) => {

  let str_ = `<div class="modal-view" id="modal-note-view">
      <form id="modal-note-form" class="modal-note-form" onsubmit="MENU_SaveNote('${id}', ${nameFunc}); return false;">
      <h3>Insert note details</h3>
      <fieldset>
        <input id="modal-note-input-title" class="modal-note-input" placeholder="Note Title" type="text" tabindex="1" required autofocus>
      </fieldset>
      <fieldset>
        <input id="modal-note-input-deadline" class="modal-note-input modal" placeholder="Note Deadline" type="datetime-local" tabindex="2" required>
      </fieldset>
      <fieldset>
        <textarea id="modal-note-input-description" class="modal-note-input" placeholder="Type your reminder here..." tabindex="5" required></textarea>
      </fieldset>
      <fieldset>
        <button class="modal-note-input" name="submit" type="submit" id="modal-note-save" data-submit="...Sending">Save changes</button>
      </fieldset>
      <fieldset>
        <button class="modal-note-input modal-note-discard" onclick="MENU_CloseModal(); return false;" id="modal-note-discard" data-submit="...Sending">Discard changes</button>
      </fieldset><fieldset>
        <button class="modal-note-input modal-note-delete" onclick="MENU_DeleteNote('${id}', ${nameFunc}); return false;" id="modal-note-delete" data-submit="...Sending">Delete Note</button>
        </fieldset></form>
    </div>`;
  return str_;
}

let notes = [];
let current_user = {};

let MENU_GoTo = () => {

  fetch('users/' + window.localStorage.getItem('token'))
    .then(res => res.json())
    .then(res => {
      current_user = res;
      if (current_user.hasOwnProperty('successful') && !current_user['successful']) {
        window.localStorage.removeItem('token');
        LOGIN_GoTo();
        return;
      }

      notes = current_user.notes;

      let everything = document.getElementById('everything');
      everything.innerHTML = MENU_html_code;

      let greeting = document.getElementById('greeting');
      greeting.innerHTML = "Here are your future reminders, " + current_user['name'] + ":";

      let nowTime = new Date();

      let main = document.getElementById('reminders-view');
      for (let i = 0; i < notes.length; i++) {
        let note_time = new Date(notes[i].deadline);
        if (notes[i].done == false && note_time >= nowTime)
          main.appendChild(create_note_html(notes[i], 0));
      }

      let note_entry_new = document.createElement('div');
      note_entry_new.setAttribute('class', 'note-entry-new');
      note_entry_new.setAttribute('onclick', `MENU_EditNote('-1', 0); return false;`);

      let header_new_note = document.createElement('h2');
      header_new_note.innerHTML = '<i class="fas fa-pen"></i>Create new reminder';

      note_entry_new.appendChild(header_new_note);
      main.appendChild(note_entry_new);

    });

}

let HISTORY_GoTo = () => {

  fetch('users/' + window.localStorage.getItem('token'))
    .then(res => res.json())
    .then(res => {
      current_user = res;
      if (current_user.hasOwnProperty('successful') && !current_user['successful']) {
        window.localStorage.removeItem('token');
        LOGIN_GoTo();
        return;
      }

      notes = current_user.notes;

      let everything = document.getElementById('everything');
      everything.innerHTML = MENU_html_code;

      let greeting = document.getElementById('greeting');
      greeting.innerHTML = "Here are your finished reminders, " + current_user['name'] + ":";

      let main = document.getElementById('reminders-view');
      for (let i = 0; i < notes.length; i++) {
        if (notes[i].done == true)
          main.appendChild(create_note_html(notes[i], 1));
      }

    });

}

let MISSED_GoTo = () => {

  fetch('users/' + window.localStorage.getItem('token'))
    .then(res => res.json())
    .then(res => {
      current_user = res;
      if (current_user.hasOwnProperty('successful') && !current_user['successful']) {
        window.localStorage.removeItem('token');
        LOGIN_GoTo();
        return;
      }

      notes = current_user.notes;

      let everything = document.getElementById('everything');
      everything.innerHTML = MENU_html_code;

      let greeting = document.getElementById('greeting');
      greeting.innerHTML = "Here are your reminders with missed deadlines, " + current_user['name'] + ":";

      let nowTime = new Date();

      let main = document.getElementById('reminders-view');
      for (let i = 0; i < notes.length; i++) {
        let note_time = new Date(notes[i].deadline);
        if (notes[i].done == false && nowTime >= note_time)
          main.appendChild(create_note_html(notes[i], 2));
      }

    });

}

let callback_ids = [MENU_GoTo, HISTORY_GoTo, MISSED_GoTo]

let create_note_html = (note, codFunc) => {
  let note_entry = document.createElement('div');
  note_entry.setAttribute('class', 'note-entry');

  let title = document.createElement('div');
  title.setAttribute('class', 'title');
  title.innerHTML = "<p>" + note.title + "</p>";
  note_entry.appendChild(title);

  let deadline = document.createElement('div');
  deadline.setAttribute('class', 'deadline');
  let note_date = new Date(note.deadline);
  note_date = note_date.toLocaleString();
  deadline.innerHTML = "<p>" + note_date + "</p>";
  note_entry.appendChild(deadline);

  let hr = document.createElement('hr');
  note_entry.appendChild(hr);

  let description = document.createElement('div');
  description.setAttribute('class', 'description');
  description.innerHTML = "<p>" + note.description + "</p>";
  note_entry.appendChild(description);

  let done_button_wrapper = document.createElement('div');
  done_button_wrapper.setAttribute('class', 'done-button-wrapper');

  let aux_str = `<div class="done-button" onclick="MENU_MarkAs${(note.done ? 'Undone' : 'Done')}('${note.note_id}', ${codFunc}); return false;">
                <p>Mark as ${(note.done ? 'Undone' : 'Done')}</p>
            </div>
            <div class="done-button" onclick="MENU_EditNote('${note.note_id}', ${codFunc}); return false;">
          <p>Edit Note</p>
        </div>`;

  done_button_wrapper.innerHTML = aux_str;
  note_entry.appendChild(done_button_wrapper);

  return note_entry;
}


let MENU_EditNote = (id, codFunc) => {
  let callback = () => { };

  if (codFunc >= 0 && codFunc < 3) {
    callback = callback_ids[codFunc];
  }
  else {
    callback = LOGIN_GoTo;
  }

  let modal_wrapper = document.createElement('div');
  modal_wrapper.setAttribute('class', 'modal-view-wrapper');

  modal_wrapper.innerHTML = modal_html_code(id, callback.name);
  let everything = document.getElementById('everything');
  everything.appendChild(modal_wrapper);

  if (id != -1) {
    let note_from_db = {};
    let found = false;

    for (let i = 0; i < notes.length; i++) {
      if (notes[i].note_id === id) {
        found = true;
        note_from_db = notes[i];
      }
    }

    if (!found) {
      callback();
      return;
    }

    let title_ = document.getElementById('modal-note-input-title');
    title_.value = note_from_db.title;

    let deadline_ = document.getElementById('modal-note-input-deadline');
    deadline_.value = note_from_db.deadline;

    let description_ = document.getElementById('modal-note-input-description');
    description_.value = note_from_db.description;
  }

  return;
}

let MENU_SaveNote = (id, callback) => {

  let req_body = {
    'token': window.localStorage.getItem('token')
  }
  let new_note = {};

  console.log("got called");

  for (let i = 0; i < notes.length; i++) {
    if (notes[i].note_id === id) {
      new_note = notes[i];
      break;
    }
  }

  let title_ = document.getElementById('modal-note-input-title');
  new_note['title'] = title_.value;
  new_note.title.trim();

  let deadline_ = document.getElementById('modal-note-input-deadline');
  new_note['deadline'] = deadline_.value;

  let description_ = document.getElementById('modal-note-input-description');
  new_note['description'] = description_.value;
  new_note.description.trim();

  if (id == '-1') {
    new_note['done'] = false;
  }

  req_body['note'] = new_note;

  if (new_note.title.length > 24){
    alert("Please insert a shorter note title!");
    return;
  }

  if (id != "-1") {

    fetch('user/editnote', {
      method: 'PUT',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(req_body)
    }).then(res => res.json())
      .then(res => {
        if (res.hasOwnProperty('successful') && res['successful']) {
          callback();
        }
        else {
          window.localStorage.removeItem('token');
          LOGIN_GoTo();
        }
      })
  }
  else {
    fetch('user/newnote', {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(req_body)
    }).then(res => res.json())
      .then(res => {
        if (res.hasOwnProperty('successful') && res['successful']) {
          callback()
        }
        else {
          window.localStorage.removeItem('token');
          LOGIN_GoTo();
        }
      });
  }
}

let MENU_CloseModal = () => {
  let everything = document.getElementById('everything');
  let aux = document.getElementsByClassName('modal-view-wrapper');

  if (aux.length == 0)
    return;

  everything.removeChild(aux[0]);
}

let MENU_DeleteNote = (id, callback) => {
  let req_body = {
    'token': window.localStorage.getItem('token'),
    'note_id': id
  }
  fetch('user/deletenote', {
    method: 'DELETE',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(req_body)
  }).then(res => res.json())
    .then(res => {
      if (res.hasOwnProperty('successful') && res['successful']) {
        callback();
      }
      else {
        window.localStorage.removeItem('token');
        LOGIN_GoTo();
      }
    })
}

let MENU_MarkAsDone = (id, codFunc) => {
  let req_body = {
    'token': window.localStorage.getItem('token'),
    'note_id': id
  }

  let callback = callback_ids[codFunc];

  fetch('user/markasdonenote', {
    method: 'PUT',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(req_body)
  }).then(res => res.json())
    .then(res => {
      if (res.hasOwnProperty('successful') && res['successful']) {
        callback();
      }
      else {
        window.localStorage.removeItem('token');
        LOGIN_GoTo();
      }
    });
}

let MENU_MarkAsUndone = (id, codFunc) => {
  let req_body = {
    'token': window.localStorage.getItem('token'),
    'note_id': id
  }

  let callback = callback_ids[codFunc];

  fetch('user/markasundonenote', {
    method: 'PUT',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(req_body)
  }).then(res => res.json())
    .then(res => {
      if (res.hasOwnProperty('successful') && res['successful']) {
        callback();
      }
      else {
        window.localStorage.removeItem('token');
        LOGIN_GoTo();
      }
    });
}