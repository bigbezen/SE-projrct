/**
 * Created by lihiverchik on 17/12/2016.
 */

var React               = require('react');
var managementServices  = require('../communication/managementServices');
var constantsStrings    = require('../utils/ConstantStrings');
var shiftInfo           = require('../models/shift');
var flatten             = require('flat');
var moment              = require('moment');
var paths               = require('../utils/Paths');
var NotificationSystem  = require('react-notification-system');
var styles              = require('../styles/managerStyles/styles');
var userServices        = require('../communication/userServices');
var sorting             = require('../utils/SortingMethods');

var ReactBootstrap          = require('react-bootstrap');
var Collapse                = ReactBootstrap.Collapse;

import 'react-date-picker/index.css';
import { DateField, DatePicker } from 'react-date-picker';

var ShiftDetails = React.createClass({

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
    getInitialState: function () {
        this.setSessionId();
        this.setUserType();
        this.setShiftsStartDate();
        this.setShiftsEndDate();
        return {
            editing: false,
            storeId: '',
            salesmanId: '',
            shiftType: constantsStrings.shiftType_taste,
            shiftTypeEvent: false,
            storesForDropDown:[] ,
            salesmenForDropDown:[]
        }
    },

    checkDropDowns: function() {
        return (this.state.storeId!='' && this.state.shiftType!='');
    },

    handleStoreIdChange(event) {
        this.setState({storeId: event.target.value});
    },

    handleSalesmanIdChange(event) {
        this.setState({salesmanId: event.target.value});
    },

    handleShiftTypeChange(event) {
        var shiftTypeEvent = event.target.value == constantsStrings.shiftType_event;
        this.setState({
            shiftType: event.target.value,
            shiftTypeEvent: shiftTypeEvent
        });
    },

    componentDidMount() {
        var isEmptyVar = !(this.isEmpty(this.props.location.query));
        this.state.editing = isEmptyVar;

        if (this.state.editing) {
            this.setFields();
        }
    },

    getOptionsForStores: function() {
        var optionsForDropDown = [];
        var self = this;
        var notificationSystem = this.refs.notificationSystem;

        managementServices.getAllStores().then(function (val) {
            var arrayOfObjects = val.sort(sorting.storeSortingMethod);
            optionsForDropDown.push(<option disabled selected>{constantsStrings.dropDownChooseString}</option>);
            for (var i = 0; i < arrayOfObjects.length; i++) {
                var currOption = arrayOfObjects[i];
                optionsForDropDown.push(<option value={currOption._id}>{currOption.area + " - " + currOption.city + " - " + currOption.name + " - " + currOption.address}</option>);
            }
            self.setState({storesForDropDown: optionsForDropDown});
            if (self.state.editing) {
                self.refs.storeBox.value = self.state.storeId;
                self.refs.userBox.value = self.state.salesmanId;
            }
        })
    },

    sortSalesmenMethod: function(a, b){
        if(a.username > b.username)
            return 1;
        if(a.username < b.username)
            return -1;
        return 0;
    },

    getOptionsForSalesmen: function() {
        var optionsForDropDown = [];
        var self = this;
        var notificationSystem = this.refs.notificationSystem;

        managementServices.getAllUsers().then(function (arrayOfObjects) {
            arrayOfObjects = arrayOfObjects.sort(self.sortSalesmenMethod);
            optionsForDropDown.push(<option value="" disabled selected>{constantsStrings.dropDownChooseString}</option>);
            for (var i = 0; i < arrayOfObjects.length; i++) {
                var currOption = arrayOfObjects[i];
                if (currOption.jobDetails.userType == "salesman") {
                    optionsForDropDown.push(<option value={currOption._id}>{currOption.username}</option>);
                }
            }
            self.setState({salesmenForDropDown: optionsForDropDown});
        })
    },

    getOptionsForShiftType: function() {
        var arrayOfObjects = constantsStrings.shiftType;
        var optionsForDropDown = [];
        optionsForDropDown.push(<option disabled>{constantsStrings.dropDownChooseString}</option>);
        for (var i = 0; i < arrayOfObjects.length; i++) {
            var currOption = arrayOfObjects[i];
            if(currOption == constantsStrings.shiftType_taste)
                optionsForDropDown.push(<option selected value={currOption}>{currOption}</option>);
            else
                optionsForDropDown.push(<option value={currOption}>{currOption}</option>);
        }
        return optionsForDropDown;
    },

    isEmpty: function(obj) {
        for(var i in obj) { return false; }
        return true;
    },

    handleSubmitShift: function (e) {
        e.preventDefault();
        /*if (!this.checkDropDowns()) {
         alert('Invalid values. please make sure that you filled all of the fields');
         return;
         }*/

        var newShift = new shiftInfo();
        newShift.storeId = this.state.storeId;
        newShift.type = this.state.shiftType +
            (this.state.shiftType == constantsStrings.shiftType_event ? (" " + this.refs.eventType.value) : "");
        newShift.salesmanId = this.state.salesmanId;
        let date = this.refs.dateBox.state.value;
        newShift.startTime = moment(date).format('YYYY-MM-DD') + ' ' + this.refs.startTimeBox.value;
        newShift.startTime = moment(newShift.startTime).format('YYYY-MM-DD HH:mm Z');
        newShift.endTime = moment(date).format('YYYY-MM-DD') + ' ' +  this.refs.endTimeBox.value;
        newShift.endTime = moment(newShift.endTime).format('YYYY-MM-DD HH:mm Z');

        var context = this.context;
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        if (this.state.editing) {
            newShift._id = this.props.location.query._id;
            managementServices.editShift(newShift).then(function (n) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantsStrings.editSuccessMessage_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc',
                    onRemove: function (notification) {
                        var path = ""
                        if(self.props.location.query.status != "CREATED" && self.props.location.query.type == "טעימה") {
                            path = paths.manager_shifts_path
                        } else if(self.props.location.query.status != "CREATED") {
                            path = paths.manager_shifts_events_path
                        } else {
                            path = paths.manager_shifts_creation_path
                        }
                        context.router.push({
                            pathname: path
                        })
                    }
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
        }else {
            managementServices.addShift(newShift).then(function (result) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantsStrings.addSuccessMessage_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc',
                    onRemove: function (notification) {
                        context.router.push({
                            pathname: paths.manager_shifts_creation_path
                        })
                    }
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
        }
    },

    getTitle: function() {
        if (this.state.editing) {
            return constantsStrings.editShift_string;
        }
        return constantsStrings.addShift_string;
    },

    getButtonString: function() {
        if (this.state.editing) {
            return constantsStrings.edit_string;
        }
        return constantsStrings.add_string;
    },

    renderShiftType: function() {
        if(this.state.editing)
            return (
                <select className="col-xs-4 col-xs-offset-2" disabled
                        onChange={this.handleShiftTypeChange} ref="shiftTypeBox">
                    {this.getOptionsForShiftType()}
                </select>
            );
        else
            return (
                <select className="col-xs-4 col-xs-offset-2"
                        onChange={this.handleShiftTypeChange} ref="shiftTypeBox">
                    {this.getOptionsForShiftType()}
                </select>
            );
    },

    renderEventType: function() {
        if(this.state.editing)
            return (
                <input type="text" disabled
                       className="col-xs-4 col-xs-offset-2"
                       ref="eventType"/>
            );
        else
            return (
                <input type="text"
                       className="col-xs-4 col-xs-offset-2"
                       ref="eventType"/>
            );
    },

    addNewShift: function() {
        return (
            <div className="jumbotron col-xs-offset-3 col-xs-6 w3-card-4" style={styles.editBodyStyle}>

                <form onSubmit={this.handleSubmitShift} className="form-horizontal text-right w3-text-black">
                    <div className="form-group">
                        <h1 className="col-xs-offset-1 col-xs-10 w3-xxlarge">
                            <b>{this.getTitle()}</b>
                        </h1>
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.storeName_string}:</label>
                    </div>
                    <div className="form-group ">
                        <select className="col-xs-4 col-xs-offset-2"
                                onChange={this.handleStoreIdChange} ref="storeBox" >
                            {this.state.storesForDropDown}
                        </select>
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.username_string}:</label>
                    </div>
                    <div className="form-group ">
                        <select className="col-xs-4 col-xs-offset-2"
                                onChange={this.handleSalesmanIdChange} ref="userBox" >
                            {this.state.salesmenForDropDown}
                        </select>
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.shiftType_string}:</label>
                    </div>
                    <div className="form-group ">
                        {this.renderShiftType()}
                    </div>

                    <Collapse in={this.state.shiftTypeEvent}>
                        <div>
                            <div className="form-group">
                                <label className="col-xs-4 col-xs-offset-2">{constantsStrings.eventType_string}:</label>
                            </div>
                            <div className="form-group">
                                {this.renderEventType()}
                            </div>
                        </div>
                    </Collapse>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.date_string}:</label>
                    </div>
                    <div className="form-group ">
                        <div className="col-xs-offset-2">
                            <DateField
                                dateFormat="DD-MM-YYYY"
                                forceValidDate={true}
                                defaultValue={(new Date()).getTime()}
                                ref="dateBox"
                                updateOnDateClick={true}
                                collapseOnDateClick={true}
                            >
                            </DateField>
                        </div>
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.startTime_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="time"
                               className="col-xs-4 col-xs-offset-2"
                               ref="startTimeBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.endTime_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="time"
                               className="col-xs-4 col-xs-offset-2"
                               ref="endTimeBox"
                        />
                    </div>

                    <div className="form-group">
                        <button
                            className="w3-button w3-card-4 col-xs-4 col-xs-offset-2 w3-round w3-ripple" style={styles.editStyle}
                            type="submit">
                            {this.getButtonString()}
                        </button>
                    </div>
                </form>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    setFields: function () {
        let currShift = flatten.unflatten(this.props.location.query);

        console.log(this.currShift);

        this.state.shiftType =  currShift.type;
        this.state.storeId = currShift.storeId._id;
        if(currShift.salesmanId != undefined) {
            this.state.salesmanId = currShift.salesmanId._id;
            this.refs.userBox.value = currShift.salesmanId.username;
        }
        this.refs.storeBox.value = currShift.storeId._id;

        if(currShift.type.includes(constantsStrings.shiftType_event)) {
            this.refs.shiftTypeBox.value = currShift.type.split(' ')[0];
            if(currShift.type.split(' ').length > 1) {
                this.refs.eventType.value = currShift.type.split(' ')[1];
                this.state.shiftTypeEvent = true;
            }
        }
        else
            this.refs.shiftTypeBox.value =  currShift.type;

        this.refs.dateBox.state.value =  moment(currShift.startTime).toDate().getTime();
        this.refs.startTimeBox.value = moment(currShift.startTime).format('HH:mm');
        this.refs.endTimeBox.value = moment(currShift.endTime).format('HH:mm');
    },

    render: function () {
        if (this.state.storesForDropDown.length == 0) {
            this.getOptionsForStores();
        }
        if (this.state.salesmenForDropDown.length == 0) {
            this.getOptionsForSalesmen();
        }
        return this.addNewShift();
    }
});

module.exports = ShiftDetails;