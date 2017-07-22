/**
 * Created by kaushal on 17/07/17.
 */


/**
 * Individual player of game
 * @param playerId: player unique id
 * @param gameId: player's current game id
 * @constructor
 */
function Player(playerId, gameId) {
    this.id = playerId;
    this.gameId = gameId;

    // prevent player from getting removed/disconnected from game if set true.
    this.disconnectLock = true;
}

/**
 * getter for player id
 */
Player.prototype.getId = function () {
    return this.id;
};


/**
 * check if given player id belongs to this object
 * @param playerId
 * @returns {boolean}
 */
Player.prototype.isMe = function(playerId) {
    return playerId === this.playerId;
};


/**
 * return game id
 */
Player.prototype.getGameId = function() {
    return this.gameId;
};


/**
 * set player disconnect lock
 * now he won't be getting removed from game
 */
Player.prototype.setDisconnectLock = function() {
    this.disconnectLock = true;
};


/**
 * set player's disconnect lock to false,
 * now player is removable from game
 */
Player.prototype.releaseDisconnectLock = function () {
    this.disconnectLock = false;
};

/**
 * return if player is locked from being disconnected
 * @returns {boolean}
 */
Player.prototype.isDisconnectLocked = function () {
  return this.disconnectLock;
};


/**
 * Exporting Player constructor.
 * Anyone importing has to instantiate the player.
 * @type {Player}
 */
module.exports = Player;
