(function () {

    /**** Define weapons  ******/

    // Weapon: Bomb
    var Bomb = {
        name: 'bomb',
        count: 0,
        image: "/assets/images/bombSmoothLarge.png",
        addBomb : function (num) {
            this.count += num;
        }
    };

    // Weapon: Spade
    var Spade = {
        name: 'spade',
        count: 0,
        image: "/assets/images/Dead.png",
        addSpade : function (num) {
            this.count += num;
        }
    };


    /**
     * Tile constructor
     */
    function Tile(id) {
        this.id = id
    }


    /**
     * Initialize Game
     * interface b/w socket and UI
     */
    window.Game = {};

    // game players, all players in Game
    Game.players = {};

    // current player's data
    Game.profile = {};

    // hold all the game tiles
    Game.tiles = {};

    // game weapons
    Game.weapons = {
        order: ['bomb', 'spade'],   // order of weapon to select
        selected: null, // index of selected weapon, from order
        bomb: Bomb,
        spade: Spade,
        nextWeapon: function () {
            this.selected = (this.selected + 1) % this.order.length;
            console.log('selected: ' + this.order[this.selected]);
        },
        selectByName: function (name) {
            var index = this.order.indexOf(name);
            // update selected weapon if valid selection
            if (index >= 0) {
                this.selected = index;
            }
            console.log('selected: ' + this.order[this.selected]);
        }
    };


    // initialize game
    Game.init = function () {
        // register click listeners
        var config = {
            tileCount: 111,
            tileColumns: 14,
            arenaWidth: 700,
            rowShift: 13,
            displayTime: 25
        };

        // place tiles on game
        var tileCurrRow = 0;
        var $tileWrapper = $('.tile-wrapper');

        for(var id=1;id<=config.tileCount;id++) {

            // create tile with id
            this.tiles[id] = new Tile(id);

            // update current row for the current tile id
            tileCurrRow = parseInt((id-1)/config.tileColumns);

            if( tileCurrRow % 2 === 0){

                $tileWrapper.append('<div class="tile shift-left" id="' + id + '"></div>');
            } else {
                $tileWrapper.append('<div class="tile shift-right" id="' + id + '"></div>');
            }
        }

        // update ui style: css
        $tileWrapper.css('width', config.arenaWidth);
        $('.player-wrapper').css('width', config.arenaWidth + 200 + 'px');
        $('.header').css('width', config.arenaWidth + 200 + 'px');

        $('.shift-left').css('left', '-' + config.rowShift + 'px');
        $('.shift-right').css('left', config.rowShift + 'px');
        $('.time').text(config.displayTime);


        // initialize weapons
        this.weapons['bomb'].addBomb(5);
        this.weapons['spade'].addSpade(5);

        // select default weapon
        this.weapons.selectByName('bomb');

        // set event for 'space bar' press from keyboard, switch to next weapon
        $(window).on('keyup', keyBoardEventHandler);

        // set click handler on tiles
        $('.tile').on('click', tileClickHandler);

        console.log('Game started');
    };

    // update game state
    Game.updateState = function(data) {

    };
}());


/**
 * handle keyboard events
 * @param ev: javascript event
 */
function keyBoardEventHandler(ev) {
    if(ev.keyCode === 32) {
        Game.weapons.nextWeapon();
    }
}


/**
 * Handle click on tiles
 */
function tileClickHandler(tileElem) {
    var tileId = tileElem.target.id;

}
