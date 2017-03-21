/**
 * Created by lihiverchik on 13/12/2016.
 */
var React = require('react');
var userServices = require('../communication/userServices');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var NotificationSystem = require('react-notification-system');

var LoginContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired,
    },
    getInitialState: function () {
        return {
            username: '',
            password: '',

        }
    },
    handleSubmitUser: function (e) {
        e.preventDefault();
        var password = this.refs.passwordTextBox.value;
        var username = this.refs.usernameTextBox.value;
        var notificationSystem = this.refs.notificationSystem;
        this.setState({
            username: '',
            password: ''
        });
        var context = this.context;
        userServices.login(username, password).then(function (n) {
            if(n){
                var answer = n;
                if (answer.success) {
                    var userType = answer.info;
                    if(userType == 'manager')
                    {
                        context.router.push({
                            pathname: paths.manager_home_path
                        })
                    } else{ //TODO: add all types of users
                        context.router.push({
                            pathname: paths.salesman_home_path
                        })
                    }
                }else {
                    notificationSystem.addNotification({
                        message: constantsStrings.loginFailMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            }
            else{
                console.log("error in login: " + n);
            }
        })
    },
    render: function () {
        return (
            <div className="container">
                <div className="container">
                    <div className="row" style={styles.topBuffer}>
                    </div>
                </div>
                <div className="w3-theme-l5 col-sm-offset-2 col-sm-8 text-center img-rounded" >
                    <h1 className="h1 w3-jumbo">IBBLS</h1>
                    <form onSubmit={this.handleSubmitUser} className="form-horizontal">
                        <div className="form-group ">
                            <input type="text"
                                   className="col-sm-12 col-lg-6 col-lg-offset-3 w3-xxlarge"
                                   ref="usernameTextBox"
                                   placeholder="שם משתמש"
                                   value={this.username} />
                        </div>
                        <div className="form-group">
                            <input type="password"
                                   className="col-sm-12 col-lg-6 col-lg-offset-3 w3-xxlarge"
                                   ref="passwordTextBox"
                                   placeholder="סיסמא"
                                   value={this.password}/>
                        </div>
                        <div className="form-group">
                            <button
                                className="w3-btn btn w3-theme-d5 col-sm-4 col-sm-offset-4"
                                type="submit">
                                {constantsStrings.login_string}
                            </button>
                        </div>
                    </form>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = LoginContainer;