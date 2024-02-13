const socket = io()
let playerNum = 0
let gameMode = 'multiplayer'

//obtention du numéro de joueur
socket.on('Numéro joueur', num =>{
    if (num==-1){
        infoDisplay.innerHTML='Désolé, le serveur est rempli'
    } else {
        playerNum = parseInt(num)
    console.log(playerNum)
    }
})

//connection d'un autre joueur
socket.on('connection du joueur', num =>{
    console.log('Joueur numéro ${num} a connecté')
})