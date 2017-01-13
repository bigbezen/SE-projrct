/**
 * Created by lihiverchik on 13/12/2016.
 */
var React = require('react');
var userServices = require('../communication/userServices');
var constantsStrings = require('../utils/ConstantStrings');

var userType = 'salesman';

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
        var password = this.refs.passwordTextBox.value;
        var username = this.refs.usernameTextBox.value;
        this.setState({
            username: '',
            password: ''
        });
        var context = this.context;
        userServices.login(username, password).then(function (n) {
            if(n){
                console.log(userType);
                if(userType == 'salesman')
                {
                    console.log("go to saleman home!!!");
                    context.router.push({
                        pathname: '/salesman/Home'
                    })
                } else{
                    console.log("go to home :(");
                    context.router.push({
                        pathname: '/LoggedIn/Home'
                    })
                }
            }
            else{
                console.log("error");
            }
        })
    },
    render: function () {
        return (
            <div className="jumbotron col-sm-offset-3 col-sm-6 text-center" >
                <h1>{constantsStrings.welcome_string}</h1>
                <form onSubmit={this.handleSubmitUser} className="form-horizontal">
                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.username_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="usernameTextBox"
                               value={this.username} />
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.password_string}</label>
                        <input type="password"
                               className="col-sm-4"
                               ref="passwordTextBox"
                               value={this.password}/>
                    </div>
                    <div className="form-group">
                        <button
                            className="w3-btn w3-theme-d5 col-sm-4 col-sm-offset-5"
                            type="submit">
                            {constantsStrings.login_string}
                        </button>
                    </div>
                </form>
            </div>
        )
    }
});

module.exports = LoginContainer;