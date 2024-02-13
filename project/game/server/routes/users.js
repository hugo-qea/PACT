const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { assessingRegistration, ensureAuthenticated, updateAccount, updateControl } = require('../methods/registration.js');
const { saveToDB } = require('../methods/registration.js');
const { sendPassword } = require('../methods/password.js');

//Connexion ou Enregistrement
router.get('/login', (req, res) => {
	res.render('login');
});

router.get('/register', (req, res) => {
	res.render('register');
});

//Bouton se connecter
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect : '/dashboard',
		failureRedirect: '/users/login',
		failureFlash : true
	}) (req,res,next);
});

//Bouton s'enregistrer
router.post('/register', (req,res) => {
	const {name,email, secteur, password, password2} = req.body;
	errors = assessingRegistration(req);
	if(errors.length > 0 ) {
		res.render('register', {errors, name, email, secteur, password, password2});
    } else {
		saveToDB(req,res);
	}
});

//Gestion de la déconnexion
router.get('/logout',(req,res)=>{
	req.logout();
	req.flash('success_msg', 'Vous êtes désormais déconnecté.');
	res.redirect('/users/login');
});

//Gestion récupération de mot de passe
router.get('/forgot', (req, res) => {
	if (req.isAuthenticated())
		res.redirect('/dashboard');
	else
		res.render('forgot');
});

router.post('/forgot', (req, res) => {
	if (req.isAuthenticated())
		res.redirect('/');
	else
		sendPassword(req, res);
});

//Gestion des paramètres profils
router.get('/profile', ensureAuthenticated, (req,res)=>{
    res.render('profile', {
        user: req.user
    });
});

router.post('/profile', (req,res) => {
    errors = updateControl(req);
	if(errors.length > 0 )
		res.render('profile', {errors});
    else
		updateAccount(req,res);
});

router.get('/success', (req, res) => {
    res.render('success');
})

module.exports = router;