/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var managementServices = require('../communication/managementServices');
var constantsStrings = require('../utils/ConstantStrings');
var shiftInfo = require('../models/shift');
var flatten = require('flat');
var ReactBootstrap = require("react-bootstrap");
var moment = require('moment');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var constantStrings = require('../utils/ConstantStrings');
var NotificationSystem = require('react-notification-system');
var userServices = require('../communication/userServices');

var ShiftDetails = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        this.setSessionId();
        this.setUserType();
        return {
        }
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
    handleSubmitShift: function (e) {
        e.preventDefault();
        var startTime = this.refs.startTimeBox.value;
        var endTime = this.refs.endTimeBox.value;
        var notificationSystem = this.refs.notificationSystem;

        this.context.router.push({
            pathname: paths.manager_createMultipleShifts_path,
            query: {'startTime': startTime, 'endTime': endTime}
        })

    },

    onChangeStarTime: function(){
        this.refs.endTimeBox.value = this.refs.startTimeBox.value;
    },

    createAllShifts: function() {
        return (
            <div className="jumbotron col-xs-offset-3 col-xs-6 w3-theme-l4 text-center">
                <h1>יצירת קבוצת משמרות</h1>
                <form onSubmit={this.handleSubmitShift} className="form-horizontal text-right">

                    <div className="form-group ">
                        <label className="col-xs-2 col-xs-offset-2">{constantsStrings.startDate_string}</label>
                        <input type="datetime-local"
                               className="col-xs-4"
                               ref="startTimeBox"
                               onChange={this.onChangeStarTime}
                        />
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-2 col-xs-offset-2">{constantsStrings.endDate_string}</label>
                        <input type="datetime-local"
                               className="col-xs-4"
                               ref="endTimeBox"
                        />
                    </div>

                    <div className="form-group">
                        <button
                            className="w3-btn w3-theme-d5 col-xs-4 col-xs-offset-4"
                            type="submit">
                            {constantsStrings.add_string}
                        </button>
                    </div>
                </form>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    render: function () {
        return this.createAllShifts();
    }
});

module.exports = ShiftDetails;
