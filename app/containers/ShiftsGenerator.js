/**
 * Created by lihiverchik on 17/12/2016.
 */

var React               = require('react');
var constantsStrings    = require('../utils/ConstantStrings');
var moment              = require('moment');
var paths               = require('../utils/Paths');
var styles              = require('../styles/managerStyles/styles');
var NotificationSystem  = require('react-notification-system');
var userServices        = require('../communication/userServices');

var managementServices  = require('../communication/managementServices');

import 'react-date-picker/index.css';
import { DateField, DatePicker } from 'react-date-picker';

var ShiftDetails = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        this.setSessionId();
        this.setUserType();
        this.setShiftsEndDate();
        this.setShiftsStartDate();
        return {
            chosenDate: new Date(),
            showLoader: false
        }
    },
    setShiftsEndDate: function() {
        var shiftEndDate = localStorage.getItem('shiftEndDate');
        if (!shiftEndDate) {
            shiftEndDate = moment().format('YYYY-MM-DD');
        }
        localStorage.setItem('shiftEndDate', shiftEndDate);
    },
    setShiftsStartDate: function() {
        var shiftStartDate = localStorage.getItem('shiftStartDate');
        if (!shiftStartDate) {
            shiftStartDate = moment().format('YYYY-MM-DD');
        }
        localStorage.setItem('shiftStartDate', shiftStartDate);
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
        console.log(e);
        if(this.refs.startTimeBox.value == "" || this.refs.endTimeBox.value == "")
            return;
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        let date = this.refs.dateBox.state.value;
        var startTime = moment(date).format('YYYY-MM-DD') + ' ' + this.refs.startTimeBox.value;
        startTime = moment(startTime).format('YYYY-MM-DD HH:mm Z');
        var endTime = moment(date).format('YYYY-MM-DD') + ' ' +  this.refs.endTimeBox.value;
        endTime = moment(endTime).format('YYYY-MM-DD HH:mm Z');

        self.setState({
            showLoader: true
        });
        managementServices.generateShiftsForDate(startTime, endTime)
            .then(function(result){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantsStrings.addSuccessMessage_string,
                    level: 'success',
                    autoDismiss: 2,
                    position: 'tc'
                });
                self.context.router.push({
                    pathname: paths.manager_shifts_creation_path,
                    showLoader: false
                });
            })
            .catch(function(errMsg){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: errMsg,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc'
                });
                self.setState({
                    showLoader: false
                });
        });

    },

    onChangeStartTime: function(){
        this.refs.endTimeBox.value = this.refs.startTimeBox.value;
    },

    onChangeDate: function(a, b) {
        console.log(a);
        console.log(b);
        this.state.chosenDate = new Date(a);
    },

    loader: function() {
        if(this.state.showLoader) {
            return (
                <div className="text-center">
                    <h1>...Loading</h1>
                </div>
            );
        }
        else {
            return (
                <span></span>
            )
        }
    },

    createAllShifts: function() {
        return (
            <div className="jumbotron col-xs-offset-3 col-xs-6 text-center" style={styles.editBodyStyle}>
                <h1>יצירת קבוצת משמרות</h1>
                {this.loader()}
                <form onSubmit={this.handleSubmitShift} className="form-horizontal text-right">
                    <div className="form-group">
                        <label className="col-xs-2 col-xs-offset-2">{constantsStrings.startDate_string}</label>
                        <DateField
                            dateFormat="DD-MM-YYYY"
                            forceValidDate={true}
                            defaultValue={(new Date()).getTime()}
                            ref="dateBox"
                            updateOnDateClick={true}
                            collapseOnDateClick={true}
                            onChange={(dateString, { dateMoment, timestamp}) => {this.onChangeDate(dateString, dateMoment, timestamp)}}
                        >
                        </DateField>
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-2 col-xs-offset-2">{constantsStrings.startTime_string}</label>
                        <input type="time"
                               className="col-xs-5"
                               ref="startTimeBox"
                               onChange={this.onChangeStartTime}
                        />
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-2 col-xs-offset-2">{constantsStrings.endTime_string}</label>
                        <input type="time"
                               className="col-xs-5"
                               ref="endTimeBox"
                        />
                    </div>

                    <div className="form-group">
                        <button
                            className="w3-button col-xs-5 col-xs-offset-4 w3-round w3-ripple"
                            style={styles.editStyle}
                            type="submit">
                            {constantsStrings.save_string}
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
