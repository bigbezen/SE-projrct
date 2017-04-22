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
    render: function () {
        return(
            <div>
                coming soon...
            </div>
        )
    }
});

module.exports = SalesmanProfileContainer;