/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var Table = require('../components/EntitiesTable');
var UserDetails = require('../containers/UserDetails');


var UserDetails = React.createClass({
    handleUsersSelection: function () {
        return console.log("users")
            .then(function (n) {
                console.log(n);
            })
    },
    render: function () {
        return (
            <div> userssss!!!!!!</div>
        )
    }
});

module.exports = UserDetails;