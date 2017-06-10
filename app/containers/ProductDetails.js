/**
 * Created by lihiverchik on 17/12/2016.
 */

var React               = require('react');
var managementServices  = require('../communication/managementServices');
var constantsStrings    = require('../utils/ConstantStrings');
var productInfo         = require('../models/product');
var paths               = require('../utils/Paths');
var NotificationSystem  = require('react-notification-system');
var styles              = require('../styles/managerStyles/styles');
var userServices        = require('../communication/userServices');

var ProductDetails = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        this.setSessionId();
        this.setUserType();
        return {
            editing: false,
            category:'',
            subCategory:''
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

    componentDidMount() {
        var isEmptyVar = !(this.isEmpty(this.props.location.query));
        this.state.editing = isEmptyVar;
        if (this.state.editing) {
            this.setFields();
        }
    },

    checkDropDowns: function() {
        return (this.state.subCategory!='' && this.state.category!='');
    },

    isEmpty: function(obj) {
            for(var i in obj) { return false; }
            return true;
    },

    handleCategoryChange(event) {
        this.setState({category: event.target.value});
    },

    handleSubCategoryChange(event) {
        this.setState({subCategory: event.target.value});
    },

    getOptions: function(arrayOfObjects) {
        var optionsForDropDown = [];
        optionsForDropDown.push(<option>{constantsStrings.dropDownChooseString}</option>);
        for (var i = 0; i < arrayOfObjects.length; i++) {
            var currOption = arrayOfObjects[i];
            optionsForDropDown.push(<option value={currOption}>{currOption}</option>);
        }
        return optionsForDropDown;
    },

    getSubCategoryDropDown: function() {
        var arrayOfObjects = [];
        var optionsForDropDown = [];
        if (this.state.category == "יין") {
            arrayOfObjects = constantsStrings.subCategoryForDropdown_wine;
        } else if (this.state.category == "ספיריט") {
            arrayOfObjects = constantsStrings.subCategoryForDropdown_spirit;
        }
        if(this.state.subCategory == '')
            optionsForDropDown.push(<option selected>{constantsStrings.dropDownChooseString}</option>);
        else
            optionsForDropDown.push(<option>{constantsStrings.dropDownChooseString}</option>);
        for (var i = 0; i < arrayOfObjects.length; i++) {
            var currOption = arrayOfObjects[i];
            if(currOption == this.state.subCategory)
                optionsForDropDown.push(<option selected value={currOption}>{currOption}</option>);
            else
                optionsForDropDown.push(<option value={currOption}>{currOption}</option>);
        }
        return optionsForDropDown;
    },

    handleSubmitUser: function (e) {
        e.preventDefault();
        /*if (!this.checkDropDowns()) {
            alert('Invalid values. please make sure that you filled all of the fields');
            return;
        }*/
        //                        parseInt("the string you want to parse to int")
        var newProduct = new productInfo();
        newProduct.name = this.refs.nameBox.value;
        newProduct.retailPrice =  parseInt(this.refs.retailBox.value);
        newProduct.salePrice = 0;
        newProduct.category = this.state.category;
        newProduct.subCategory = this.state.subCategory;
        newProduct.minRequiredAmount =  0;
        newProduct.notifyManager = false;

        var context = this.context;
        var notificationSystem = this.refs.notificationSystem;
        if (this.state.editing) {
            newProduct._id = this.props.location.query._id;
            managementServices.editProduct(newProduct).then(function (val) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantsStrings.editSuccessMessage_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc',
                    onRemove: function (notification) {
                        context.router.push({
                            pathname: paths.manager_products_path
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
            managementServices.addProduct(newProduct).then(function (val) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantsStrings.addSuccessMessage_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc',
                    onRemove: function (notification) {
                        context.router.push({
                            pathname: paths.manager_products_path
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
          return constantsStrings.editProduct_string;
      }
      return constantsStrings.addProduct_string;
    },

    getButtonString: function() {
        if (this.state.editing) {
            return constantsStrings.edit_string;
        }
        return constantsStrings.add_string;
    },

    addNewProduct: function() {
        return (
            <div className="jumbotron col-xs-offset-3 col-xs-6 w3-card-4" style={styles.editBodyStyle}>
                <form onSubmit={this.handleSubmitUser} className="form-horizontal text-right w3-text-black">
                    <div className="form-group">
                        <h1 className="col-xs-offset-1 col-xs-9 w3-xxlarge">
                            <b>{this.getTitle()}</b>
                        </h1>
                    </div>

                    <div className="form-group">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.productName_string}:</label>

                    </div>
                    <div className="form-group">
                        <input type="text"
                               className="col-xs-4 col-xs-offset-2"
                               ref="nameBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.retailPrice_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="number" min={0}
                               className="col-xs-4 col-xs-offset-2"
                               ref="retailBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.category_string}:</label>
                    </div>
                    <div className="form-group ">
                        <select className="col-xs-4 col-xs-offset-2" onChange={this.handleCategoryChange} ref="categoryBox" data="" >
                            {this.getOptions(constantsStrings.categoryForDropdown)}
                        </select>
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.subCategory_string}:</label>
                    </div>
                    <div className="form-group ">
                        <select className="col-xs-4 col-xs-offset-2" onChange={this.handleSubCategoryChange} ref="subCategoryBox" data="" >
                            {this.getSubCategoryDropDown()}
                        </select>
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
        this.currProduct = this.props.location.query;
        this.state.category = this.currProduct.category;
        this.state.subCategory = this.currProduct.subCategory;
        this.refs.nameBox.value = this.currProduct.name;
        this.refs.retailBox.value = this.currProduct.retailPrice;
        //this.refs.saleBox.value = this.currProduct.salePrice;
        this.refs.categoryBox.value = this.currProduct.category;
        //this.refs.subCategoryBox.value = this.currProduct.subCategory;
        //this.refs.minAmountBox.value = this.currProduct.minRequiredAmount;
        //this.refs.notifyBox.checked = this.currProduct.notifyManager;
    },

    render: function () {
        return this.addNewProduct();
    }
});

module.exports = ProductDetails;