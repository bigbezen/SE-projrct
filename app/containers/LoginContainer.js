/**
 * Created by lihiverchik on 13/12/2016.
 */
var React = require('react');
var Login = require('../components/Login');
var userServices = require('../communication/userServices');


var LoginContainer = React.createClass({
    handleSubmitUser: function (username, password) {
        return userServices.login(username, password)
            .then(function (n) {
                console.log(n);
            })
    },
    render: function () {
        return (
            <Login onSubmitUser={this.handleSubmitUser}/>
        )
    }
});

module.exports = LoginContainer;