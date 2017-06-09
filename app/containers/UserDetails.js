/**
 * Created by lihiverchik on 17/12/2016.
 */

var React               = require('react');
var managementServices  = require('../communication/managementServices');
var constantsStrings    = require('../utils/ConstantStrings');
var userInfo            = require('../models/user');
var flatten             = require('flat');
var moment              = require('moment');
var paths               = require('../utils/Paths');
var NotificationSystem  = require('react-notification-system');
var styles              = require('../styles/managerStyles/styles');
var userServices        = require('../communication/userServices');

import 'react-date-picker/index.css';
import { DateField, DatePicker } from 'react-date-picker';

var UserDetails = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        this.setSessionId();
        this.setUserType();
        return {
            editing: false,
            gender: '',
            role: '',
            prevUsername:''
        }
    },

    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },

    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },

    checkDropDowns: function() {
        return (this.state.gender!='' && this.state.role!='');
    },

    handleGenderChange(event) {
        this.setState({gender: event.target.value});
    },

    handleUserTypeChange(event) {
        this.setState({role: event.target.value});
    },

    componentDidMount() {
        var isEmptyVar = !(this.isEmpty(this.props.location.query));
        this.state.editing = isEmptyVar;

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
        /*if (!this.checkDropDowns()) {
            alert('Invalid values. please make sure that you filled all of the fields');
            return;
        }*/
        var newUser = new userInfo();
        newUser.username = this.refs.usernameBox.value;
        newUser.startDate = moment(this.refs.startDateBox.state.value).toDate();
        //personal
        newUser.personal = {};
        newUser.personal.id = this.refs.idBox.value;
        newUser.personal.firstName = this.refs.firstNameBox.value;
        newUser.personal.lastName = this.refs.lastNameBox.value;
        newUser.personal.sex = this.state.gender;
        newUser.personal.birthday = this.refs.birthdayBox.value;

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
        newUser.jobDetails.area = "area";
        newUser.jobDetails.channel = "channel";
        newUser.jobDetails.salary = this.refs.salaryBox.value;

        var context = this.context;
        var notificationSystem = this.refs.notificationSystem;
        if (this.state.editing) {
            newUser._id = this.props.location.query._id;
            var prevName = this.state.prevUsername;
            managementServices.editUser(prevName, newUser).then(function (n) {
                    notificationSystem.clearNotifications();
                    notificationSystem.addNotification({
                        message: constantsStrings.editSuccessMessage_string,
                        level: 'success',
                        autoDismiss: 1,
                        position: 'tc',
                        onRemove: function (notification) {
                            context.router.push({
                                pathname: paths.manager_users_path
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
            managementServices.addUser(newUser).then(function (n) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantsStrings.addSuccessMessage_string,
                    level: 'success',
                    autoDismiss: 2,
                    position: 'tc',
                    onRemove: function (notification) {
                        context.router.push({
                            pathname: paths.manager_users_path
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
            return constantsStrings.editUser_string;
        }
        return constantsStrings.addUser_string;
    },

    getButtonString: function() {
        if (this.state.editing) {
            return constantsStrings.edit_string;
        }
        return constantsStrings.add_string;
    },

    addNewUser: function() {
        return (
            <div className="jumbotron col-xs-offset-3 col-xs-6 w3-card-4" style={styles.editBodyStyle}>
                <form onSubmit={this.handleSubmitUser} className="form-horizontal text-right w3-text-black">
                    <div className="form-group">
                        <h1 className="col-xs-offset-1 col-xs-9 w3-xxlarge">
                            <b>{this.getTitle()}</b>
                        </h1>
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.username_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="text"
                               className="col-xs-4 col-xs-offset-2"
                               ref="usernameBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.role_string}:</label>
                    </div>
                    <div className="form-group ">
                        <select className="col-xs-4 col-xs-offset-2" onChange={this.handleUserTypeChange} ref="userTypeBox">
                            {this.getOptionsForRole()}
                        </select>
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.startDate_string}:</label>
                    </div>
                    <div className="form-group ">
                        <div className="col-xs-offset-2">
                            <DateField
                                dateFormat="DD-MM-YYYY"
                                forceValidDate={true}
                                defaultValue={(new Date()).getTime()}
                                ref="startDateBox"
                                updateOnDateClick={true}
                                collapseOnDateClick={true}
                            >
                            </DateField>
                        </div>
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.salary_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="number" min={0} default={25}
                               className="col-xs-4 col-xs-offset-2"
                               ref="salaryBox"
                        />
                    </div>

                    <div>
                        <div className="form-group">
                            <h4 className="col-xs-4 col-xs-offset-2"><b>פרטים אישיים</b></h4>
                        </div>
                        <div className="form-group ">
                            <label className="col-xs-4 col-xs-offset-2">{constantsStrings.userID_string}:</label>
                        </div>
                        <div className="form-group ">
                            <input type="text"
                                   className="col-xs-4 col-xs-offset-2"
                                   ref="idBox"
                            />
                        </div>


                        <div className="form-group ">
                            <label className="col-xs-4 col-xs-offset-2">{constantsStrings.firstName_string}:</label>
                        </div>
                        <div className="form-group ">
                            <input type="text"
                                   className="col-xs-4 col-xs-offset-2"
                                   ref="firstNameBox"
                            />
                        </div>


                        <div className="form-group ">
                            <label className="col-xs-4 col-xs-offset-2">{constantsStrings.lastName_string}:</label>
                        </div>
                        <div className="form-group ">
                            <input type="text"
                                   className="col-xs-4 col-xs-offset-2"
                                   ref="lastNameBox"
                            />
                        </div>


                        <div className="form-group ">
                            <label className="col-xs-4 col-xs-offset-2">{constantsStrings.gender_string}:</label>
                        </div>
                        <div className="form-group ">
                            <select className="col-xs-4 col-xs-offset-2"  onChange={this.handleGenderChange} ref="sexBox" data="" >
                                {this.getOptions(constantsStrings.genderForDropdown)}
                            </select>
                        </div>


                        <div className="form-group ">
                            <label className="col-xs-4 col-xs-offset-2">{constantsStrings.birthDate_string}:</label>
                        </div>
                        <div className="form-group ">
                            <input type="date"
                                   className="col-xs-4 col-xs-offset-2"
                                   ref="birthdayBox"
                            />
                        </div>


                        <div className="form-group ">
                            <label className="col-xs-4 col-xs-offset-2">{constantsStrings.phone_string}:</label>
                        </div>
                        <div className="form-group ">
                            <input type="text"
                                   className="col-xs-4 col-xs-offset-2"
                                   ref="phoneBox"
                            />
                        </div>


                        <div className="form-group ">
                            <label className="col-xs-4 col-xs-offset-2">{constantsStrings.email_string}:</label>
                        </div>
                        <div className="form-group ">
                            <input type="email"
                                   className="col-xs-4 col-xs-offset-2"
                                   ref="emailBox"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="form-group">
                            <h4 className="col-xs-4 col-xs-offset-2"><b> כתובת</b></h4>
                        </div>
                        <div className="form-group ">
                            <label className="col-xs-4 col-xs-offset-2">{constantsStrings.address_string}:</label>
                        </div>
                        <div className="form-group ">
                            <input type="text"
                                   className="col-xs-4 col-xs-offset-2"
                                   ref="streetBox"
                            />
                        </div>


                        <div className="form-group ">
                            <label className="col-xs-4 col-xs-offset-2"> {constantsStrings.street_string}:</label>
                        </div>
                        <div className="form-group ">
                            <input type="text"
                                   className="col-xs-4 col-xs-offset-2"
                                   ref="numberBox"
                            />
                        </div>


                        <div className="form-group ">
                            <label className="col-xs-4 col-xs-offset-2">{constantsStrings.city_string}:</label>
                        </div>
                        <div className="form-group ">
                            <input type="text"
                                   className="col-xs-4 col-xs-offset-2"
                                   ref="cityBox"
                            />
                        </div>


                        <div className="form-group ">
                            <label className="col-xs-4 col-xs-offset-2">{constantsStrings.zip_string}:</label>
                        </div>
                        <div className="form-group ">
                            <input type="text"
                                   className="col-xs-4 col-xs-offset-2"
                                   ref="zipBox"
                            />
                        </div>

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
        this.currProduct = flatten.unflatten(this.props.location.query);

        this.state.prevUsername = this.currProduct.username;
        this.state.gender = this.currProduct.personal.sex;
        this.state.role = this.currProduct.jobDetails.userType;
        this.refs.usernameBox.value = this.currProduct.username;
        this.refs.startDateBox.state.value = moment(this.currProduct.startDate).toDate().getTime();
        this.refs.salaryBox.value = this.currProduct.jobDetails.salary;
        //personal
        this.refs.idBox.value = this.currProduct.personal.id;
        this.refs.firstNameBox.value = this.currProduct.personal.firstName;
        this.refs.lastNameBox.value = this.currProduct.personal.lastName;
        this.refs.sexBox.value = this.currProduct.personal.sex;
        this.refs.birthdayBox.value = moment(this.currProduct.personal.birthday).format('YYYY-MM-DD');
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
    },

    render: function () {
        return this.addNewUser();
    }
});

module.exports = UserDetails;