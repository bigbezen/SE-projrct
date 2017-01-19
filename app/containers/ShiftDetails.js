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
                } else {
                    alert('cannot load the list of stores. please try again later');
                }
            }
            else {
                alert('cannot load the list of stores. please try again later');
            }
        })
    },

    getOptionsForSalesmen: function() {
        var optionsForDropDown = [];
        var self = this;
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
                    alert('cannot load the list of stores. please try again later');
                }
            }
            else {
                alert('cannot load the list of stores. please try again later');
            }
        })
    },

    getOptionsForShiftType: function() {
        var arrayOfObjects = ['רגילה','טעימות']; // todo: remove to constants
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
        if (!this.checkDropDowns()) {
            alert('Invalid values. please make sure that you filled all of the fields');
            return;
        }

        var newShift = new shiftInfo();
        newShift.storeId = this.state.storeId;
        newShift.type = this.state.shiftType;
        newShift.salesmanId = this.state.salesmanId;
        newShift.startTime = this.refs.startTimeBox.value;
        newShift.endTime = this.refs.endTimeBox.value;

        var context = this.context;
        if (this.state.editing) {
            newShift._id = this.props.location.query._id;
            managementServices.editShift(newShift).then(function (n) {
                if(n){
                    var val1 = n;
                    if (val1.success) {
                        managementServices.publishShifts(newShift).then(function (n) {
                            if (n) {
                                var val2 = n;
                                if (val2.success) {
                                    alert('publish succeed');
                                    context.router.push({
                                        pathname: paths.manager_home_path
                                    })
                                }
                            } else {
                                alert('edit failed. please check your parameters');
                            }
                        })
                    } else {
                        alert('edit failed. please check your parameters');
                    }
                }
                else{
                    alert('edit failed. please check your parameters');
                    console.log("error");
                }
            })
        }else {
            managementServices.addShift(newShift).then(function (n) {
                if(n){
                    var val1 = n;
                    if (val1.success) {
                        managementServices.publishShifts(newShift).then(function (n) {
                            if (n) {
                                var val2 = n;
                                if (val2.success) {
                                    alert('publish succeed');
                                    context.router.push({
                                        pathname: paths.manager_home_path
                                    })
                                }
                            } else {
                                alert('add failed. please check your parameters');
                            }
                        })
                    } else {
                        alert('add failed. please check your parameters');
                    }
                }
                else{
                    alert('add failed. please check your parameters');
                    console.log("error");
                }
            })
        }
    },

    addNewShift: function() {
        return (
            <div className="jumbotron col-sm-offset-3 col-sm-6 text-center">
                <h1>משמרת</h1>
                <form onSubmit={this.handleSubmitShift} className="form-horizontal">

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.storeName_string}</label>
                        <select className="col-sm-4" onChange={this.handleStoreIdChange} ref="storeBox" >
                            {this.state.storesForDropDown}
                        </select>
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.username_string}</label>
                        <select className="col-sm-4" onChange={this.handleSalesmanIdChange} ref="userBox" >
                            {this.state.salesmenForDropDown}
                        </select>
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">סוג משמרת</label>
                        <select className="col-sm-4" onChange={this.handleShiftTypeChange} ref="shiftTypeBox">
                            {this.getOptionsForShiftType()}
                        </select>
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.startDate_string}</label>
                        <input type="datetime-local"
                               className="col-sm-4"
                               ref="startTimeBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.endDate_string}</label>
                        <input type="datetime-local"
                               className="col-sm-4"
                               ref="endTimeBox"
                        />
                    </div>

                    <div className="form-group">
                        <button
                            className="w3-btn w3-theme-d5 col-sm-4 col-sm-offset-5"
                            type="submit">
                            {constantsStrings.add_string}
                        </button>
                    </div>
                </form>
            </div>
        )
    },

    setFields: function () {
        this.currShift = flatten.unflatten(this.props.location.query);

        this.state.shishiftType =  this.currShift.type;
        this.state.storeId = this.currShift.store._id;
        this.state.salesmanId = this.currShift.salesman._id;

        this.refs.startTimeBox.type = "datetime";
        this.refs.endTimeBox.type = "datetime";

        this.refs.storeBox.value = this.currShift.store.name; //TODO- fix this
        this.refs.userBox.value = this.currShift.salesman.username;  //TODO- fix this
        this.refs.shiftTypeBox.value =  this.currShift.type;
        this.refs.startTimeBox.value = moment(this.currShift.startTime).format('YYYY-MM-DD hh:mm');
        this.refs.endTimeBox.value = moment(this.currShift.endTime).format('YYYY-MM-DD hh:mm');
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