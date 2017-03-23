/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var NotificationSystem = require('react-notification-system');

var styles = require('../styles/managerStyles/styles');
var encs = require('../utils/encouragmentsMock');
var paths = require('../utils/Paths');
var managementServices = require('../communication/managementServices');



var IncentiveDetails = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },


    render: function () {
        return (
            <h1>hello</h1>
        )
    }
});

module.exports = IncentiveDetails;