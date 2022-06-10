# poznamky

This is my high school graduation project with very original name "Poznámky" - in English "Notes".
It's a web app where users can write down their notes, tasks and create simple lists.
Purpose of this project was to learn how to use [Django REST Framework](https://www.django-rest-framework.org/)
on top of [Django](https://djangoproject.com/), get better with [React](https://reactjs.org/)
and learn how to create REST API and integrate it with React app.

## Structure

### Client

React app is located in [klient](klient) folder. [src](klient/src) folder contains all the source code,
all routes this app has are written in [App.js](klient/src/App.js). Pages and layout are located in folder [Stranky](klient/src/Stranky)
which is separated by type of pages. Other components (Buttons, Navbar, Modal, etc.) are located in [UI](klient/src/UI) folder.
[context](klient/src/context) folder contains Authentication context to be accessible for whole app.

Types of pages:

- PoznamkyZoznamy: NotesTask - they are written together in most of the app because it uses very similar logic.
- Ulohy: Tasks.

[build](klient/build) folder should probably not be in remote repo.

### Server

Django project is located in [server](server) folder. [python-kniznice.txt](server/python-kniznice.txt)
is equivalent to requirements.txt file found in python projects, is contains required python libraries.
Django server serves React app from [klient/build](klient/build) folder.

### Server Node.js

Folder named server-node contains server rewritten in Typescript using [express.js](https://expressjs.com/) framework
and [prisma](https://www.prisma.io/) ORM,
it was made for learning purposes, it's fully compatible with React client app.
