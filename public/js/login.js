// The HTML code

const LOGIN_html_code = 
`<div id="login-screen">
    <div class="login">
      <h1>Login</h1>
        <form onsubmit="LOGIN_Attempt();return false">
          <input id="user" class="login-input" type="text" name="u" placeholder="Username" required="required" />
          <input id="password" class="login-input" type="password" name="p" placeholder="Password" required="required" />
          <button type="submit" class="btn btn-primary btn-block btn-large login-btn">Log in</button>
          <button class="btn btn-primary btn-block btn-large login-btn" onclick="SIGNUP_GoTo()">Register</button>
        </form>
    </div>
  </div>`


// Attemp to log in, if it fails -> render the login page again

let LOGIN_Attempt = () => {
    let username = document.getElementById("username");
    let password = document.getElementById("password");

    SYNC_SignIn({
        username: username,
        password: password
    });
}

// Render the Log In  HTML page

let LOGIN_GoTo = () => {
    // Maybe check if there is an user logged in

    let everything = document.getElementById("everything");
    everything.innerHTML =LOGIN_html_code;
}