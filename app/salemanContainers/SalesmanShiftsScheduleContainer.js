/**
 * Created by lihiverchik on 22/04/2017.
 */
var React               = require('react');
var constantsStrings    = require('../utils/ConstantStrings');
var styles              = require('../styles/salesmanStyles/salesmanShiftSchedule');
var userServices        = require('../communication/userServices');
var NotificationSystem  = require('react-notification-system');
var managementService   = require('../communication/managementServices');
var moment              = require('moment');

var SalesmanShiftsScheduleContainer = React.createClass({

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
        return {
            shifts: null
        }
    },

    componentDidMount() {
      this.updateShifts();
    },

    sortShifts: function(a, b){
        var dateA = new Date(a.startTime);
        var dateB = new Date(b.startTime);
        if(dateA < dateB)
            return -1;
        else if(dateA > dateB)
            return 1;
        else{
            return 0;
        }
    },

    updateShifts: function() {
        var currentDate = moment().format('YYYY-MM-DD');
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementService.getShiftsFromDate(currentDate).then(function (result) {
            var sortedShifts = result.sort(self.sortShifts)
                .filter((shift) => shift.status != 'FINISHED');
            self.setState({
                shifts: sortedShifts
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

    renderLoading:function () {
        return(
            <div>
                <h1>loading...</h1>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    renderEachShift: function(shift, i) {
        var shiftDate = moment(shift.startTime).format('DD/MM/YYYY');
        var startTime = moment(shift.startTime).format('H:mm');
        var endTime = moment(shift.endTime).format('H:mm');
        return(
            <div key={i} className="row w3-card-4 w3-round-large" style={styles.shiftStyle}>
                <header className="w3-container w3-theme-d3 w3-round-large">
                    <p className="w3-xxxlarge" style={styles.textStyleRight}>{shiftDate}</p>
                    <p className="w3-xxxlarge" style={styles.textStyleLeft}> {startTime}-{endTime}</p>
                </header>

                <div className="w3-container text-center">
                    <p className="w3-xxxlarge" >{constantsStrings.storeName_string}: {shift.storeId.name}</p>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    renderTable: function() {
        return (
            <div className='main-container' style={styles.bodyStyle}>
                <div className="w3-container">
                    {this.state.shifts.map(this.renderEachShift)}
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    render: function () {
        if(this.state.shifts != null)
        {
            return this.renderTable();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = SalesmanShiftsScheduleContainer;