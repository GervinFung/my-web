// Importing libraries
const express = require('express');
const app = express();
const expbs = require('express-handlebars');
const path = require('path');

// Importing files
const routes = require('./routes/handlers');
const port = process.env.PORT || 8080;

// Sending static files with Express 
app.use(express.static('public'));
app.use(express.json({ limit: '10mb'}));
app.use(express.urlencoded({ extended: true }))

const hbs = expbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/main'),

    // create custom express handlebars helpers
    helpers: {
        connect4: () => {
            let i = 0;
            let connect4_board = '<tr>';
            for (let j = 0; j < 7; j++) {
                connect4_board += '<td class="connect4-td "></td>';
                if (j === 6 && i < 5) {
                    connect4_board += '<tr><tr>';
                    i++;
                    j = -1;
                }
            }
            connect4_board += '<tr>';
            return connect4_board;
        },

        tictactoe: () => {
            let tictactoe_board = '<tr>';
            let i = 0;
            for (let j = 0; j < 3; j++) {
                tictactoe_board += '<td class="tictactoe-td "></td>';
                if (j === 2 && i < 2) {
                    tictactoe_board += '<tr></tr>';
                    i++;
                    j = -1;
                }
            }
            tictactoe_board += '</tr>';
            return tictactoe_board;
        },

        dots: (numberOfPage) => {
            if (numberOfPage < 1) {
                throw new Error('Dots error! Portfolio cannot be empty');
            }
            if (numberOfPage === 1) { return ''; }
            let content = '<div id="dots" style="text-align:center">';
            for (let i = 0; i < numberOfPage; i++) {
                content += `<span class="dot"></span>`;
            }
            content += '</div>';
            return content;
        },

        buttons: (numberOfPage) => {
            if (numberOfPage < 1) {
                throw new Error('Buttons error! Portfolio cannot be empty');
            }
            if (numberOfPage === 1) { return ''; }
            let content = '<div class="button">';
                content += `<div id="prev"><img src="images/others/previousButton.jpg" alt=""></div>`;
                content += `<div id="next"><img src="images/others/nextButton.jpg" alt=""></div>`;
            content += '</div>';
            return content;
        },

        languageSelector: (portfolioLang, languages) => {
            let options = '';
            languages.forEach(language => {
                const selected = language === portfolioLang ? 'selected="selected"' : ''
                options += `<option ${selected}>${language}</option>`
            });
            return options;
        }
    }
});

// Express Handlebars Configuration
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// Configure Routes
app.use('/', routes);

app.listen(port, () => {console.log('Server is starting at port ', port);});