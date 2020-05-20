// The HTML code

const LOGIN_html_code =
  `<div id="login-screen">
    <div class="login">
      <h1>Login</h1>
        <form onsubmit="LOGIN_Attempt(); return false;">
          <input id="username" class="login-input" type="text" name="u" placeholder="Username" required="required" />
          <input id="password" class="login-input" type="password" name="p" placeholder="Password" required="required" />
          <button type="submit" class="btn btn-primary btn-block btn-large login-btn">Log in</button>
        </form>
        <form>
          <button class="btn btn-primary btn-block btn-large login-btn" onclick="SIGNUP_GoTo(); return false;">Register</button>
        </form>
    </div>
  </div>`


// Attemp to log in, if it fails -> render the login page again

let LOGIN_Attempt = () => {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  SYNC_SignIn({
    username: username,
    password: password
  });
}

// Render the Log In  HTML page

let LOGIN_GoTo = () => {
  // Maybe check if there is an user logged in
  let localToken = window.localStorage.getItem('token');
  if (localToken != null && localToken != undefined) {
    SYNC_SignIn({ token: localToken });
    return;
  }

  let everything = document.getElementById("everything");
  everything.innerHTML = LOGIN_html_code;
}

let LogOut = () => {

  let req_body = {
    'token': window.localStorage.getItem('token')
  };

  fetch('API/logout', {
    method: 'DELETE',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(req_body)
  }).then(res => res.json())
    .then(res => {
      LOGIN_GoTo();
      return;
    });
}