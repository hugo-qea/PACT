const mongoose = require('mongoose');

const UserSchema  = new mongoose.Schema({
name : {
	//pseudo
	type  : String,
	required : true
},
email : {
    type  : String,
    required : true
} ,
secteur : {
    //secteur d'études ou d'activités, choix parmi une sélection prédéfinie
    type : String,
    required : true
},
password : {
    //mot de passe
    type  : String,
    required : true
} ,
date : {
    //date d'enregistrement du compte
    type : Date,
    default : Date.now
}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;