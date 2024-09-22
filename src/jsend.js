/**
 *  @param {object |null } data
 *  @returns {{status: 'success', data: object | null}} 
 */
function success(data) {
    return {
        status: 'success',
        data: data
    };
}

/**
* @param {string} message
* @param {object | null} [data]
* @returns {{status: 'fail', message: string, data: object | undefined}}
*/
function fail(message, data = null) {
    return {
        status: 'fail',
        message: message,
        data: data
    };
}

/**
* @param {string} message
* @param {object | null} [data]
* @returns {{status: 'error', message: string, data: object | undefined}}
*/
function error(message, data = null) {
    if (data) {
        return {
            status: 'error',
            message: message,
            data: data
        };
    }
    return {
        status: 'error',
        message: message
    };
}

module.exports = {
    success,
    fail,
    error
};
