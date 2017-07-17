var Player = require('./Player');
var GameTile = require('./GameTile');
var constants = require('libs/constants');
var utils = require('libs/utilities');
var logger = require('libs').getlogger;


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
    this.gameData = {};

    // All games
    this.gameData.games = {};
    this.gameData.allPlayers = {};
}


/**
 * Create new game
 * @param numPlayers
 */
MineSweep.prototype.createGame = function (numPlayers) {
    // number of players for the game
    numPlayers = numPlayers || constants.NUM_PLAYERS;

    var game = {};
    game.id = utils.generateUniqueID();
    game.playerLimit = numPlayers;
    game.players = [];
    game.tiles = [];

    // assign tiles to game, also assign a id to tiles
    var numTiles = constants.NUM_TILES;

    for (var id=1; id<=numTiles; id++) {
        game.tiles.push(new GameTile(id));
    }

    // store game in game list
    this.gameData.games[game.id] = game;

    // return game object
    return game;
};


/**
 * find open games of create new game and join
 * also validate if player has already joined some other game
 * @param playerId
 * @param socketId
 */
MineSweep.prototype.joinGame = function (playerId, socketId) {
    var gameId = null;
    var gameFound = null;

    // check if player is already in some game, return the same game object
    if (playerId in this.gameData.allPlayers) {
        gameId = this.gameData.allPlayers[playerId].gameId;

        logger.debug('player ' + playerId + ' Already in game ' + gameId);
        return this.gameData.games[gameId]
    }


    // try to find open games, where players are short
    for(var game in this.gameData.games) {
        if(game.players.length < game.playerLimit) {
            gameFound = game;

            logger.debug('player ' + playerId + ' Found an open game ' + gameFound.id);
        }
    }


    // if no game found, create a new game
    if (gameFound === null) {
        gameFound = this.createGame();

        logger.debug('player ' + playerId + ' created new game ' + gameFound.id);
    }


    // At this point we have a game, either from open games or a fresh game
    // Now join player to the game
    var newPlayer = new Player(playerId, gameFound.id, socketId);
    gameFound.players.push(newPlayer);


    // add this player to all players list
    this.gameData.allPlayers[playerId] = newPlayer;
    logger.debug('Total players in game are: ' + Object.keys(this.gameData.allPlayers).length);

    return gameFound;
};


/**
 * check if game is ready to play,
 * ie. all players have joined
 */
MineSweep.prototype.isGameReady = function (game) {
    return game.players.length === game.playerLimit;
};


/**
 * return instance instead of Constructor object
 * @type {MineSweep} singleton object
 */
module.exports = new MineSweep();
