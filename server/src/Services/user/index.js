
var login = function(user){
    console.log('login');
    return 'hello ' + user.username;
};

module.exports.login = login;