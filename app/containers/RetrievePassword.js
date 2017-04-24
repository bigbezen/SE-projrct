/**
 * Created by lihiverchik on 13/12/2016.
 */
var React = require('react');
var userServices = require('../communication/userServices');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var NotificationSystem = require('react-notification-system');

var RetrievePassContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired,
    },
    getInitialState: function () {
        this.setSessionId();
        this.setUserType();
        return {
            username: '',
            email: '',

        }
    },
    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },
    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },
    handleSubmitUser: function (e) {
        e.preventDefault();
        var email = this.refs.emailTextBox.value;
        var username = this.refs.usernameTextBox.value;
        var notificationSystem = this.refs.notificationSystem;
        this.setState({
            username: '',
            password: ''
        });
        var context = this.context;
        var self = this;
        userServices.retrievePassword(username, email).then(function (n) {
            notificationSystem.addNotification({
                message: constantsStrings.retrievePassSuccessMessage_string,
                level: 'success',
                autoDismiss: 2,
                position: 'tc',
                onRemove: function (notification) {
                    context.router.push({
                        pathname: paths.login_path
                    })
                }
            });
        }).catch(function (errMess) {
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 5,
                position: 'tc'
            });
        })
    },
    onReturn: function() {
        context.router.push({
            pathname: paths.login_path
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
                    <h1 className="h1 w3-jumbo">{constantsStrings.retrievePassTitle_string}</h1>
                    <form onSubmit={this.handleSubmitUser} className="form-horizontal">
                        <div className="form-group ">
                            <input type="text"
                                   className="col-sm-12 col-lg-6 col-lg-offset-3 w3-xxlarge"
                                   ref="usernameTextBox"
                                   placeholder="שם משתמש"
                                   value={this.username} />
                        </div>
                        <div className="form-group">
                            <input type="email"
                                   className="col-sm-12 col-lg-6 col-lg-offset-3 w3-xxlarge"
                                   ref="emailTextBox"
                                   placeholder="אימייל"
                                   value={this.email}/>
                        </div>
                        <div className="form-group">
                            <button
                                className="w3-btn btn w3-theme-d5 col-sm-4 col-sm-offset-4"
                                type="submit">
                                {constantsStrings.retrievePassButton_string}
                            </button>
                        </div>
                    </form>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = RetrievePassContainer;