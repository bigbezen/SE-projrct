/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var managerServices = require('../communication/managementServices');
var constantsStrings = require('../utils/ConstantStrings');
var userInfo = require('../models/user');

var UserDetails = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            editing: false,
        }
    },

    componentDidMount() {
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
        var newUser = new userInfo();
        newUser.username = this.refs.usernameBox.value;
        newUser.startDate = this.refs.startDateBox.value;
        newUser.endDate = this.refs.endDateBox.value;

        //personal
        newUser.personal.id = this.refs.idBox.value;
        newUser.personal.firstName = this.refs.firstNameBox.value;
        newUser.personal.lastName = this.refs.lastNameBox.value;
        newUser.personal.sex = this.refs.sexBox.value;
        newUser.personal.birtday = this.refs.birtdayBox.value;

        //contact
            //address
        newUser.contact.address.street = this.refs.street.value;
        newUser.contact.address.number = this.refs.number.value;
        newUser.contact.address.city = this.refs.city.value;
        newUser.contact.address.zip = this.refs.zip.value;

        newUser.contact.phone = this.refs.phone.value;
        newUser.contact.email = this.refs.email.value;

        //jobDetails
        newUser.jobDetails.userType = this.refs.userTypeBox.value;
        newUser.jobDetails.area = this.refs.areaBox.value;
        newUser.jobDetails.channel = this.refs.channelBox.value;

        var context = this.context;
        if (this.state.editing) {
            newUser._id = this.props.location.query._id;
            managerServices.editUser(newUser).then(function (n) {
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
            managerServices.addUser(newUser).then(function (n) {
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
    addNewUser: function() {
        return (
            <div className="jumbotron col-sm-offset-3 col-sm-6 text-center">
                <h1>משתמש</h1>
                <form onSubmit={this.handleSubmitUser} className="form-horizontal">

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.productName_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="usernameBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.retailPrice_string}</label>
                        <input type="date"
                               className="col-sm-4"
                               ref="startDateBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.salePrice_string}</label>
                        <input type="date" min={0}
                               className="col-sm-4"
                               ref="endDateBox"
                        />
                    </div>

                    <div>
                        <h7>פרטים אישיים</h7>
                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.category_string}</label>
                            <input type="text"
                                   className="col-sm-4"
                                   ref="idBox"
                            />
                        </div>

                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.subCategory_string}</label>
                            <input type="text"
                                   className="col-sm-4"
                                   ref="firstNameBox"
                            />
                        </div>

                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.minRequiredAmount_string}</label>
                            <input type="number" min={0}
                                   className="col-sm-4"
                                   ref="lastNameBox"
                            />
                        </div>

                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.notifyManager_string}</label>
                            <select class="w3-select w3-border" name="option">
                                <option value="" disabled selected>Choose your option</option>
                                <option value="1">Option 1</option>
                                <option value="2">Option 2</option>
                                <option value="3">Option 3</option>
                                ref="sexBox"
                            </select>
                        </div>

                        <div className="form-group ">
                            <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.productName_string}</label>
                            <input type="date"
                                   className="col-sm-4"
                                   ref="birtdayBox"
                            />
                        </div>
                    </div>
                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.retailPrice_string}</label>
                        <input type="number" min={0}
                               className="col-sm-4"
                               ref="streetBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.salePrice_string}</label>
                        <input type="number" min={0}
                               className="col-sm-4"
                               ref="numberBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.category_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="cityBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.subCategory_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="zipBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.minRequiredAmount_string}</label>
                        <input type="number" min={0}
                               className="col-sm-4"
                               ref="phoneBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.notifyManager_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="emailBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.subCategory_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="userTypeBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.minRequiredAmount_string}</label>
                        <input type="number" min={0}
                               className="col-sm-4"
                               ref="areaBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.notifyManager_string}</label>
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
        console.log('aviram11111');
        console.log(this.props.location.query);
        console.log('aviram22222');
                this.currProduct = this.props.location.query;
        this.refs.usernameBox.value = this.currProduct.username;
        this.refs.startDateBox.value = this.currProduct.startDate;
        this.refs.endDateBox.value = this.currProduct.endDate;
        //personal
        this.refs.idBox.value = this.currProduct.personal.id;
        this.refs.firstNameBox.value = this.currProduct.personal.firstName;
        this.refs.lastNameBox.value = this.currProduct.personal.lastName;
        this.refs.sexBox.value = this.currProduct.personal.sex;
        this.refs.birtdayBox.value = this.currProduct.personal.birtday;
        //contact
        //address
        this.refs.streetBox.value = this.currProduct.contact.address.street;
        this.refs.numberBox.value = this.currProduct.contact.address.number;
        this.refs.cityBox.value = this.currProduct.contact.address.city;
        this.refs.zipBox.value = this.currProduct.contact.address.zip;
        this.refs.phoneBox.value = this.currProduct.contact.address.phone;
        this.refs.emailBox.value = this.currProduct.contact.address.email;
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