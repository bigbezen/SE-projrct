/**
 * Created by lihiverchik on 08/04/2017.
 */


var React               = require('react');
var salesmanServices    = require('../communication/salesmanServices');
var constantStrings     = require('../utils/ConstantStrings');
var paths               = require('../utils/Paths');
var styles              = require('../styles/salesmanStyles/shiftExpensesStyles');
var userServices        = require('../communication/userServices');
var EditIcon            = require('react-icons/lib/md/edit');
var NotificationSystem  = require('react-notification-system');
var moment              = require('moment');

var ShiftsExpensesContainer = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState(){
        this.setSessionId();
        this.setUserType();
        return{
            shifts: null,
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

    componentDidMount() {
        this.updateShifts();
    },

    updateShifts(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.getAllShifts().then(function (shifts) {
            var filteredShifts = shifts.filter(function (shift) {
                var currentMonth = moment().format('MMMM')
                var shiftsMonth = moment(shift.startTime).format('MMMM')
                return shiftsMonth === currentMonth ;
            });
            filteredShifts.sort(function(a,b){
                return new Date(b.startTime) - new Date(a.startTime);
            });
            self.setState({shifts: filteredShifts});
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

    onClickEditButton: function(shift, index){
        var numOfKM = this.refs["numOfKM" + index].value;
        var parkingCost = this.refs["parkingCost" + index].value;
        var otherExpenses = this.refs["otherExpense" + index].value;
        var shiftId = shift._id;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.reportExpenses(shiftId,numOfKM,parkingCost,otherExpenses)
            .then(function(result) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantStrings.reportExpenseSuccess,
                    level: 'success',
                    autoDismiss: 2,
                    position: 'tc',
                });
            })
            .catch(function(err) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc',
                });
            })
    },

    onBackButtonClick: function () {
        this.context.router.push({
            pathname: paths.salesman_home_path
        })
    },

    renderEachShift: function(shift, i){
        var shiftDate = new Date(shift.startTime) ;
        var ShiftDateFormated = shiftDate.toLocaleDateString('en-GB');
        return (

        <div key={i} className="row w3-card-4 w3-round-large" style={styles.expStyle}>
            <header className="w3-container w3-theme-d3 w3-round-large">
                <p className="w3-xxxlarge" style={styles.storeStyle}>{shift.store.name}</p>
                <p className="w3-xxxlarge" style={styles.dateStyle}> {ShiftDateFormated}</p>
            </header>
            <div className="w3-container">
                <p><b>{constantStrings.km_string}</b>:&nbsp;
                    <input type="number" min="0" style={styles.inputStyle}  ref={"numOfKM" + i} defaultValue={shift.numOfKM} />
                </p>
                <p><b>{constantStrings.parking_string}</b>:&nbsp;
                    <input type="number" min="0" style={styles.inputStyle}  ref={"parkingCost" + i} defaultValue={shift.parkingCost} />
                </p>
                <p><b>{constantStrings.other_expenses}</b>:&nbsp;
                    <input type="number" min="0" style={styles.inputStyle} ref={"otherExpense" + i} defaultValue={shift.extraExpenses} />
                </p>
            </div>
            <div className="text-center">
                <button className="w3-card-4 w3-round-large w3-theme-d5" style={styles.buttonStyle} onClick={() => this.onClickEditButton(shift, i)}>
                    {constantStrings.save_string}
                </button>
            </div>

        </div>
        )
    },

    renderList: function(){
        return (
            <div className="w3-container col-sm-12" style={styles.bodyStyle}>
                {this.state.shifts.map(this.renderEachShift)}
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
        if(this.state.shifts != null)
        {
            return this.renderList();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = ShiftsExpensesContainer;


