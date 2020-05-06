

let SYNC_SignIn = (user) => {
    let server_response = { };

    fetch('API/login', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    }).then((res) => {
        server_response = res.json();
    });

    if (server_response['successful']){
        MENU_GoTo();
    }
    else{
        LOGIN_GoTo();
    }
}