/**
 * Created by lihiverchik on 22/04/2017.
 */
var React                   = require('react');
var constantsStrings        = require('../utils/ConstantStrings');
var paths                   = require('../utils/Paths');
var styles                  = require('../styles/salesmanStyles/profileStyles');
var userServices            = require('../communication/userServices');
var NotificationSystem      = require('react-notification-system');

var SalesmanProfileContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
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

    getInitialState() {
      return({
          profile: null
      })
    },

    componentDidMount() {
        this.updateProfile();
    },

    handleChangePassword: function () {
        this.context.router.push({
            pathname: paths.salesman_changePass_path
        })
    },

    updateProfile() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        userServices.getProfile().then(function (result) {
            self.setState({
                profile: result
            });
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

    renderProfile: function () {
        return(
        <div className="row w3-card-4 w3-round-large w3-container" style={styles.profileStyle}>
                <p className="w3-xxlarge"><b>{constantsStrings.firstName_string}</b>: {this.state.profile.personal.firstName}</p>
                <p className="w3-xxlarge"><b>{constantsStrings.lastName_string}</b>: {this.state.profile.personal.lastName}</p>
                <p className="w3-xxlarge"><b>{constantsStrings.username_string}</b>: {this.state.profile.username}</p>
                <p className="w3-xxlarge"><b>{constantsStrings.email_string}</b>: {this.state.profile.contact.email}</p>
                <p className="w3-xxlarge"><b>{constantsStrings.phone_string}</b>: {this.state.profile.contact.phone}</p>
            <div className="text-center">
                <button className="w3-theme-d3 w3-xxlarge w3-round-xlarge w3-card-4" style={styles.buttonStyle} onClick={this.handleChangePassword}> {constantsStrings.changePassButton_string}</button>
            </div>
            <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
        </div>
        )
    },

    renderLoading:function () {
        return(
            <div>
                <h1>loading...</h1>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    render: function () {
        if(this.state.profile != null) {
            return this.renderProfile();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = SalesmanProfileContainer;