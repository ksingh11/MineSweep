var logger = require('libs').getlogger;
var MineSweep = require('./entities/MineSweep');


/**
 * Export modules
 */
module.exports = {
    socketHandler: socketHandler
};


/**
 * socket.io connection handler
 * @param io
 */
function socketHandler(io) {
    io.on('connection', function (socket) {

        socket.on('join_game', function (data) {
            logger.debug('join_game request from player, '+ JSON.stringify(data));
            var playerId = data.playerId;
            socket.playerId = playerId;


            // find game for player, and notify player
            var game = MineSweep.joinGame(playerId, socket.id);
            socket.emit('game_joined', {game: game});
            logger.debug('New player joined the game:' + game.id + 'with player id:' + playerId);

            // check if game is ready to be played
            var isGameReady = MineSweep.isGameReady(game);
            if(isGameReady) {
                logger.debug('Game ready to play state:' + game.id);
                io.emit('game_ready');
            }
        });

        // on client disconnect
        socket.on('disconnect', function () {
            logger.debug('socket disconnected:' + socket.id);
        })
    });
}
