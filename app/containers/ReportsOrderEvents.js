/**
 * Created by lihiverchik on 17/12/2016.
 */
var React               = require('react');
var constantStrings     = require('../utils/ConstantStrings');
var styles              = require('../styles/managerStyles/styles');
var managerServices     = require('../communication/managerServices');
var moment              = require('moment');
var NotificationSystem  = require('react-notification-system');
var userServices        = require('../communication/userServices');

var ReportOrderEvents = React.createClass({

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
    getInitialState() {
        this.setSessionId();
        this.setUserType();
        this.setShiftsStartDate();
        this.setShiftsEndDate();
        return{
            report: undefined
        }
    },

    onClickExportReport: function() {
        var notificationSystem = this.refs.notificationSystem;
        var datepickerVal = this.refs.datepicker.value.split('-');
        managerServices.exportOrderEventsReport(parseInt(datepickerVal[0]), parseInt(datepickerVal[1]) - 1)
            .then(function(data){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantStrings.mailSentSuccess_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc',
                });
            })
            .catch(function(err){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc',
                });
            });
    },

    render: function () {
        var year = (new Date).getFullYear();
        return (
            <div className="w3-container">
                <div className="col=sm-12">
                    <div className="row text-center">
                        <h2>{constantStrings.reportsOrderEventsReportTitle_string}</h2>
                    </div>
                    <div className="row">
                        <input className="col-sm-2 w3-card-4 w3-round" ref="datepicker" type="month"/>
                        <button className="col-sm-1 w3-button w3-round w3-card-4 w3-ripple" style={styles.reportsButtonStyle} onClick={this.onClickExportReport}>{constantStrings.getReport_string}</button>
                    </div>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = ReportOrderEvents;
