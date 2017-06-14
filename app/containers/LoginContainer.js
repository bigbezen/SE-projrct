/**
 * Created by lihiverchik on 13/12/2016.
 */
var React               = require('react');
var userServices        = require('../communication/userServices');
var constantsStrings    = require('../utils/ConstantStrings');
var paths               = require('../utils/Paths');
var styles              = require('../styles/managerStyles/loginStyles');
var NotificationSystem  = require('react-notification-system');
var moment              = require('moment');

var LoginContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired,
    },

    getInitialState: function () {
        // this.setSessionId();
        // this.setUserType();
        // if (userServices.managerIsLoggedin()) {
        //     this.context.router.push({
        //         pathname: paths.manager_home_path
        //     });
        //     return null;
        // } else if (userServices.salesmanIsLoggedin()) {
        //     this.context.router.push({
        //         pathname: paths.salesman_home_path
        //     });
        //     return null;
        // }
        return {
            username: '',
            password: '',
        }
    },
    setShiftsStartDate: function() {
        var shiftStartDate = localStorage.getItem('shiftStartDate');
        if (!shiftStartDate) {
            shiftStartDate = moment().format('YYYY-MM-DD');
        }
        localStorage.setItem('shiftStartDate', shiftStartDate);
    },
    setShiftsEndDate: function() {
        var shiftEndDate = localStorage.getItem('shiftEndDate');
        if (!shiftEndDate) {
            shiftEndDate = moment().format('YYYY-MM-DD');
        }
        localStorage.setItem('shiftEndDate', shiftEndDate);
    },
    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },

    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
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
        userServices.login(username, password).then(function (answer) {
            var userType = answer.userType;
            var sessionId = answer.sessionId;
            localStorage.setItem('sessionId', sessionId);
            localStorage.setItem('userType', userType);
            if(userType == 'manager')
            {
                context.router.push({
                    pathname: paths.manager_home_path
                })
            }
            else{ //TODO: add all types of users
                 context.router.push({
                     pathname: paths.salesman_home_path
                 })
            }
        }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        })
    },

    handleRetrievePass : function(e) {
        this.context.router.push({
            pathname: paths.member_retrievePass_path
        })
    },

    render: function () {
        return (
            <div className="container" style={styles.mainContainerStyle}>
                <div className="container">
                    <div className="row text-center" style={styles.marginTop}>
                        <img src="http://www.panelsfeedback.co.il/media/logos/ibbls.png"/>
                    </div>

                </div>
                <div className="col-xs-offset-2 col-xs-8 text-center w3-round" style={styles.credentialsContainerStyle} >
                    <form onSubmit={this.handleSubmitUser} className="form-horizontal">
                        <div className="form-group ">
                            <input type="text"
                                   className="col-xs-12 col-lg-6 col-lg-offset-3 w3-round w3-xxlarge"
                                   ref="usernameTextBox"
                                   placeholder="שם משתמש"
                                   value={this.username} />
                        </div>
                        <div className="form-group">
                            <input type="password"
                                   className="col-xs-12 col-lg-6 col-lg-offset-3 w3-round w3-xxlarge"
                                   ref="passwordTextBox"
                                   placeholder="סיסמא"
                                   value={this.password}/>
                        </div>
                        <div className="form-group">
                            <button
                                className="w3-btn w3-ripple btn col-lg-6 col-lg-offset-3 col-xs-12 w3-xxlarge w3-round w3-card-4"
                                style={styles.buttonStyle}
                                type="submit">
                                {constantsStrings.login_string}
                            </button>
                        </div>
                        <div className="form-group" style={styles.marginTop}>
                            <p
                                className="w3-xlarge w3-hover-text-blue col-sm-8 col-lg-6 col-lg-offset-3
                                                col-sm-offset-2"
                                onClick={this.handleRetrievePass}>
                                <u>
                                    {constantsStrings.retrievePass_string}
                                </u>
                            </p>
                        </div>
                    </form>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = LoginContainer;