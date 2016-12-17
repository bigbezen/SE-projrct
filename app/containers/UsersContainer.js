/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var Table = require('../components/Table');
var UserDetails = require('../containers/UserDetails');


var StoresContainer = React.createClass({
    handleUsersSelection: function () {
        return console.log("users")
            .then(function (n) {
                console.log(n);
            })
    },
    render: function () {
        return (
            <Table onSelectStore={this.handleUsersSelection}/>
        )
    }
});

module.exports = StoresContainer;