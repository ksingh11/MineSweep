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
        socket.emit('register', {clientId: getClientUID()});
    })
}());


/**
 * get client id.
 * first check from browser's local storage, or generate new
 */
function getClientUID() {
    var UNIQUE_ID_KEY = 'clientUniqueId';

    var clientUniqueId = localStorage.getItem(UNIQUE_ID_KEY);
    if(clientUniqueId === false) {
        clientUniqueId = generateUniqueID();
        localStorage.setItem(UNIQUE_ID_KEY, clientUniqueId);
    }
}


/**
 * Generate random script
 * @returns {string}
 */
function generateUniqueID() {
    return Math.random().toString(36).substring(3,16) + new Date;
}
