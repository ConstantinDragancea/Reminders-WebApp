let SYNC_SignIn = (user) => {

    fetch('API/login', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    }).then(res => res.json())
    .then(res => {

        if (res.hasOwnProperty('successful') && res['successful']){
            window.localStorage.setItem('token', res.token);
            MENU_GoTo();
        }
        else{
            window.localStorage.removeItem('token');
            if (res.hasOwnProperty('reason')){
                alert(res.reason);
            }
            LOGIN_GoTo();
        }
    });
    
}

let SYNC_SignUp = (user) => {

    fetch('API/signup', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    }).then(res => res.json())
    .then(res => {
        if (res.hasOwnProperty('successful') && res['successful']){
            window.localStorage.setItem('token', res.token);
            MENU_GoTo();
        }
        else{
            window.localStorage.removeItem('token');
            SIGNUP_GoTo();
            if (res.hasOwnProperty('reason')){
                alert(res.reason);
            }
        }
    });
}

let current_time = () => {
    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now;
}