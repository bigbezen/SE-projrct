/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var managementServices = require('../communication/managementServices');
var constantsStrings = require('../utils/ConstantStrings');
var userInfo = require('../models/user');
var flatten = require('flat');
var ReactBootstrap = require("react-bootstrap");
var moment = require('moment');

var DropDownInput = ReactBootstrap.DropdownButton;

var UserDetails = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            editing: false,
            gender: '',
            role: '',
            area:'',
            channel:''
        }
    },

    checkDropDowns: function() {
        return (this.state.gender!='' && this.state.role!='' && this.state.area!='' && this.state.channel!='');
    },

    handleGenderChange(event) {
        this.setState({gender: event.target.value});
    },

    handleUserTypeChange(event) {
        this.setState({role: event.target.value});
    },

    handleAreaChange(event) {
        this.setState({area: event.target.value});
    },

    handleChannelChange(event) {
        this.setState({channel: event.target.value});
    },

    componentDidMount() {
        var isEmptyVar = !(this.isEmpty(this.props.location.query));
        console.log(!(this.isEmpty(this.props.location.query)));
        this.state.editing = isEmptyVar;

        console.log(this.state.editing);
        if (this.state.editing) {
            this.setFields();
        }
    },

    getOptionsForRole: function() {
        var arrayOfObjects = constantsStrings.userRoleForDropDown;
        var optionsForDropDown = [];
        optionsForDropDown.push(<option disabled selected>{constantsStrings.dropDownChooseString}</option>);
        for (var i = 0; i < arrayOfObjects.length; i++) {
            var currOption = arrayOfObjects[i];
            optionsForDropDown.push(<option value={currOption[0]}>{currOption[1]}</option>);
        }
        return optionsForDropDown;
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
        var newUser = new userInfo();
        newUser.username = this.refs.usernameBox.value;
        newUser.startDate = this.refs.startDateBox.value;
        newUser.endDate = this.refs.endDateBox.value;

        //personal
        newUser.personal = {};
        console.log(this.refs.idBox.value);
        console.log('id');
        newUser.personal.id = this.refs.idBox.value;
        newUser.personal.firstName = this.refs.firstNameBox.value;
        newUser.personal.lastName = this.refs.lastNameBox.value;
        newUser.personal.sex = this.state.gender;
        newUser.personal.birtday = this.refs.birtdayBox.value;

        //contact
            //address
        newUser.contact = {};
        newUser.contact.address = {};
        newUser.contact.address.street = this.refs.streetBox.value;
        newUser.contact.address.number = this.refs.numberBox.value;
        newUser.contact.address.city = this.refs.cityBox.value;
        newUser.contact.address.zip = this.refs.zipBox.value;

        newUser.contact.phone = this.refs.phoneBox.value;
        newUser.contact.email = this.refs.emailBox.value;

        //jobDetails
        newUser.jobDetails = {};
        newUser.jobDetails.userType = this.state.role;
        newUser.jobDetails.area = this.state.area;
        newUser.jobDetails.channel = this.state.channel;

        var context = this.context;
        if (this.state.editing) {
            newUser._id = this.props.location.query._id;
            managementServices.editUser(newUser).then(function (n) {
                if(n){
                    var val = n;
                    if (val.success) {
                        alert('edit succeed');
                        context.router.push({
                            pathname: '/LoggedIn/Home'
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
            managementServices.addUser(newUser).then(function (n) {
                if(n){
                    var val = n;
                    if (val.success) {
                        alert('add succeed');
                        context.router.push({
                            pathname: '/LoggedIn/Home'
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
    addNewUser: function() {
        return (
            <div className="jumbotron col-sm-offset-3 col-sm-6 text-center">
                <h1>משתמש</h1>
                <form onSubmit={this.handleSubmitUser} className="form-horizontal">

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.username_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="usernameBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.role_string}</label>
                        <select className="col-sm-4" onChange={this.handleUserTypeChange} ref="userTypeBox">
                            {this.getOptionsForRole()}
                        </select>

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

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.startDate_string}</label>
                        <input type="date"
                               className="col-sm-4"
                               ref="startDateBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.endDate_string}</label>
                        <input type="date" min={0}
                               className="col-sm-4"
                               ref="endDateBox"
                        />
                    </div>

                    <div>
                        <h7>פרטים אישיים</h7>
                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.userID_string}</label>
                            <input type="text"
                                   className="col-sm-4"
                                   ref="idBox"
                            />
                        </div>

                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.firstName_string}</label>
                            <input type="text"
                                   className="col-sm-4"
                                   ref="firstNameBox"
                            />
                        </div>

                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.lastName_string}</label>
                            <input type="text"
                                   className="col-sm-4"
                                   ref="lastNameBox"
                            />
                        </div>

                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.gender_string}</label>
                            <select className="col-sm-4"  onChange={this.handleGenderChange} ref="sexBox" data="" >
                                {this.getOptions(constantsStrings.genderForDropdown)}
                            </select>
                        </div>

                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.birthDate_string}</label>
                            <input type="date"
                                   className="col-sm-4"
                                   ref="birtdayBox"
                            />
                        </div>

                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.phone_string}</label>
                            <input type="text"
                                   className="col-sm-4"
                                   ref="phoneBox"
                            />
                        </div>

                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.email_string}</label>
                            <input type="email"
                                   className="col-sm-4"
                                   ref="emailBox"
                            />
                        </div>
                    </div>

                    <div>
                        <h7> כתובת</h7>
                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.address_string}</label>
                            <input type="text"
                                   className="col-sm-4"
                                   ref="streetBox"
                            />
                        </div>

                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2"> {constantsStrings.street_string}</label>
                            <input type="text"
                                   className="col-sm-4"
                                   ref="numberBox"
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
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.zip_string}</label>
                            <input type="text"
                                   className="col-sm-4"
                                   ref="zipBox"
                            />
                        </div>
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
        this.currProduct = flatten.unflatten(this.props.location.query);

        this.state.gender = this.currProduct.personal.sex;
        this.state.role = this.currProduct.jobDetails.userType;
        this.state.area = this.currProduct.jobDetails.area;
        this.state.channel = this.currProduct.jobDetails.channel;
        this.refs.usernameBox.value = this.currProduct.username;
        this.refs.startDateBox.value = moment(this.currProduct.startDate).format('YYYY-MM-DD');
        this.refs.endDateBox.value = moment(this.currProduct.endDate).format('YYYY-MM-DD');
        //personal
        this.refs.idBox.value = this.currProduct.personal.id;
        this.refs.firstNameBox.value = this.currProduct.personal.firstName;
        this.refs.lastNameBox.value = this.currProduct.personal.lastName;
        this.refs.sexBox.value = this.currProduct.personal.sex;
        this.refs.birtdayBox.value = moment(this.currProduct.personal.birtday).format('YYYY-MM-DD');
        //contact
        //address
        this.refs.streetBox.value = this.currProduct.contact.address.street;
        this.refs.numberBox.value = this.currProduct.contact.address.number;
        this.refs.cityBox.value = this.currProduct.contact.address.city;
        this.refs.zipBox.value = this.currProduct.contact.address.zip;
        this.refs.phoneBox.value = this.currProduct.contact.phone;
        this.refs.emailBox.value = this.currProduct.contact.email;
        //jobDetails
        this.refs.userTypeBox.value = this.currProduct.jobDetails.userType;
        this.refs.areaBox.value = this.currProduct.jobDetails.area;
        this.refs.channelBox.value = this.currProduct.jobDetails.channel;
    },
    render: function () {
        return this.addNewUser();
    }
});

module.exports = UserDetails;