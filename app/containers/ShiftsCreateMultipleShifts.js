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
var sorting             = require('../utils/SortingMethods');

import 'react-date-picker/index.css';
import { DateField, DatePicker } from 'react-date-picker';

var ShiftsCreateMultipleShifts = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        this.setSessionId();
        this.setUserType();
        this.setShiftsStartDate();
        this.setShiftsEndDate();
        return {
            newShifts: undefined,
            salesmen: [],
            shiftsFilter: {},
            selectAll: true,
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
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
    componentDidMount: function(){

        let shiftStartDate = localStorage.getItem('shiftStartDate');
        if(!shiftStartDate){
            shiftStartDate = moment(new Date()).format('YYYY-MM-DD');
        }
        let shiftEndDate = localStorage.getItem('shiftEndDate');
        if(!shiftEndDate){
            shiftEndDate = moment(new Date()).format('YYYY-MM-DD');
        }

        this.setState({
            startDate: shiftStartDate,
            endDate: shiftEndDate
        });

        this.updateShifts(shiftStartDate, shiftEndDate);
    },

    updateShifts: function(startDate, endDate) {
        var notificationSystem = this.refs.notificationSystem;
        var self = this;
        localStorage.setItem('shiftStartDate', startDate);
        localStorage.setItem('shiftEndDate', endDate);
        this.setState({
            startDate: startDate,
            endDate: endDate
        });
        this.setState({
            showLoader: true
        });
        managementServices.getShiftsOfRange(startDate, endDate)
            .then(function(shifts){
                managementServices.getAllUsers()
                    .then(function(users){
                        let salesmen = users.filter((user) => user.jobDetails.userType == 'salesman');
                        shifts = shifts.filter((shift) => shift.status == constantsStrings.SHIFT_STATUS.CREATED)
                            .map(function(shift){
                                if(shift.salesmanId != undefined)
                                    shift.salesmanId = shift.salesmanId._id;
                                return shift;
                            });
                        let shiftsFilter = {};
                        for(let shift of shifts)
                            shiftsFilter[shift._id] = true;
                        self.setState({
                            newShifts: shifts,
                            salesmen: salesmen,
                            shiftsFilter: shiftsFilter,
                            showLoader: false
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
                self.setState({
                    showLoader: false
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
        let shiftsToPublish = this.state.newShifts.filter((shift) => (shift.salesmanId != undefined)
        && this.state.shiftsFilter[shift._id])
            .map(function(shift){
                let newShift = {
                    salesmanId: shift.salesmanId,
                    _id: shift._id
                };
                return newShift;
            });
        if(shiftsToPublish.length > 0){
            this.setState({
                showLoader: true
            });
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
                    self.setState({
                        showLoader: false
                    });
                });
        }
        else{
            this.context.router.push({
                pathname: paths.manager_shifts_creation_path
            })
        }
    },

    getSalesmanOptions: function(shift, availableSalesmen, nonAvailableSalesmen){
        let salesmanId = "";
        let salesmen = Object.keys(availableSalesmen).map((id) => availableSalesmen[id]);
        var optionsForDropdown = [];
        let isDefaultSelected = true;
        if(shift.salesmanId == undefined){
            if(!(shift.storeId.defaultSalesman == undefined ||
                (shift.storeId.defaultSalesman != undefined && availableSalesmen[shift.storeId.defaultSalesman] == undefined))) {
                salesmanId = shift.storeId.defaultSalesman;
                isDefaultSelected = false;
            }
        }
        else{
            salesmanId = shift.salesmanId;
            if(nonAvailableSalesmen[salesmanId] == undefined && availableSalesmen[salesmanId] == undefined) {
                let salesman = this.state.salesmen.filter((curr) => curr._id == salesmanId)[0];
                salesmen.push(salesman);
                isDefaultSelected = false;
            }
        }
        if(isDefaultSelected)
            optionsForDropdown.push(<option selected>{constantsStrings.dropDownChooseString}</option>);
        else
            optionsForDropdown.push(<option>{constantsStrings.dropDownChooseString}</option>);


        salesmen = salesmen.sort(sorting.salesmenSortingMethod);
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
        let nonAvailable = {};
        for(let constraint of constraints){
            if(constraint.isAvailable == true || (constraint.comment != undefined && constraint.comment.length > 0))
                constraintsObj[constraint.salesmanId] = constraint;
            else {
                if (!constraint.isAvailable) {
                    nonAvailable[constraint.salesmanId] = true;
                }
            }
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
        return {
            constraints: constraints.sort(sorting.constraintsSortingMethod),
            nonAvailable: nonAvailable
        };
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

    onChangeShiftsFilter: function(shiftId){
        let shiftsFilter = this.state.shiftsFilter;
        let newSelectAll = this.state.selectAll;
        shiftsFilter[shiftId] = !shiftsFilter[shiftId];
        if (!shiftsFilter[shiftId]) {
            newSelectAll = false;
        }
        this.setState({
            shiftsFilter: shiftsFilter,
            selectAll: newSelectAll
        });
    },

    onChangeSelectAll: function(e){
        let newSelectAll = !this.state.selectAll;
        let shiftsFilter = this.state.shiftsFilter;

        for(let id of Object.keys(shiftsFilter)){
            shiftsFilter[id] = newSelectAll;
        }
        this.setState({
            shiftsFilter: shiftsFilter,
            selectAll: newSelectAll
        })

    },

    renderShiftsOfArea: function(shift, availableSalesmen, nonAvailableSalesmen) {
        let self = this;
        return (
            <div className="col-xs-12 w3-card-2 w3-round" style={styles.shiftRowStyle}>
                <input className="col-sm-1" style={{height: '20px'}} type="checkbox" ref={shift._id} checked={this.state.shiftsFilter[shift._id]}
                       onChange={() => this.onChangeShiftsFilter(shift._id)}/>
                <p className="col-sm-7">{shift.storeId.city + " - " + shift.storeId.name}</p>
                <select style={{color: 'black', marginTop: '3px'}}
                        className="col-sm-4 w3-round" ref={shift._id}
                        onChange={() => this.onChangeSalesman(shift)}>
                    {this.getSalesmanOptions(shift, availableSalesmen, nonAvailableSalesmen)}
                </select>

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
        let nonAvailableSalesmen = constraints.nonAvailable;
        constraints = constraints.constraints;
        let constraintSalesmen = constraints.map((cons) => cons.salesman);
        let availableSalesmen = {};
        for(let salesman of constraintSalesmen) {
            availableSalesmen[salesman._id] = salesman;
        }

        if(shifts.length > 0) {
            return (
                <div className="col-sm-12">
                    <div className="col-sm-5">
                        <h2>{area.area}</h2>
                        <div>
                            {shifts.map((shift) => this.renderShiftsOfArea(shift, availableSalesmen, nonAvailableSalesmen))}
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
            .filter((shift) => (new Date(moment(shift.startTime).format('YYYY-MM-DD'))).getTime()
            - (new Date(date)).getTime() == 0);
        date = moment(date).format('DD-MM-YYYY');

        let areas = new Set(shifts.map((shift) => shift.storeId.area));
        let areaToShifts = [];
        for(let area of areas) {
            areaToShifts.push({
                'area': area,
                'shifts': shifts.filter((shift) => shift.storeId.area == area)
            });
        }
        return (
            <div className="w3-container" style={{borderBottom: '6px solid #BBB', marginBottom: '20px'}}>
                <div className="col-sm-12 text-center">
                    <h1><b>{date}</b></h1>
                </div>
                <div style={{marginTop: '10px', marginBottom: '10px'}} className="col-sm-12">
                    {areaToShifts.map(this.renderArea)}
                </div>
            </div>
        );
    },

    changeStartDate: function (date) {
        var startDateValue = moment(date).toDate();
        var endDateValue = new Date(this.state.endDate);
        if(startDateValue.getTime() <= endDateValue.getTime())
            this.updateShifts(startDateValue,endDateValue);
    },
    changeEndDate: function (date) {
        var startDateValue = new Date(this.state.startDate);
        var endDateValue = moment(date).toDate();
        if(startDateValue.getTime() <= endDateValue.getTime())
            this.updateShifts(startDateValue,endDateValue);
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

    render: function() {
        return (
            <div className="w3-container">
                <div className="col-sm-12">
                    <div>
                        <p className="col-xs-2" style={styles.dateLabel}>{constantStrings.startDate_string}:</p>
                        <DateField
                            dateFormat="DD-MM-YYYY"
                            forceValidDate={true}
                            value={(new Date(this.state.startDate)).getTime()}
                            ref="startDateBox"
                            updateOnDateClick={true}
                            collapseOnDateClick={true}
                            onChange={(dateString, { dateMoment, timestamp }) => this.changeStartDate(dateMoment)}>
                        </DateField>
                    </div>
                    <div>
                        <p className="col-xs-2" style={styles.dateLabel}>{constantStrings.endDate_string}:</p>
                        <DateField
                            dateFormat="DD-MM-YYYY"
                            forceValidDate={true}
                            value={(new Date(this.state.endDate)).getTime()}
                            ref="endDateBox"
                            updateOnDateClick={true}
                            collapseOnDateClick={true}
                            onChange={(dateString, { dateMoment, timestamp }) => this.changeEndDate(dateMoment)}>
                        </DateField>
                    </div>
                </div>
                {this.loader()}
                {this.renderPage()}
            </div>
        )
    },

    renderPage: function () {
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
            let dates = Array.from(new Set(this.state.newShifts.map((shift) => moment(shift.startTime).format('YYYY-MM-DD'))))
                .sort(function(date1, date2){
                    return (new Date(date1)).getTime() - (new Date(date2)).getTime();
                });
            return (
                <div>
                    <div className="text-center col-sm-12" style={{marginBottom: '30px'}}>
                        <button className="w3-button w3-round w3-card-4 w3-ripple" style={styles.createShiftsButton}
                                onClick={this.onClickSubmitShifts}>
                            {constantStrings.publishShifts_string}
                        </button>
                    </div>
                    <div className="col-sm-12">
                        <label className="col-sm-2">{(this.state.selectAll ? constantStrings.diselectAll_string : constantsStrings.selectAll_string) + ":"}</label>
                        <input type="checkbox" checked={this.state.selectAll} style={{height: '20px', width: '20px'}}
                               onChange={this.onChangeSelectAll} />
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

