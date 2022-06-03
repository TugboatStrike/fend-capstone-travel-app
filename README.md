# Project description

This project creates a server with a client webpage all localhost on port 8080.

the purpose is for the user to use the website to check strings of text against
a Natural Language Processing api. the NLP being used is meaning cloud.

the user will use the webpage to enter text. when submitted the text is ran through
the NLP and the sentiment response is shown on the website.

## Initial install

The required packages are set up for a simple `npm install` command. you will
need to be in the directory before running the install.

## Setting up the .env file

The environment `.env` file will need to be created in the root directory.
In the file the following will need to be added. after creating an account on
https://www.meaningcloud.com/developer/login

`MEANING_CLOUD_API_KEY=**************************`

## Starting the Server

The server can be started by running the start command

`npm start`
