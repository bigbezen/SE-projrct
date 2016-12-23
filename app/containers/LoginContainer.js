/**
 * Created by lihiverchik on 13/12/2016.
 */
var React = require('react');
var Login = require('../components/Login');
var userServices = require('../communication/userServices');

var LoginContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            username: '',
            password: ''
        }
    },
    handleSubmitUser: function (e) {
        e.preventDefault();

        var username = this.state.username;
        var password = this.state.password;
        this.setState({
            username: '',
            password: ''
        });
        console.log(this.context);
        var context = this.context;
        userServices.login(username, password).then(function (n) {
            if(n){
                context.router.push({
                    pathname: '/LoggedIn/Home'
                })
            }
            else{
                console.log("error");
            }
        })
    },
    handleUpdateUsername: function (event) {
        console.log("handleUpdateUsername");
        this.setState({
            username: event.target.value
        });
    },
    handleUpdatePassword: function (event) {
        console.log("handleUpdatePassword");
        this.setState({
            password: event.target.value
        });
    },
    render: function () {
        return (
            <Login onSubmitUser={this.handleSubmitUser}
                   onUpdateUsername={this.handleUpdateUsername}
                   onUpdatePassword={this.handleUpdatePassword}
                   username={this.state.username}
                   password={this.state.password}/>
        )
    }
});

module.exports = LoginContainer;