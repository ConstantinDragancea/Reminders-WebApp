

const SIGNUP_html_code =
`<div id="login-screen">
<div class="login">
  <h1>Register</h1>
    <form>
      <input id="name_signup" class="login-input" type="text" name="n" placeholder="Enter your name" required="required" />
      <input id="username_signup" class="login-input" type="text" name="u" placeholder="Enter your username" required="required" />
      <input id="password_signup" class="login-input" type="password" name="p" placeholder="Enter your password" required="required" />
      <input id="password2_signup" class="login-input" type="password" name="p2" placeholder="Enter your password again" required="required" />
      
      <button type="submit" class="btn btn-primary btn-block btn-large login-btn" onclick="SIGNUP_Attempt();return false">Register</button>
      <button class="btn btn-primary btn-block btn-large login-btn" onclick="LOGIN_GoTo(); return false;">Log in</button>
    </form>
</div>
</div>`;

let SINGUP_GoTo = () => {
    let everything = document.getElementById("everything");
    everything.innerHTML = SIGNUP_html_code;
}

let SIGNUP_Attempt = () => {
  console.log("Tried to sign up");
  return;
    // TO DO
}