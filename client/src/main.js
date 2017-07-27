
(function () {

    // user object
    window.User = {
        username: null
    };

    User.setUserName = function(username) {
        this.username = username;

        // join game
        Client.joinGame(username);
    };

    // username field, focus field on load
    var usernameField = document.getElementById('username');
    usernameField.focus();

    /**
     * Keyboard event listener: on keyboard button press
     */
    usernameField.addEventListener('keydown', function (ev) {
        if(ev.keyCode === 13){
            var username = usernameField.value;

            if(username.length >= 2) {
                User.setUserName(username);
                closeLogin();
            } else {
                alert('Please enter valid username 4 characters or above.');
            }
        }
    }, false);
}());


/**
 * Close login overlay
 */
function closeLogin(usernameField){
    $('.login').animate({opacity: 0}, 500);

    setTimeout(function(){
        $('.login').css('display','none');
    }, 500);
}


/**
 * get client id.
 * first check from browser's local storage, or generate new.
 * Later: client id is supposed to get generated from database.
 * @returns {string}
 */
function getPlayerID() {
    var UNIQUE_ID_KEY = 'clientUniqueId';

    var clientUniqueId = localStorage.getItem(UNIQUE_ID_KEY);
    if(clientUniqueId === null) {
        clientUniqueId = generateUniqueID();
        localStorage.setItem(UNIQUE_ID_KEY, clientUniqueId);
    }
    return clientUniqueId
}


/**
 * Generate random string
 * @returns {string}
 */
function generateUniqueID() {
    return Math.random().toString(36).substring(3,16) + new Date().getTime();
}
