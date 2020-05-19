let HISTORY_GoTo = () => {
    console.log("History menu called");

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
            greeting.innerHTML = "Here are your finished reminders, " + current_user['name'] + ":";

            let main = document.getElementById('reminders-view');
            for (let i = 0; i < note_list.length; i++) {
                if (note_list[i].done == true)
                    main.appendChild(create_note_html_history(note_list[i]));
            }

        });

}

let HISTORY_MarkAsUndone = (id) => {
    let req_body = {
        'token': window.localStorage.getItem('token'),
        'note_id': id
      }
    
      fetch('http://localhost:3000/user/markasundonenote', {
        method: 'PUT',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(req_body)
      }).then(res => res.json())
        .then(res => {
          if (res.hasOwnProperty('successful') && res['successful']) {
            HISTORY_GoTo();
          }
          else {
            window.localStorage.removeItem('token');
            LOGIN_GoTo();
          }
        });
}