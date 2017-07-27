/**
 * Created by kaushal on 17/07/17.
 */
module.exports = {

    // number of game tiles
    NUM_TILES: 111,

    // number of players in the game
    NUM_PLAYERS: 4,

    // minimum players required to start game
    MIN_PLAYERS_TO_START: 1,

    // allow players to join after game has started
    ALLOW_LATE_JOIN: true,

    // grace period for user to reconnect
    PLAYER_DISCONNECT_TIMEOUT: 2000,

    // validate if game has started, before recording user action on game
    VALIDATE_GAME_STARTED_BEFORE_ACTION: true,
};
