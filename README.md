# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 2

This is the client side application for the stage 2 MWS Nano Degree. The static assets are served via a simple express static server on port 3000. If you need to adjust the port settings they can be found in the server.js file at the root directory.

The project is configured to build static assets using gulp tasks and all production files will be placed in the 'dist' directory when you run the `gulp` command from the root directory.

The data set relies on the mock API which can be found in the following repository [Api Repo here!](https://github.com/motosharpley/mws-stage-2) there are installation and start-up instructions accordingly in the readme.md file 

### Installation and start up

> After cloning the repository to your local machine and assuming you already have Nodejs installed start by running `npm install` in the root directory

> Now just run `npm start` and the client will be running on localhost:3000

> Remember to also start the api server which will be running on port 1337

> To start the development environment run `npm run dev` this will run gulp to build dist files, nodemon to hot reload the server, and gulp watch to rebuild dist files upon changes to files in the src directory
