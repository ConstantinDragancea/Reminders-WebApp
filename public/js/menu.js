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

let create_note_html = (note) => {
    let note_entry = document.createElement('div');
    note_entry.setAttribute('class', 'note-entry');

    let title = document.createElement('div');
    title.setAttribute('class', 'title');
    title.innerHTML = "<p>" + note.title + "</p>";
    note_entry.appendChild(title);

    let deadline = document.createElement('div');
    deadline.setAttribute('class', 'deadline');
    deadline.innerHTML = "<p>" + note.deadline + "</p>";
    note_entry.appendChild(deadline);

    let hr = document.createElement('hr');
    note_entry.appendChild(hr);

    let description = document.createElement('div');
    description.setAttribute('class', 'description');
    description.innerHTML = "<p>" + note.description + "</p>";
    note_entry.appendChild(description);

    let done_button_wrapper = document.createElement('div');
    done_button_wrapper.setAttribute('class', 'done-button-wrapper');
    done_button_wrapper.innerHTML = 
    `<div class="done-button">
        <p>Mark as Done</p>
    </div> `;
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
    
        let everything = document.getElementById('everything');
        everything.innerHTML = MENU_html_code;
    
        let greeting = document.getElementById('greeting');
        greeting.innerHTML = "Here are your future reminders, " + current_user['name'] + ":";
    
        let main = document.getElementById('reminders-view');
        for (let i=0; i < note_list.length; i++)
            main.appendChild(create_note_html(note_list[i]));
    });
    
}