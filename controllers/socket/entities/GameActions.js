/**
 * Created by kaushal on 26/07/17.
 * actions.js
 *
 * Handles, game actions from player.
 *
 * All, methods should accept parameters:
 * (io, socket, MineSweep, game, action, data)
 * @param io: global socket io handle
 * @param socket: current player client's socket
 * @param MineSweep: global game object, almost parent of everything
 * @param action: socket event emitted
 * @param data: data supplied along with event
 */


/**
 * mapping of socket io events with action
 */
var GameActions = {
    plant_bomb: plantBomb
};


/**
 * export game action mapping
 */
module.exports = GameActions;


/************************************************
********** Define game actions below ************/


/**
 * Place bomb
 */
function plantBomb(io, socket, MineSweep, action, data) {
    console.log('Action: ' + action + JSON.stringify(data));
}

