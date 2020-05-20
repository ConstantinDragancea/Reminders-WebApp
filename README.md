# Reminders-WebApp
A web app to help with productivity.

**Criterii de acceptanta:**

- [x] aplicatia sa fie [Single Page Application](https://en.wikipedia.org/wiki/Single-page_application)
- [x] codul sursa (nearhivat) al proiectului trebuie sa fie salvat pe [GitHub](https://github.com/ConstantinDragancea/Reminders-WebApp)
- [x] nu puteti folosi librarii, framework-uri [CSS](https://en.wikipedia.org/wiki/CSS_framework) sau [JavaScript](https://en.wikipedia.org/wiki/JavaScript_framework) (cum ar fi jQuery, Bootstrap, Angular, React, etc) pentru realizarea frontend-ului

#### Frontend (maxim 17 puncte)

##### HTML si CSS (maxim 8 puncte)

- [x] Fisiere separate pentru HTML si CSS (0.5 puncte)
- [x] In interiorul documentelor HTML, sa se foloseasca minim 4 [taguri semantice](https://www.w3schools.com/html/html5_semantic_elements.asp) (1 punct)
- [x] Stilurile CSS sa fie definite folosind clase direct pe elementele care trebuie stilizate (minim 80% din selectori) (0.5 punct)
- [x] Layout-ul sa fie impartit in minim 2 coloane si sa fie realizat cu [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) si/sau [CSS grid](https://css-tricks.com/snippets/css/complete-guide-grid/) (2 puncte)
```css
/* current_reminders.css */

.body-layout {
    ...
    display: grid;
    grid-template-columns: 100px auto 100px;
    grid-template-rows: 80px 1fr 50px;
    grid-template-areas:
    ". header ."  
    ". main ."
    ". footer .";
    ...
}
```
- [x] Site-ul sa fie [responsive](https://www.w3schools.com/html/html_responsive.asp), respectand rezolutiile urmatoarelor dispozitive folosind [media queries](https://www.uxpin.com/studio/blog/media-queries-responsive-web-design/): (4 puncte)
  - telefon mobil - latime mai mica 768px
  - tableta - latime intre 768px si 1280px
  - desktop - latime mai mare de 1280px
```css
/* current_reminders.css */
@media screen and (max-width: 1280px) {
  .....
}

@media screen and (max-width: 768px) {
  .....
}
```

##### Javascript (maxim 9 puncte)

- [x] Fisier separat JavaScript (0.5 puncte)
- [x] Manipularea DOM-ului (crearea, editarea si stergerea elementelor/nodurilor HTML) (3 puncte)
- [x] Folosirea evenimentelor JavaScript declansate de mouse/tastatura (1 punct)
```js
// menu.js
let create_note_html = (note, codFunc) => {
  let note_entry = document.createElement('div');
  note_entry.setAttribute('class', 'note-entry');

  let title = document.createElement('div');
  title.setAttribute('class', 'title');
  title.innerHTML = "<p>" + note.title + "</p>";
  note_entry.appendChild(title);
  ...
  ...
  ...
  note_entry.appendChild(done_button_wrapper);

  return note_entry;
}
```
- [x] Utilizarea [AJAX](https://www.w3schools.com/xml/ajax_intro.asp) ([GET, POST, PUT, DELETE](http://www.restapitutorial.com/lessons/httpmethods.html)) (4 puncte)
```js
fetch('users/' + window.localStorage.getItem('token'))

fetch('user/newnote', {
  method: 'POST',
  headers: {
    "Content-type": "application/json"
  },
  body: JSON.stringify(req_body)
})

fetch('user/editnote', {
  method: 'PUT',
  headers: {
    "Content-type": "application/json"
  },
  body: JSON.stringify(req_body)
})

fetch('user/deletenote', {
  method: 'DELETE',
  headers: {
    "Content-type": "application/json"
  },
  body: JSON.stringify(req_body)
})
```
- [x] Folosirea localStorage (0.5 puncte)
```js
// menu.js
window.localStorage.getItem('token');

window.localStorage.removeItem('token')
```

#### Backend API (maxim 8 puncte)

- [x] Creare server Backend (2 puncte)
```js
// index.js
const express = require('express');
const app = express();
```
- [x] CRUD API (Create, Read, Update si Delete) pentru a servi Frontend-ului (6 puncte)
```js
app.post('/user/newnote', (req, res) => {
    ....
})

app.get('/users/:token', (req, res) => {
    ....
})

app.put('/user/markasundonenote', (req, res) => {
    ....
})

app.delete('/user/deletenote', (req, res) => {
    ....
})
```