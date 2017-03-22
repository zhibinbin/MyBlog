module.exports = function(input){
    var crypto = require('crypto');
    var md5 = crypto.createHash('md5');
    md5.update(input);
    var result = md5.digest('hex');
    return result;
}
