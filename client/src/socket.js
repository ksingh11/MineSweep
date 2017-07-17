/**
 * Created by kaushal on 16/07/17.
 */

/**
 * Create socket connection, register client
 */
(function(){

    //initialize socket connection
    var socket = io();

    // socket on connection established
    socket.on('connect', function() {
        console.log(socket);
        document.getElementById('client_id').innerHTML = socket.id;

        // register client's UID
        socket.emit('join_game', {playerId: getPlayerID()});
    });

    // on game joined
    socket.on('game_joined', function (data) {
        console.log('joined game:' + data);
    });

    // on game joined
    socket.on('game_ready', function () {
        console.log('game ready to play');
    })
}());


/**
 * get client id.
 * first check from browser's local storage, or generate new.
 * Later: client id is supposed to get generated from database.
 * @returns {string}
 */
function getPlayerID() {
    var UNIQUE_ID_KEY = 'clientUniqueId';

    var clientUniqueId = localStorage.getItem(UNIQUE_ID_KEY);
    if(clientUniqueId === null) {
        clientUniqueId = generateUniqueID();
        localStorage.setItem(UNIQUE_ID_KEY, clientUniqueId);
    }
    return clientUniqueId
}


/**
 * Generate random string
 * @returns {string}
 */
function generateUniqueID() {
    return Math.random().toString(36).substring(3,16) + new Date;
}
