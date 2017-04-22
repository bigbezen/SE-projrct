/**
 * Created by lihiverchik on 08/04/2017.
 */


var React = require('react');
var salesmanServices = require('../communication/salesmanServices');
var constantStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/salesmanStyles/shiftExpensesStyles');
var userServices = require('../communication/userServices');
var managementServices = require('../communication/managementServices'); //delete when getAllShifts is fixed
var EditIcon = require('react-icons/lib/md/edit');
var NotificationSystem = require('react-notification-system');
var BackButtonIcon = require('react-icons/lib/md/arrow-forward');


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
        salesmanServices.getAllShifts().then(function (n) {
            if (n) {
                var shifts = n;
                self.setState({shifts: shifts});
                console.log(shifts);
            } else {

            }
        }).catch(function (errMess) {
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 5,
                position: 'tc'
            });
        })
    },
    onClickEditButton: function(shift, index){
        var numOfKM = this.refs["numOfKM" + index].value;
        var parkingCost = this.refs["parkingCost" + index].value;
        var shiftId = shift._id;
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.reportExpenses(shiftId,numOfKM,parkingCost)
            .then(function(result) {
                if(result) {
                    console.log('updated sales report');
                } else {

                }
            })
            .catch(function(err) {
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 1,
                    position: 'tc',
                });
            })
    },
    onBackButtonClick: function () {
        this.context.router.push({
            pathname: paths.salesman_home_path
        })
    },
    renderEachShift: function(shift, i){ //TODO: shift.type should be changed to shift.store.name once we have it
        var shiftDate = new Date(shift.startTime) ;
        var ShiftDateFormated = shiftDate.toLocaleDateString('en-GB');
        return (
            <div className="row col-sm-12 w3-theme-l4 w3-round-large w3-card-4 w3-text-black"
                 style={styles.rowStyle}>
                <p className="col-sm-3"><b>{shift.store.name}</b></p>
                <p className="col-sm-3">{ShiftDateFormated}</p>
                <input className="col-sm-2" type="number" min="0" style={{marginTop: '3px'}} ref={"numOfKM" + i} defaultValue={shift.numOfKM} />
                <p className="col-sm-1"></p>
                <input className="col-sm-2" type="number" min="0" style={{marginTop: '3px'}} ref={"parkingCost" + i} defaultValue={shift.parkingCost} />
                <p className="col-sm-1"></p>
                <p className="w3-xlarge" onClick={() => this.onClickEditButton(shift, i)}><EditIcon style={{marginRight: '20px'}}/></p>
            </div>
        )
    },
    renderList: function(){
        return (
            <div className="w3-container col-sm-12" style={styles.bodyStyle}>
                <button className="w3-xxlarge" onClick={this.onBackButtonClick}><BackButtonIcon/> </button>
                <div className="row col-sm-12 w3-theme-l4 w3-round-large w3-card-4 w3-text-black" style={styles.rowStyle}>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.store_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.date_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.km_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.parking_string}</b></p>
                </div>
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


