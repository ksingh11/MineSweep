var Player = require('./Player');
var Game = require('./Game');
var logger = require('libs').getlogger;
var constants = require('libs/constants');


/**
 * Global game object, all other games are enclosed within it.
 * will be responsible for:
 * - creating new game
 * - managing players in game
 * - game rules
 * - etc.
 * @constructor
 */
function MineSweep() {
    this.allPlayers = {};
    this.allGames = {};
}


/**
 * return game object with game id
 * @param gameID
 * @returns {boolean}
 */
MineSweep.prototype.getGameById = function (gameID) {
    if(gameID in this.allGames) {
        return this.allGames[gameID];
    } else {
        logger.debug('Game not found for id: ' + gameID);
        return false;
    }
};


/**
 * Create new game
 * @param numPlayers
 */
MineSweep.prototype.createNewGame = function (numPlayers) {
    var newGame = new Game(numPlayers);

    // add game to global game list
    this.allGames[newGame.id] = newGame;

    // return game object
    return newGame;
};


/**
 * find open games of create new game and join
 * also validate if player has already joined some other game
 * @param socket: current client's (user's) socket
 * @param playerId
 */
MineSweep.prototype.joinGame = function (socket, playerId) {
    var openGame = null;

    // check if player is already in some game, return false
    if (playerId in this.allPlayers) {
        return false;
    }

    // try to find open games, where players are short
    for(var gameKey in this.allGames) {

        if (this.allGames.hasOwnProperty(gameKey)) {
            var game = this.allGames[gameKey];

            if (game.isAvailableToJoin()) {
                openGame = game;
                logger.debug('player ' + playerId + ' Found an open game ' + game.id);
                break;
            }
        }
    }

    // if no game found, create a new game
    if (openGame === null) {
        openGame = this.createNewGame();

        logger.debug('player ' + playerId + ' created new game ' + openGame.id);
    }

    // At this point we have a game, either from open games or a newly created game
    // Now join player to the game
    var newPlayer = new Player(playerId, openGame.id);
    openGame.addGamePlayer(socket, newPlayer);

    // add this player to all players list
    this.allPlayers[playerId] = newPlayer;
    logger.debug('Total players in game are: ' + Object.keys(this.allPlayers).length);

    return openGame;
};


/**
 * Attempt to reconnect player,
 * validate game join request but has already joined in some game.
 * Also, if player is getting reconnected once check if disconnect lock is set,
 * otherwise he might get disconnected anytime if scheduled from some earlier routine
 * @param socket
 * @param playerId
 * @returns {boolean|Game}
 */
MineSweep.prototype.attemptReconnect = function (socket, playerId) {
    var gameId = null;

    // check if player is already in some game, return the same game object
    if (playerId in this.allPlayers) {
        gameId = this.allPlayers[playerId].gameId;

        // fetch old game and return
        logger.debug('player ' + playerId + ' Already in game: ' + gameId + ' Reconnecting...');
        var oldGame = this.getGameById(gameId);

        // join into the game room
        if (oldGame && oldGame.joinRoom(socket)) {

            // set player's disconnect lock
            this.allPlayers[playerId].setDisconnectLock();
            logger.debug('Setting disconnectLock for player: ' + playerId);

            // return game object
            return oldGame;
        }
    }

    // game not found
    return false;
};


/**
 * remove player from game
 * - remove from global player list
 * - remove from game and update game state accordingly
 * - check if game has less than minimum required player, delete the game object
 * @param io
 * @param socket
 * @param playerId
 */
MineSweep.prototype.removePlayer = function(io, socket, playerId) {
    logger.debug('Removing player player: ' + playerId);
    var gameId = this.allPlayers[playerId].getGameId();
    delete this.allPlayers[playerId];

    this.allGames[gameId].removeGamePlayer(io, socket, playerId);

    // check number of players
    if (this.allGames[gameId].getPlayerCount() < constants.MIN_PLAYERS_TO_START) {
        this.abandonGame(io, socket, gameId);
    }
};


/**
 * Close game prematurely:
 * - delete game object
 * - delete players
 * @param io
 * @param socket
 * @param gameId
 */
MineSweep.prototype.abandonGame = function (io, socket, gameId) {
    var game = this.allGames[gameId];

    // delete game from global list
    delete this.allGames[gameId];

    // remove players from global players list
    var players = game.getPlayers();
    for (var playerId in players) {
        if (players.hasOwnProperty(playerId)) {
            delete this.allPlayers[playerId];
        }
    }

    // destroy game data
    game.destroy(io);
};


/**
 * on disconnected socket, set player's disconnectLock flag.
 * this flag is checked before final disconnection
 */
MineSweep.prototype.markPlayerDisconnected = function (playerId) {
    if (playerId in this.allPlayers) {
        this.allPlayers[playerId].releaseDisconnectLock();
        logger.debug('Releasing disconnectLock for player: ' + playerId);
    }
};


/**
 * disconnect player.
 * First check if disconnect lock is not set on player
 * @param io
 * @param socket
 * @param playerId
 */
MineSweep.prototype.disconnectPlayer = function (io, socket, playerId) {
    if(playerId in this.allPlayers) {
        // check if player is locked, first release the lock
        if(this.allPlayers[playerId].isDisconnectLocked()) {
            logger.debug('unable to remove player, disconnect lock set. Release the lock to disconnect');
            return false;
        }
        else {
            // remove player
            this.removePlayer(io, socket, playerId);
        }
    }
};


/**
 * return instance instead of Constructor object
 * @type {MineSweep} singleton object
 */
module.exports = new MineSweep();
