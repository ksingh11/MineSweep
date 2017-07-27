/**
 * Created by kaushal on 16/07/17.
 */

/**
 * Create socket connection, register client
 */
(function(){

    // Client interface to communicate b/w server and game object
    window.Client = {};

    // initialize socket connection
    Client.socket = io.connect();

    // socket on connection established
    Client.socket.on('connect', function() {
        console.log('Socket id: ' + Client.socket.id);
    });

    // register user
    Client.joinGame = function (username) {
        // register client's UID
        Client.socket.emit('join_game', {playerId: username});

        // initialize game
        Game.init();
    };

    /*********************************************************
     ************* Game Boot events **************************/

    // on game joined
    Client.socket.on('game_joined', function (data) {
        console.log('joined game:' + JSON.stringify(data));
    });

    // on game joined
    Client.socket.on('game_reconnected', function (data) {
        console.log('reconnected to game:' + JSON.stringify(data));
    });

    // on game joined
    Client.socket.on('game_ready', function () {
        console.log('game ready to play');
    });

    Client.socket.on('game_started', function (msg) {
       console.log(msg);
    });

    Client.socket.on('player_added', function (msg) {
        console.log('Player added: ' + JSON.stringify(msg));
    });

    Client.socket.on('player_left', function (msg) {
        console.log('Player left: ' + JSON.stringify(msg))
    });

    Client.socket.on('game_close', function (msg) {
        console.log('Closing Game: ' + msg);
    });

    // generic 'message' event, mostly to communicate error message from server:
    Client.socket.on('message', function (message) {
        console.log(message);
    });


    /*********************************************************
     ************* Game play events **************************/

    // plot bomb
    Client.plantBomb = function () {
        Client.socket.emit('plant_bomb', {message: 'hello'});
    };

    // sweep tile
    Client.sweepTile = function () {
        Client.socket.emit('sweep_tile', {message: 'hello'});
    };

    // game state
    Client.socket.on('state_update', function (data) {
        Game.updateState(data);
    })

}());
