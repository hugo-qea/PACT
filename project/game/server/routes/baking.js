const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require('../methods/registration');
const path = require ('path');

router.get('/', ensureAuthenticated, (req, res) => {
    res.redirect('http://localhost:8080/game.html')
});

module.exports = router;