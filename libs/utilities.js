/**
 * Created by kaushal on 17/07/17.
 */


/**
 * export utility functions
 */
module.exports = {
    generateUniqueID: generateUniqueID
};


/**
 * Generate random string
 * @returns {string}
 */
function generateUniqueID() {
    return Math.random().toString(36).substring(3,16) + new Date;
}
