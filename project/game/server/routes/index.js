const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require('../methods/registration');

//Page d'enregistrement
router.get('/register', (req, res)=>{
    res.render('register');
})
//Page de menu post-connexion
router.get(['/', '/dashboard'], ensureAuthenticated, (req, res)=>{
    res.render('dashboard', {
        user: req.user
    });
})

module.exports = router; 