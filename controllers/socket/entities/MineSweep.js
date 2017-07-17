var AllPlayers = require('./AllPlayers');


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
    this.Players = AllPlayers.getPlayers;
    this.gameData = {};
    this.gameData.games = [];

}


/**
 * return instance instead of Constructor object
 * @type {MineSweep} singleton object
 */
module.exports = new MineSweep();
