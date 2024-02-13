const express = require('express');
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");

const app = express();
const PORT = 8080;

// Connexion à la DB mongoDB
const MONGO_URL = 'mongodb://localhost/test'; //jobdiscovery
mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology : true, family: 4})
.then(() => console.log(`Connected to : ${MONGO_URL}`))
.catch((err) => console.log(`Connection to ${MONGO_URL} failed with : ${err}` ));

// Le moteur de template utilisé est EJS
app.set('view engine', 'ejs');
// app.set('views', __dirname + '/server/views');

// middleware permettant de parser les requetes urlencoded (requetes POST)
app.use(express.urlencoded({extended : false}));
// middleware permettant de stocker des informations sur une connection coté serveur
app.use(session({
	secret : 'secret',
	resave : true, // Indique au session store que la session est toujours active quand une requete est faite même si la session n'est pas modifiée
	saveUninitialized : true // La session doit elle-etre sauvegardée même si aucune information n'a été enregistrée ?
}));

//Configuration du middleware d'authentification passport:
require('./server/methods/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Middleware permettant de stocker des messages en particulier pour la redirection de l'utilisateur
app.use(flash());
// Messages de succès ou d'erreur à afficher sur la page
app.use((req, res, next)=> {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error  = req.flash('error');
	next();
});

app.get('/gameTest', (req, res) => {
	res.sendFile(__dirname + '/client/game.html')
})

//Routage de l'utilisateur vers les différentes pages
app.use('/', require('./server/routes/index'));
app.use('/users', require('./server/routes/users'));
app.use('/game', require('./server/routes/game'));

// Servir des fichiers statiques avec express
app.use(express.static('public'));
app.use(express.static('dist'));

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${ PORT }`);
});