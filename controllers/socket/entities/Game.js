/**
 * Created by kaushal on 22/07/17.
 */

var constants = require('libs/constants');
var Tile = require('./Tile');
var utils = require('libs/utilities');
var logger = require('libs').getlogger;


/**
 * Individual game object, which has to be played.
 * - Initialize game config.
 * @param numPlayers: optional, total number of players in a game.
 * @constructor
 */
function Game(numPlayers) {
    // game unique id
    this.id = generateGameId();
    this.roomId = generateRoomId(this.id);

    // total/maximum number of players
    this.playerLimit = numPlayers || constants.NUM_PLAYERS;

    // minimum players to commence game
    this.minPlayerToStart = constants.MIN_PLAYERS_TO_START;

    // allow players to join after game started
    this.allowLateJoin = constants.ALLOW_LATE_JOIN;

    // flag: if game started
    this.gameStarted = false;

    // list of players in game, list of Player object
    this.players = {};

    // tile references in game, list of Tile object
    this.tiles = {};

    // assign tiles to game, also assign a id to tiles
    var numTiles = constants.NUM_TILES;
    for (var id=1; id<=numTiles; id++) {
        this.tiles[id] = new Tile(id);
    }
}


/**
 * return game id
 */
Game.prototype.getId = function () {
    return this.id;
};


/**
 * return game's room id
 */
Game.prototype.getRoomId = function () {
    return this.gameId;
};


/**
 * check if game is available to join
 * @returns {boolean}
 */
Game.prototype.isAvailableToJoin = function () {
    var playerCount = Object.keys(this.players).length;

    // if game is started and late join is not allowed
    if (this.gameStarted && !this.allowLateJoin) {
        return false;
    }

    // if all players joined
    if (playerCount === this.playerLimit) {
        return false;
    }

    // still, accepting players
    return true
};


/**
 * return total number of players in game
 * @returns {Number}
 */
Game.prototype.getPlayerCount = function () {
    return Object.keys(this.players).length;
};


/**
 * return list of players in game
 */
Game.prototype.getPlayers = function () {
    return this.players;
};


/**
 * Add player to game.
 * Add player to room (socket io).
 * @param newPlayer: Player instance
 * @param socket: user's client socket
 * @returns {Number}
 */
Game.prototype.addGamePlayer = function(socket, newPlayer) {
    // add player to game
    this.players[newPlayer.getId()] = newPlayer;

    // add player to socket io room
    socket.join(this.roomId);
    logger.debug('player joined the game, and room: ', this.roomId);

    // broadcast message
    socket.broadcast.to(this.roomId).emit('player_added', newPlayer.id);

    logger.debug('Game: ' + this.id + ' Players: ' + Object.keys(this.players).length);
    return Object.keys(this.players).length;
};


/**
 * remove player from game:
 * - delete player from list
 * - leave game room
 * - broadcast to everyone
 * @param io
 * @param socket
 * @param playerId
 */
Game.prototype.removeGamePlayer = function (io, socket, playerId) {
    delete this.players[playerId];

    // leave game room
    socket.leave(this.roomId);

    // broadcast message
    socket.broadcast.to(this.roomId).emit('player_left', playerId);
};


/**
 * validate if game can be started to play
 * @returns {boolean}
 */
Game.prototype.isReadyToPlay = function () {
    var playerCount = Object.keys(this.players).length;
    return playerCount >= this.minPlayerToStart;
};


/**
 * join provided socket to game room
 * @param socket
 */
Game.prototype.joinRoom = function (socket) {
    socket.join(this.roomId);
    return true;
};


/**
 * Commence game to play.
 * notify each player, set flags
 * @param io: socket io instance
 * @param socket: socket object for current executing client
 */
Game.prototype.startGame = function(io, socket) {
    if(!this.gameStarted) {
        this.gameStarted = true;
        io.to(this.roomId).emit('game_started', 'Winter is finally here. look for Dragon glass, save the north!');

        logger.debug('game started, id: ' + this.id);
    }
    else {
        // since game is already started, this request must be from late joiner.
        // emit event only to current client
        logger.debug('game already running, id: ' + this.id + '. Emitting event only to current client');
        socket.emit('game_started', 'Winter is finally here. look for Dragon glass, save the north!');
    }

};


/**
 * Broadcast game state to players
 * @param io: socket.io instance
 */
Game.prototype.broadcastGameState = function (io) {
    // to implement
};


/**
 * return if game has started
 * @returns {boolean}
 */
Game.prototype.isGameStarted = function () {
    return this.gameStarted;
};


/**
 * destroy game:
 * - emit message to players who are still here
 * - * ask sockets to leave the room * not working
 * - clean players & tiles list
 * @param io
 */
Game.prototype.destroy = function (io) {
    // publish game close event
    io.to(this.roomId).emit('game_close');

    // clean player list
    this.players = {};
    this.tiles = {};

    logger.debug('Destroyed game, id: ' + this.id);
};


/********************************************
/*********** Utility functions **************/

/**
 * utility:
 * return unique game id
 */
function generateGameId() {
    return utils.generateUniqueID();
}


/**
 * utility:
 * return room id for socket.io room
 */
function generateRoomId(gameId) {
    return gameId;
}


/**
 * export Game constructor
 * @type {Game}
 */
module.exports = Game;
