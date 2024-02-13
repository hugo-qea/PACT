const express = require('express');
const router  = express.Router();
const path = require('path');
const {ensureAuthenticated} = require('../methods/registration');

const domains = require('./domains.js');

//Sélection du modo solo
router.get('/solo', ensureAuthenticated, (req, res) => {
	res.render('solo', { user: req.user });
});

router.get('/solo/choice', ensureAuthenticated, (req, res) => {
	if(req.query.domain == undefined)
		res.render('choice', { user: req.user, domains : domains });
	else
		res.render('subchoice', { user: req.user, domains : domains, domain : req.query.domain });
});

router.get('/play', ensureAuthenticated, (req, res) => {
	res.sendFile(path.resolve('client/game.html'));
});

router.get('/solo/quizz', ensureAuthenticated, (req, res) => {
	res.render('quizz', { user: req.user });
});

//Sélection du mode multijoueurs
router.get('/multiplayer', ensureAuthenticated, (req, res) => {
	res.render('multiplayer', { user: req.user });
});

module.exports = router;
