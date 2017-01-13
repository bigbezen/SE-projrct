/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var managerServices = require('../communication/managementServices');
var constantsStrings = require('../utils/ConstantStrings');
var storeInfo = require('../models/store');

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
                    alert('edit succeed');
                    context.router.push({
                        pathname: '/LoggedIn/Home'
                    })
                }
                else{
                    alert('edit failed');
                    console.log("error");
                }
            })
        }else {
            managerServices.addStore(newStore).then(function (n) {
                if(n){
                    alert('add succeed');
                    context.router.push({
                        pathname: '/LoggedIn/Home'
                    })
                }
                else{
                    alert('add failed');
                    console.log("error");
                }
            })
        }
    },
    addNewStore: function() {
        return (
            <div className="jumbotron col-sm-offset-3 col-sm-6 text-center">
                <h1>חנות</h1>
                <form onSubmit={this.handleSubmitUser} className="form-horizontal">
                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.storeName_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="nameBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.managerName_string}</label>
                        <input type="text" min={0}
                               className="col-sm-4"
                               ref="managerNameBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.phone_string}</label>
                        <input type="text" min={0}
                               className="col-sm-4"
                               ref="phoneBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.city_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="cityBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.address_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="addressBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.area_string}</label>
                        <select className="col-sm-4" onChange={this.handleAreaChange} ref="areaBox">
                            {this.getOptions(constantsStrings.areaForDropdown)}
                        </select>
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.channel_string}</label>
                        <select className="col-sm-4" onChange={this.handleChannelChange} ref="channelBox">
                            {this.getOptions(constantsStrings.channelForDropdown)}
                        </select>
                    </div>

                    <div className="form-group">
                        <button
                            className="w3-btn w3-theme-d5 col-sm-4 col-sm-offset-5"
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