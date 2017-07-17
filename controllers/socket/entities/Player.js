/**
 * Created by kaushal on 17/07/17.
 */


/**
 * Individual player of game
 * @constructor
 */
function Player(playerId, gameId, socketId) {
    this.id = playerId;
    this.gameId = gameId;
    this.socketId = socketId;
}


/**
 * Exporting Player constructor.
 * Anyone importing has to instantiate the player.
 * @type {Player}
 */
module.exports = Player;
