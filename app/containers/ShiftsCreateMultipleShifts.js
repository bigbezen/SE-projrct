/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var managementServices = require('../communication/managementServices');
var constantsStrings = require('../utils/ConstantStrings');
var shiftInfo = require('../models/shift');
var moment = require('moment');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var constantStrings = require('../utils/ConstantStrings');
var NotificationSystem = require('react-notification-system');
var userServices = require('../communication/userServices');

var ShiftsCreateMultipleShifts = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        this.setSessionId();
        this.setUserType();
        return {
            stores: [],
            newShifts: [],
            salesmen: [],
            startTime: undefined,
            endTime: undefined
        }
    },

    componentDidMount: function(){
        var notificationSystem = this.refs.notificationSystem;
        var self = this;
        var startTime = moment(this.props.location.query.startTime).format('YYYY-MM-DD hh:mm') + '+03:00';
        var endTime = moment(this.props.location.query.endTime).format('YYYY-MM-DD hh:mm') + '+03:00';
        managementServices.getAllStores()
            .then(function(stores) {
                var newShifts = [];
                managementServices.getAllUsers()
                    .then(function(users){
                        var usersDict = {};
                        users = users.filter((user) => user.jobDetails.userType == 'salesman');
                        for(var user of users)
                            usersDict[user._id] = user;
                        for(var store of stores){
                            var shift = new shiftInfo();
                            shift.storeId = store._id;
                            shift["store"] = store;
                            if(store.defaultSalesman != undefined) {
                                shift.salesmanId = store.defaultSalesman._id;
                                shift["salesman"] = usersDict[store.defaultSalesman._id];
                            }
                            else{
                                shift.salesmanId = "";
                            }
                            shift.startTime = startTime;
                            shift.endTime = endTime;
                            shift.type = constantStrings.shiftType_taste;
                            newShifts.push(shift);
                        }
                        self.setState({
                            stores: stores,
                            newShifts: newShifts,
                            salesmen: users,
                            startTime: startTime,
                            endTime: endTime
                        })

                    })
                    .catch(function(err){
                        notificationSystem.addNotification({
                            message: err,
                            level: 'error',
                            autoDismiss: 2,
                            position: 'tc'
                        });
                    });
            })
            .catch(function(err){
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 2,
                    position: 'tc'
                });
            });
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

    onClickSubmitShifts: function(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.addMultipleShifts(this.state.newShifts)
            .then(function(data){
                var a = "a";
                alert(data);

            })
            .catch(function(err){
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 5,
                    position: 'tc'
                });
            })
    },

    getSalesmanOptions: function(salesmanId){
        var salesmen = this.state.salesmen;
        var optionsForDropdown = [];
        if(salesmanId == ""){
            optionsForDropdown.push(<option selected>{constantsStrings.dropDownChooseString}</option>)
        }
        else{
            optionsForDropdown.push(<option>{constantsStrings.dropDownChooseString}</option>)
        }
        for(var salesman of salesmen){
            if(salesman._id == salesmanId){
                optionsForDropdown.push(<option selected>{salesman.personal.firstName + ' ' + salesman.personal.lastName}
                                        </option>)
            }
            else{
                optionsForDropdown.push(<option>{salesman.personal.firstName + ' ' + salesman.personal.lastName}
                                        </option>)
            }
        }
        return optionsForDropdown;
    },

    renderShiftsOfArea: function(shift, index) {
        return (
            <div className="col-xs-11 w3-theme-d3 w3-card-4 w3-round-large" style={{fontSize: '20px', marginTop: '5px'}}>
                <p className="col-sm-3">{shift.store.name}</p>
                <select style={{color: 'black', marginTop: '3px'}} className="col-sm-6 w3-round-large">{this.getSalesmanOptions(shift.salesmanId)}</select>
            </div>
        )
    },

    renderArea: function(area, index){
        var shifts = area.shifts;
        return (
            <div className="col-sm-offset-1 col-sm-5">
                <h2>{area.area}</h2>
                {shifts.map(this.renderShiftsOfArea)}
            </div>
        )
    },

    render: function () {
        if(this.state.newShifts == undefined)
            return (
                <div>
                    Loading...
                    <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
                </div>
            );
        else {
            var areas = new Set(this.state.stores.map((store) => store.area));
            var categoryToShifts = [];
            for(var area of areas){
                categoryToShifts.push({
                    'area': area,
                    'shifts': this.state.newShifts.filter((shift) => shift.store.area == area)
                });
            }
            var date = moment(this.props.location.query.startTime).format('DD-MM-YY');
            var start = moment(this.props.location.query.startTime).format('H:mm');
            var end = moment(this.props.location.query.endTime).format('H:mm');
            return (
                <div className="w3-container">
                    <div className="col-sm-12 text-center">
                        <h1>{date}</h1>
                        <h2>{end}  -  {start}</h2>
                    </div>
                    <div style={{marginTop: '150px'}} className="col-sm-12">
                        {categoryToShifts.map(this.renderArea)}
                        <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
                    </div>
                    <div className="text-center col-sm-12">
                        <button className="w3-button w3-round-xlarge w3-card-4 w3-theme-d5"
                                onClick={this.onClickSubmitShifts}>
                            {constantStrings.add_string}
                        </button>
                    </div>
                </div>
            );
        }
    }
});

module.exports = ShiftsCreateMultipleShifts;
