let MENU_MissedGoTo = () => {
    fetch('http://localhost:3000/users/:' + window.localStorage.getItem('token'))
      .then(res => res.json())
      .then(res => {
        current_user = res;
        if (current_user.hasOwnProperty('successful') && !current_user['successful']) {
          window.localStorage.removeItem('token');
          LOGIN_GoTo();
          return;
        }
  
        let note_list = current_user.notes;
        notes = current_user.notes;
  
        let everything = document.getElementById('everything');
        everything.innerHTML = MENU_html_code;
  
        let greeting = document.getElementById('greeting');
        greeting.innerHTML = "Here are the reminders you have missed, " + current_user['name'] + ":";
  
        let main = document.getElementById('reminders-view');
  
        let nowTime = new Date();
  
        for (let i = 0; i < note_list.length; i++) {
          let note_date = new Date(note[i].deadline);
  
          if (note_list[i].done == false && nowTime > noda_date)
            main.appendChild(create_note_html(note_list[i]));
        }
  
        let note_entry_new = document.createElement('div');
        note_entry_new.setAttribute('class', 'note-entry-new');
        note_entry_new.setAttribute('onclick', `MENU_EditNote('-1')`);
  
        let header_new_note = document.createElement('h2');
        header_new_note.innerHTML = '<i class="fas fa-pen"></i>Create new reminder';
  
        note_entry_new.appendChild(header_new_note);
        main.appendChild(note_entry_new);
  
      });
  }