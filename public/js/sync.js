

let SYNC_SignIn = (user) => {
    let server_response = { };

    fetch('http://localhost:3000/API/login', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    }).then(res => res.json())
    .then(res => {

        if (res['successful']){
            window.localStorage.setItem('token', res.token);
            MENU_GoTo();
        }
        else{
            window.localStorage.removeItem('token');
            LOGIN_GoTo();
        }
    });
    
}