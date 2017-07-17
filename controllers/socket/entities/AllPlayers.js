/**
 * Created by kaushal on 17/07/17.
 */

/**
 * Holds each and every player who are playing game on this platform.
 * helpful in features like: validation, reconnecting players etc.
 * @constructor
 */
function AllPlayers() {
    this.PlayersData = {};
    this.PlayersData.playerList = [];
}


/**
 * Add new player to game
 * @param player
 */
AllPlayers.prototype.addPlayer = function(player) {
    this.PlayersData.playerList.push(player);
};


/**
 * Export instance of AllPlayer object
 */
module.exports.getPlayers = new AllPlayers();
