/**
 * Created by USER on 17/12/2016.
 */

var React = require('react');
var Base = require('../components/Base');
var userServices = require('../communication/userServices');


var BaseContainer = React.createClass({
    handleLogoutUser: function () {
        console.log('BaseContainer- Logout function');
        userServices.logout().then(function (n) {
            if(n){
                window.location = '/#/Login';
            }
            else{
                console.log("error");
            }
        })
    },
    render: function () {
        return (
            <Base onLogoutUser={this.handleLogoutUser} children={this.props.children}/>
        )
    }
});

module.exports = BaseContainer;