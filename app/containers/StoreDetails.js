/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var managerServices = require('../communication/managementServices');
var constantsStrings = require('../utils/ConstantStrings');
var storeInfo = require('../models/store');
var paths = require('../utils/Paths');

var StoreDetails = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            editing: false,
            area:'',
            channel:''
        }
    },

    handleAreaChange(event) {
        this.setState({area: event.target.value});
    },

    handleChannelChange(event) {
        this.setState({channel: event.target.value});
    },

    componentDidMount() {
        console.log('check props');
        var isEmptyVar = !(this.isEmpty(this.props.location.query));
        console.log(!(this.isEmpty(this.props.location.query)));
        this.state.editing = isEmptyVar;
        console.log(this.state.editing);
        if (this.state.editing) {
            this.setFields();
        }
    },

    checkDropDowns: function() {
        return (this.state.area!='' && this.state.channel!='');
    },

    getOptions: function(arrayOfObjects) {
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

    handleSubmitUser: function (e) {
        e.preventDefault();
        if (!this.checkDropDowns()) {
            alert('Invalid values. please make sure that you filled all of the fields');
            return;
        }
        console.log('we are here');
        var newStore = new storeInfo();
        newStore.name = this.refs.nameBox.value;
        newStore.managerName = this.refs.managerNameBox.value;
        newStore.phone = this.refs.phoneBox.value;
        newStore.city = this.refs.cityBox.value;
        newStore.address = this.refs.addressBox.value;
        newStore.area = this.state.area;
        newStore.channel = this.state.channel;
        var context = this.context;
        if (this.state.editing) {
            newStore._id = this.props.location.query._id;
            managerServices.editStore(newStore).then(function (n) {
                if(n){
                    var val = n;
                    if (val.success) {
                        alert('edit succeed');
                        context.router.push({
                            pathname: paths.manager_stores_path
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
            managerServices.addStore(newStore).then(function (n) {
                if(n){
                    var val = n;
                    if (val.success) {
                        alert('add succeed');
                        context.router.push({
                            pathname: paths.manager_stores_path
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
    addNewStore: function() {
        return (
            <div className="jumbotron col-sm-offset-3 col-sm-6 w3-theme-l4">
                <form onSubmit={this.handleSubmitUser} className="form-horizontal text-right">
                    <div className="form-group">
                        <h1 className="col-sm-offset-1 col-sm-9 w3-xxlarge">
                            <b>{constantsStrings.addStore_string}</b>
                        </h1>
                    </div>
                    <div className="form-group ">
                        <label className="col-sm-4 col-sm-offset-2">{constantsStrings.storeName_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="text"
                               className="col-sm-4 col-sm-offset-2"
                               ref="nameBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-sm-4 col-sm-offset-2">{constantsStrings.managerName_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="text" min={0}
                               className="col-sm-4 col-sm-offset-2"
                               ref="managerNameBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-sm-4 col-sm-offset-2">{constantsStrings.phone_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="text" min={0}
                               className="col-sm-4 col-sm-offset-2"
                               ref="phoneBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-sm-4 col-sm-offset-2">{constantsStrings.city_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="text"
                               className="col-sm-4 col-sm-offset-2"
                               ref="cityBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-sm-4 col-sm-offset-2">{constantsStrings.address_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="text"
                               className="col-sm-4 col-sm-offset-2"
                               ref="addressBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-sm-4 col-sm-offset-2">{constantsStrings.area_string}:</label>
                    </div>
                    <div className="form-group ">
                        <select className="col-sm-4 col-sm-offset-2" onChange={this.handleAreaChange} ref="areaBox">
                            {this.getOptions(constantsStrings.areaForDropdown)}
                        </select>
                    </div>


                    <div className="form-group ">
                        <label className="col-sm-4 col-sm-offset-2">{constantsStrings.channel_string}:</label>
                    </div>
                    <div className="form-group ">
                        <select className="col-sm-4 col-sm-offset-2" onChange={this.handleChannelChange} ref="channelBox">
                            {this.getOptions(constantsStrings.channelForDropdown)}
                        </select>
                    </div>


                    <div className="form-group">
                        <button
                            className="w3-btn w3-theme-d5 col-sm-4 col-sm-offset-2"
                            type="submit">
                            {constantsStrings.edit_string}
                        </button>
                    </div>
                </form>
            </div>
        )
    },

    setFields: function () {
        this.currSrure = this.props.location.query;
        this.state.area =  this.currSrure.area;
        this.state.channel = this.currSrure.channel;
        this.refs.nameBox.value = this.currSrure.name;
        this.refs.managerNameBox.value = this.currSrure.managerName;
        this.refs.phoneBox.value = this.currSrure.phone;
        this.refs.cityBox.value = this.currSrure.city;
        this.refs.addressBox.value = this.currSrure.address;
        this.refs.areaBox.value = this.currSrure.area;
        this.refs.channelBox.value = this.currSrure.channel;
    },
    render: function () {
        return this.addNewStore();
    }
});

module.exports = StoreDetails;