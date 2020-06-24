
/* TODO
    Sa nu uit sa o pun undeva pe site
*/
let getDiffDates = (date1, date2) => {
    if (date2 > date1){
        return "Second date is bigger than the first";
    }

    return getDiffDatesFormatted(date1.getTime() - date2.getTime());

}


let getDiffDatesFormatted = (diffAsMilliseconds) => {
    let diff = diffAsMilliseconds;
    let tm = 1000 * 60 * 60 * 24 * 365;

    let years = Math.floor(diff / tm);
    diff %= tm;

    tm = (tm / 365) * 31;
    let months = Math.floor(diff / tm);
    diff %= tm;
    
    tm /= 31;
    let days = Math.floor(diff / tm);
    diff %= tm;

    tm /= 24;
    let hours = Math.floor(diff / tm);
    diff %= tm;

    tm /= 60;
    let minutes = Math.floor(diff / tm);
    diff %= tm;

    tm /= 60;
    let seconds = Math.floor(diff / tm);

    let message = `${years} years ${months} months ${days} days, ${hours} hours ${minutes} minutes ${seconds} seconds`;
    return message;
}


let timeLeftAlive = (birthdate) => {
    // Average life expectancy in Romania: 75 years
    // source: https://ec.europa.eu/health/sites/health/files/state/docs/2019_chp_romania_romanian.pdf?fbclid=IwAR3CQJ7UKkbJa9hz7R9iJ-8QjUFfUkR8JdryOs1xX9cdaUA2zrY-QhpJPWs

    const expectancy = 75 * 365 * 24 * 60 * 60 * 1000;
    const timeSinceBorn = new Date() - birthdate;
    return getDiffDatesFormatted(expectancy - timeSinceBorn);
}

let wordCounter = () => {
    let to_count = document.getElementsByClassName('word-count');
    let wordCount = 0;

    const word_match = /\w+/g

    for (let i = 0; i < to_count.length; i++){
        let str = to_count[i].innerHTML.trim();
        wordCount += ((str || '').match(word_match) || []).length;
    }

    return wordCount;

}

let updateDivDates = () => {
    let birthdate = window.localStorage.getItem('birthdate');
    birthdate = new Date(birthdate);
    let now = new Date();
    // Time since birth -------------------------------
    let time_since_birth_p = document.getElementById('user-age');
    time_since_birth_p.innerHTML = `age: ${getDiffDates(now, birthdate)}`;

    // Time left alive --------------------------------
    let time_left_alive_p = document.getElementById('time-left-alive');
    time_left_alive_p.innerHTML = `${timeLeftAlive(birthdate)} left alive`;

}

let updateAfterLoad = () => {
    setWordCountFooter();
    showLastLogin();
    setInterval(updateDivDates, 1000);
}

let setWordCountFooter = () => {
    let footer = document.getElementsByClassName('footer')[0];
    let footer_p = footer.children[0];

    footer_p.innerHTML += ` (${wordCounter()} words on this page)`;
}

let showLastLogin = () => {
    let last_login_h = document.getElementById('last-login');

    let last_login_time = window.localStorage.getItem('last_login_time');
    let last_login_ip = window.localStorage.getItem('last_login_ip');
    if (last_login_ip !== null && last_login_ip !== 'undefined') {
        last_login_h.innerHTML = `Ultima intrare: [${time_formatted(new Date(last_login_time))}] from [${last_login_ip}]`;
    }
    else{
        last_login_h.innerHTML = `Este prima data cand te autentifici!`;
    }
}

let time_formatted = (time) => {
    let hrs = (time.getHours() < 10 ? '0' : '') + time.getHours();
    let mins = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
    let secs = (time.getSeconds() < 10 ? '0' : '') + time.getSeconds();

    return `${time.toLocaleDateString()}, ${hrs}:${mins}:${secs}`;
}