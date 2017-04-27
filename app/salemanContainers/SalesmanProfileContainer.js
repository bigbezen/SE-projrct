/**
 * Created by lihiverchik on 22/04/2017.
 */
var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var salesmanService = require('../communication/salesmanServices');
var styles = require('../styles/salesmanStyles/homeStyles');
var userServices = require('../communication/userServices');
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
    handleChangePassword: function () {
        console.log('BaseContainer- changePass function');
        this.context.router.push({
            pathname: paths.salesman_changePass_path
        })
    },
    render: function () {
        return(
            <div>

                <button className="w3-theme-d5 w3-xxlarge btn w3-card-8" onClick={this.handleChangePassword}> {constantsStrings.changePassButton_string}</button>
            </div>
        )
    }
});

module.exports = SalesmanProfileContainer;