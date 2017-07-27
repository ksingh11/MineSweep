var logger = require('libs').getlogger;
var MineSweep = require('./entities/MineSweep');
var constants = require('libs/constants');


/**
 * Export modules
 */
module.exports = {
    gameSocketHandler: gameSocketHandler
};


/**
 * socket.io connection handler
 * @param io
 */
function gameSocketHandler(io) {
    io.on('connection', function (socket) {

        // join game request request
        socket.on('join_game', function (data) {

            logger.debug('join_game request from player, '+ JSON.stringify(data));

            // attach player id to socket object, for reference
            var playerId = data.playerId;
            socket.playerId = playerId;

            // on join request first attempt to reconnect player,
            // as player might already in some game
            var existingGame = MineSweep.attemptReconnect(socket, playerId);
            if (existingGame) {
                socket.emit('game_reconnected', {gameId: existingGame.id});

                // check if game has already started, send current game state
                if(existingGame.isGameStarted()) {
                    existingGame.broadcastGameState(io);
                }
                return;
            }

            // player has not already joined
            // find a game for player, and notify him
            var openGame = MineSweep.joinGame(socket, playerId);
            socket.emit('game_joined', {gameId: openGame.id});

            // check if game is ready to be played
            if(openGame.isReadyToPlay()) {
                socket.emit('game_ready');

                logger.debug('Game ready to play. game id:' + openGame.id);
                openGame.startGame(io, socket);
            }
        });


        // Leave game request
        socket.on('leave_game', function () {
            var playerId = socket.playerId;
            if (playerId) {
                MineSweep.removePlayer(io, socket, playerId);
            }
        });


        /**
         * Game actions: events triggers while playing game
         * MineSweep.gameActions(io, socket, action, data);
         */
        // place bomb event
        socket.on('plant_bomb', function (data) {
            if(socket.playerId){
                MineSweep.gameActions(io, socket, 'plant_bomb', data);
            }
        });


        /**
         * On client disconnect.
         * Do not remove player from game immediately,
         * - as might be browser refresh or some connection issue
         * - schedule disconnect after a while.
         * - also, mark player removable by releasing the disconnect lock
         */
        socket.on('disconnect', function () {
            var playerId = socket.playerId;

            if(playerId) {
                logger.debug('socket disconnected, scheduling player to disconnect, socketId: ' + socket.id);

                var disconnectTimeout = constants.PLAYER_DISCONNECT_TIMEOUT || 2000;

                MineSweep.markPlayerDisconnected(playerId);
                setTimeout(function(){
                    MineSweep.disconnectPlayer(io, socket, playerId);
                }, disconnectTimeout)
            }
            else {
                logger.debug('socket disconnected');
            }
        })
    });
}
