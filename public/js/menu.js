
const MENU_html_code = 
`<!-- Navbar at the top -->
<div class="navbar">
  <a class="logo" href="#"><h1>Reminders</h1></a>
  <nav>
    <ul class="nav__links">
      <li><a href="#">Home</a></li>
      <li><a href="#">History</a></li>
      <li><a href="#">Pomodoro timer</a></li>
    </ul>
  </nav>
  <a class="cta" href="#">Log Out</a>
  <p onclick="openNav()" class="menu cta">Menu</p>
</div>

<!-- Mobile menu that comes from left -->
<div id="mobile__menu" class="overlay">
  <a class="close" onclick="closeNav()">&times;</a>
  <div class="overlay__content">
    <a href="#">Home</a>
    <a href="#">History</a>
    <a href="#">Pomodoro</a>
    <a href="#">Log Out</a>
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

let modal_html_code = (id) => {
  let str_ = `<div class="modal-view" id="modal-note-view">
     <form id="modal-note-form" class="modal-note-form" onsubmit="MENU_SaveNote('`;
  str_ += id;
  str_ += `'); return false">
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
        <button class="modal-note-input modal-note-discard" onclick="MENU_CloseModal()" id="modal-note-discard" data-submit="...Sending">Discard</button>
      </fieldset>
    </form>

    </div>`;
  return str_;
}

let notes = [];

let create_note_html = (note) => {
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

    let aux_str = `<div class="done-button">
                <p>Mark as Done</p>
            </div>
            <div class="done-button" onclick="MENU_EditNote('`;
     aux_str += note['note_id'];
     aux_str += `')">
          <p>Edit Note</p>
        </div>`;


    done_button_wrapper.innerHTML = aux_str;
    note_entry.appendChild(done_button_wrapper);

    return note_entry;
}

let MENU_GoTo = () => {

    let current_user = { };    

    fetch('http://localhost:3000/users/:' + window.localStorage.getItem('token'))
    .then(res => res.json())
    .then(res => {
        current_user = res;
        if (current_user.hasOwnProperty('successful') && !current_user['successful']){
            window.localStorage.removeItem('token');
            LOGIN_GoTo();
            return;
        }
    
        let note_list = current_user.notes;
        notes = current_user.notes;
    
        let everything = document.getElementById('everything');
        everything.innerHTML = MENU_html_code;
    
        let greeting = document.getElementById('greeting');
        greeting.innerHTML = "Here are your future reminders, " + current_user['name'] + ":";
    
        let main = document.getElementById('reminders-view');
        for (let i=0; i < note_list.length; i++)
            main.appendChild(create_note_html(note_list[i]));
    });
    
}


let MENU_EditNote = (id) => {

  let modal_wrapper = document.createElement('div');
  modal_wrapper.setAttribute('class', 'modal-view-wrapper');

  modal_wrapper.innerHTML = modal_html_code(id);
  let everything = document.getElementById('everything');
  everything.appendChild(modal_wrapper);

  if (id != -1){
    let note_from_db = {};
    let found = false;

    for (let i=0; i < notes.length; i++){
      if (notes[i].note_id === id){
        found = true;
        note_from_db = notes[i];
      }
    }

    if (!found){
      MENU_GoTo();
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

let MENU_SaveNote = (id) => {

  let req_body = {
    'token': window.localStorage.getItem('token')
  }
  let new_note = {
    'note_id' : id
  };

  let title_ = document.getElementById('modal-note-input-title');
  new_note['title'] = title_.value;

  let deadline_ = document.getElementById('modal-note-input-deadline');
  new_note['deadline'] = deadline_.value;

  console.log(deadline_.value);

  let description_ = document.getElementById('modal-note-input-description');
  new_note['description'] = description_.value;

  req_body['note'] = new_note;

  if (id != "-1"){
    
    fetch('http://localhost:3000/user/editnote', {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(req_body)
    }).then(res => res.json())
    .then(res => {
        if (res.hasOwnProperty('successful') && res['successful']){
            MENU_GoTo();
        }
        else{
          console.log("failed for some reason?");
          window.localStorage.removeItem('token');
          LOGIN_GoTo();
        }
    });
  }
  else{
    fetch('http://localhost:3000/user/newnote', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(req_body)
    }).then(res => res.json())
    .then(res => {
        if (res.hasOwnProperty('successful') && res['successful']){
            MENU_CloseModal();
        }
        else{
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