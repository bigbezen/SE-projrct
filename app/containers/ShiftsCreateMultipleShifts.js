/**
 * Created by lihiverchik on 17/12/2016.
 */

var React               = require('react');
var managementServices  = require('../communication/managementServices');
var constantsStrings    = require('../utils/ConstantStrings');
var shiftInfo           = require('../models/shift');
var moment              = require('moment');
var paths               = require('../utils/Paths');
var styles              = require('../styles/managerStyles/styles');
var constantStrings     = require('../utils/ConstantStrings');
var NotificationSystem  = require('react-notification-system');
var userServices        = require('../communication/userServices');
var CloseIcon           = require('react-icons/lib/fa/close');
var underscore          = require('underscore');

var ShiftsCreateMultipleShifts = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        this.setSessionId();
        this.setUserType();
        return {
            newShifts: [],
            salesmen: [],
        }
    },

    componentDidMount: function(){
        var notificationSystem = this.refs.notificationSystem;
        var self = this;

        managementServices.getShiftsByStatus(constantsStrings.SHIFT_STATUS.CREATED)
            .then(function(shifts){
                managementServices.getAllUsers()
                    .then(function(users){
                        let salesmen = users.filter((user) => user.jobDetails.userType == 'salesman');
                        self.setState({
                            newShifts: shifts,
                            salesmen: salesmen
                        })
                    })
            })
            .catch(function(err){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 0,
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
        let shiftsToPublish = this.state.newShifts.filter((shift) => shift.salesmanId != undefined);
        if(shiftsToPublish.length > 0){
            managementServices.publishMultipleShifts(shiftsToPublish)
                .then(function(result){
                    let a = 2;
                    console.log(2);
                    console.log(a-2);
                    self.context.router.push({
                        pathname: paths.manager_shifts_creation_path
                    })
                })
                .catch(function(err){
                    notificationSystem.clearNotifications();
                    notificationSystem.addNotification({
                        message: err,
                        level: 'error',
                        autoDismiss: 0,
                        position: 'tc'
                    });
                });
        }
        else{
            this.context.router.push({
                pathname: paths.manager_shifts_creation_path
            })
        }
    },

    getSalesmanOptions: function(shift){
        let salesmanId = "";
        var salesmen = this.state.salesmen;

        var optionsForDropdown = [];
        if(shift.salesmanId == undefined){
            if(shift.storeId.defaultSalesman == undefined)
                optionsForDropdown.push(<option selected>{constantsStrings.dropDownChooseString}</option>)
            else{
                salesmanId = shift.storeId.defaultSalesman;
                optionsForDropdown.push(<option>{constantsStrings.dropDownChooseString}</option>)
            }
        }
        else{
            salesmanId = shift.salesmanId;
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

    onChangeSalesman: function(shift){
        var salesmanId = undefined;
        let salesmanName = this.refs[shift._id].value;
        if(salesmanName != constantsStrings.dropDownChooseString) {
            var firstName = salesmanName.split(' ')[0];
            var lastName = salesmanName.split(' ')[1];
            salesmanId = this.state.salesmen.filter((salesman) => salesman.personal.firstName == firstName &&
                                                    salesman.personal.lastName == lastName);
            salesmanId = salesmanId[0]._id;
        }
        shift.salesmanId = salesmanId;
    },


    getConstraints: function(salesmen, shifts){
        let blabla = salesmen;
        let salesmenObj = {};
        for(let salesman of salesmen){
            salesmenObj[salesman._id] = salesman;
        }
        let constraints = [];
        for(let shift of shifts){
            constraints = constraints.concat(shift.constraints);
        }
        // transform into an object to remove duplicates
        let constraintsObj = {};
        for(let constraint of constraints){
            if(constraint.isAvailable == false || (constraint.comment != undefined && constraint.comment.length > 0))
                constraintsObj[constraint.salesmanId] = constraint;
        }
        // move back into an array of objects
        constraints = [];
        for(let key in constraintsObj){
            constraints.push(constraintsObj[key]);
        }

        // Add only if we want all salesmen to show
        // let nonPresentSalesmen = underscore.difference(
        //     salesmen.map((salesman) => salesman._id),
        //     constraints.map((constraint) => constraint.salesmanId)
        // );
        // for(let salesmanId of nonPresentSalesmen){
        //     constraints.push({
        //         salesmanId: salesmanId,
        //         isAvailable: true,
        //         comment: ""
        //     });
        // }

        for(let constraint of constraints){
            constraint.salesman = salesmenObj[constraint.salesmanId];
        }
        return constraints.sort(function(cons1, cons2) {
            if(cons1.isAvailable && !cons2.isAvailable)
                return -1;
            else if(!cons1.isAvailable && cons2.isAvailable)
                return 1;
            else
                return 0;
        });
    },

    onClickRemoveShift: function(shiftId){
        var notificationSystem = this.refs.notificationSystem;
        var self = this;
        self.setState({
            newShifts: self.state.newShifts.filter((shift) => shift._id != shiftId)
        });
        notificationSystem.clearNotifications();
        notificationSystem.addNotification({
            message: constantStrings.shiftWillNotPublish_string,
            level: 'info',
            autoDismiss: 2,
            position: 'tc',
        });
    },

    renderShiftsOfArea: function(shift, index) {
        return (
            <div className="col-xs-12 w3-card-2 w3-round" style={styles.shiftRowStyle}>
                <p className="col-sm-3">{shift.storeId.name}</p>
                <select style={{color: 'black', marginTop: '3px'}}
                        className="col-sm-4 w3-round" ref={shift._id}
                        onChange={() => this.onChangeSalesman(shift)}>
                    {this.getSalesmanOptions(shift)}
                </select>
                <a className="col-sm-1 col-sm-offset-4" href="javascript:void(0)" onClick={() => this.onClickRemoveShift(shift._id)}>
                    <CloseIcon />
                </a>
            </div>
        )
    },

    renderConstraint: function(constraint){
        return (
            <div className="col-sm-12 w3-card-4 w3-round" style={constraint.isAvailable ? styles.constAvailable : styles.constUnavailable}>
                <p className="col-sm-3">{constraint.salesman.personal.firstName + " " + constraint.salesman.personal.lastName}</p>
                <p className="col-sm-3">{constraint.isAvailable ? constantsStrings.available_string : constantsStrings.notAvailable_string}</p>
                <p className="col-sm-6">{constraint.comment}</p>
            </div>
        )
    },

    renderArea: function(area, index){
        let shifts = area.shifts;
        let salesmen = this.state.salesmen;

        let constraints = this.getConstraints(salesmen, shifts);

        if(shifts.length > 0) {
            return (
                <div className="col-sm-12">
                    <div className="col-sm-5">
                        <h2>{area.area}</h2>
                        <div>
                            {shifts.map(this.renderShiftsOfArea)}
                        </div>
                    </div>
                    <div className="col-sm-offset-2 col-sm-5">
                        <h2>{constantsStrings.constraints_string}</h2>
                        <div>
                            {constraints.map(this.renderConstraint)}
                        </div>
                    </div>
                </div>
            )
        }
        else return (
            <div></div>
        )
    },

    renderShiftsOfDate: function(date){
        let shifts = this.state.newShifts
            .filter((shift) => (new Date(shift.startTime)).getTime() - (new Date(date)).getTime() == 0);
        date = moment(date).format('YYYY-MM-DD');

        let areas = new Set(shifts.map((shift) => shift.storeId.area));
        let areaToShifts = [];
        for(let area of areas) {
            areaToShifts.push({
                'area': area,
                'shifts': shifts.filter((shift) => shift.storeId.area == area)
            });
        }
        return (
            <div className="w3-container" style={{borderBottom: '2px solid #CCC', marginBottom: '20px'}}>
                <div className="col-sm-12 text-center">
                    <h1>{date}</h1>
                </div>
                <div style={{marginTop: '10px', marginBottom: '10px'}} className="col-sm-12">
                    {areaToShifts.map(this.renderArea)}
                </div>
            </div>
        );
    },

    render: function () {
        if(this.state.newShifts == undefined)
            return (
                <div>
                    Loading...
                    <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
                </div>
            );
        else if(this.state.newShifts.length == 0)
            return (
                <div className="w3-xxxlarge text-center">
                    <h1>{constantsStrings.noShifts_string}</h1>
                </div>
            );
        else {
            let dates = Array.from(new Set(this.state.newShifts.map((shift) => shift.startTime)))
                .sort(function(shift1, shift2){
                    return (new Date(shift1)).getTime() - (new Date(shift2)).getTime();
                });
            return (
                <div>
                    <div className="text-center col-sm-12" style={{marginBottom: '30px'}}>
                        <button className="w3-button w3-round w3-card-4 w3-ripple" style={styles.createShiftsButton}
                                onClick={this.onClickSubmitShifts}>
                            {constantStrings.publishShifts_string}
                        </button>
                    </div>
                    <div>
                        {dates.map(this.renderShiftsOfDate)}
                    </div>
                    <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
                </div>
            )
        }
    }
});

module.exports = ShiftsCreateMultipleShifts;
