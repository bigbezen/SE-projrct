/**
 * Created by lihiverchik on 14/12/2016.
 */
var axios = require('axios');

function login (username, password) {
    return axios.get('https://api.github.com/users/?username=' + username +'password='+ password);
}

var helpers = {
    login: function(username, password){
        //add encode for password before sending to function
        return login(username, password);
    }
    /*getPlayersInfo: function (players) {
     return axios.all(players.map(function (username) {
     return getUserInfo(username)
     }))
     .then(function (info) {
     return info.map(function (user) {
     return user.data
     })
     })
     .catch(function (err) {console.warn('Error in getPlayersInfo: ', err)})
     }*/
};

module.exports = helpers;