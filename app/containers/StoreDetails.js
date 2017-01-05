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
        }
    },

    componentDidMount() {
        console.log('check props');
        var isEmptyVar = !(this.isEmpty(this.props.location.query));
        console.log(!(this.isEmpty(this.props.location.query)));
        // this.setState({
        this.state.editing = isEmptyVar;
        //editing: {isEmptyVar}
        //    });
        console.log(this.state.editing);
        if (this.state.editing) {
            this.setFields();
        }
    },

    isEmpty: function(obj) {
        for(var i in obj) { return false; }
        return true;
    },

    handleSubmitUser: function (e) {
        e.preventDefault();
        console.log('we are here');
        var newStore = new storeInfo();
        newStore.name = this.refs.nameBox.value;
        newStore.managerName = this.refs.managerNameBox.value;
        newStore.phone = this.refs.phoneBox.value;
        newStore.city = this.refs.cityBox.value;
        newStore.address = this.refs.addressBox.value;
        newStore.area = this.refs.areaBox.value;
        newStore.channel = this.refs.channelBox.checked;
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
                        <input type="text" min={0}
                               className="col-sm-4"
                               ref="areaBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.channel_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="channelBox"
                        />
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