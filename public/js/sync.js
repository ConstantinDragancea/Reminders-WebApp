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
            window.localStorage.clear();
            window.localStorage.setItem('token', res.token);
            window.localStorage.setItem('last_login_time', res.last_login_time);
            window.localStorage.setItem('last_login_ip', res.last_login_ip);
            window.localStorage.setItem('birthdate', res.birthdate);
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
            window.localStorage.clear();
            window.localStorage.setItem('token', res.token);
            window.localStorage.setItem('birthdate', res.birthdate);
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