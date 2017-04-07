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
var NotificationSystem = require('react-notification-system');
var styles = require('../styles/managerStyles/styles');
var DropDownInput = ReactBootstrap.DropdownButton;

var ShiftDetails = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            editing: false,
            storeId: '',
            salesmanId: '',
            shiftType:'',
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
        this.setState({shiftType: event.target.value});
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
        managementServices.getAllStores().then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    var arrayOfObjects = val.info;
                    optionsForDropDown.push(<option disabled selected>{constantsStrings.dropDownChooseString}</option>);
                    for (var i = 0; i < arrayOfObjects.length; i++) {
                        var currOption = arrayOfObjects[i];
                        optionsForDropDown.push(<option value={currOption._id}>{currOption.name}</option>);
                    }
                    self.setState({storesForDropDown: optionsForDropDown});
                    if (self.state.editing) {
                        self.refs.storeBox.value = self.state.storeId;
                        self.refs.userBox.value = self.state.salesmanId;
                    }
                } else {
                    notificationSystem.addNotification({
                        message: constantsStrings.errorMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            }
            else {
                notificationSystem.addNotification({
                    message: constantsStrings.errorMessage_string,
                    level: 'error',
                    autoDismiss: 5,
                    position: 'tc'
                });
            }
        })
    },

    getOptionsForSalesmen: function() {
        var optionsForDropDown = [];
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        managementServices.getAllUsers().then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    var arrayOfObjects = val.info;
                    optionsForDropDown.push(<option value="" disabled selected>{constantsStrings.dropDownChooseString}</option>);
                    for (var i = 0; i < arrayOfObjects.length; i++) {
                        var currOption = arrayOfObjects[i];
                        optionsForDropDown.push(<option value={currOption._id}>{currOption.username}</option>);
                    }
                    self.setState({salesmenForDropDown: optionsForDropDown});
                } else {
                    notificationSystem.addNotification({
                        message: constantsStrings.errorMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            }
            else {
                notificationSystem.addNotification({
                    message: constantsStrings.errorMessage_string,
                    level: 'error',
                    autoDismiss: 5,
                    position: 'tc'
                });
            }
        })
    },

    getOptionsForShiftType: function() {
        var arrayOfObjects = constantsStrings.shiftType;
        var optionsForDropDown = [];
        optionsForDropDown.push(<option disabled selected>{constantsStrings.dropDownChooseString}</option>);
        for (var i = 0; i < arrayOfObjects.length; i++) {
            var currOption = arrayOfObjects[i];
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
        newShift.type = this.state.shiftType;
        newShift.salesmanId = this.state.salesmanId;
        var startT = moment(this.refs.startTimeBox.value).format('YYYY-MM-DD hh:mm');
        var endT = moment(this.refs.endTimeBox.value).format('YYYY-MM-DD hh:mm');
        newShift.startTime = moment(this.refs.dateBox.value).format('YYYY-MM-DD') + 'T' + this.refs.startTimeBox.value + '+02:00';
        newShift.endTime = moment(this.refs.dateBox.value).format('YYYY-MM-DD') + 'T' +  this.refs.endTimeBox.value + '+02:00';

        var context = this.context;
        var notificationSystem = this.refs.notificationSystem;
        if (this.state.editing) {
            newShift._id = this.props.location.query._id;
            managementServices.editShift(newShift).then(function (n) {
                if(n){
                    var val1 = n;
                    if (val1.success) {
                        newShift._id = val1.info[0]._id;
                        managementServices.publishShifts(newShift).then(function (n) {
                            if (n) {
                                var val2 = n;
                                if (val2.success) {
                                    notificationSystem.addNotification({
                                        message: constantsStrings.editSuccessMessage_string,
                                        level: 'success',
                                        autoDismiss: 2,
                                        position: 'tc',
                                        onRemove: function (notification) {
                                            context.router.push({
                                                pathname: paths.manager_home_path
                                            })
                                        }
                                    });
                                }
                            } else {
                                notificationSystem.addNotification({
                                    message: constantsStrings.editFailMessage_string,
                                    level: 'error',
                                    autoDismiss: 5,
                                    position: 'tc'
                                });
                            }
                        })
                    } else {
                        notificationSystem.addNotification({
                            message: constantsStrings.editFailMessage_string,
                            level: 'error',
                            autoDismiss: 5,
                            position: 'tc'
                        });
                    }
                }
                else{
                    notificationSystem.addNotification({
                        message: constantsStrings.editFailMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
            })
        }else {
            managementServices.addShift(newShift).then(function (n) {
                if(n){
                    var val1 = n;
                    if (val1.success) {
                        newShift._id = val1.info[0]._id;
                        managementServices.publishShifts(newShift).then(function (n) {
                            if (n) {
                                var val2 = n;
                                if (val2.success) {
                                    notificationSystem.addNotification({
                                        message: constantsStrings.addSuccessMessage_string,
                                        level: 'success',
                                        autoDismiss: 2,
                                        position: 'tc',
                                        onRemove: function (notification) {
                                            context.router.push({
                                                pathname: paths.manager_home_path
                                            })
                                        }
                                    });
                                }
                            } else {
                                notificationSystem.addNotification({
                                    message: constantsStrings.addFailMessage_string,
                                    level: 'error',
                                    autoDismiss: 5,
                                    position: 'tc'
                                });
                            }
                        })
                    } else {
                        notificationSystem.addNotification({
                            message: constantsStrings.addFailMessage_string,
                            level: 'error',
                            autoDismiss: 5,
                            position: 'tc'
                        });
                    }
                }
                else{
                    notificationSystem.addNotification({
                        message: constantsStrings.addFailMessage_string,
                        level: 'error',
                        autoDismiss: 5,
                        position: 'tc'
                    });
                }
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
    addNewShift: function() {
        return (
            <div className="jumbotron col-xs-offset-3 col-xs-6 w3-theme-d4 w3-card-8">

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
                        <select className="col-xs-4 col-xs-offset-2"
                                onChange={this.handleShiftTypeChange} ref="shiftTypeBox">
                            {this.getOptionsForShiftType()}
                        </select>
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.date_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="date"
                               className="col-xs-4 col-xs-offset-2"
                               ref="dateBox"
                        />
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
                            className="w3-btn w3-card-4 w3-theme-d5 col-xs-4 col-xs-offset-2"
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
        this.currShift = flatten.unflatten(this.props.location.query);

        console.log(this.currShift);

        this.state.shishiftType =  this.currShift.type;
        this.state.storeId = this.currShift.store._id;
        this.state.salesmanId = this.currShift.salesman._id;

        this.refs.dateBox.type = "datetime";
        this.refs.startTimeBox.type = "datetime";
        this.refs.endTimeBox.type = "datetime";

        this.refs.storeBox.value = this.currShift.store._id; //TODO- fix this
        this.refs.userBox.value = this.currShift.salesman._id;  //TODO- fix this
        this.refs.shiftTypeBox.value =  this.currShift.type;
        this.refs.dateBox.value =  moment(this.currShift.startTime).format('YYYY-MM-DD');
        this.refs.startTimeBox.value = moment(this.currShift.startTime).format('HH:mm');
        this.refs.endTimeBox.value = moment(this.currShift.endTime).format('HH:mm');
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